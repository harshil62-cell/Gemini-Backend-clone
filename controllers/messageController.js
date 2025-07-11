const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const geminiQueue = require('../queues/geminiQueue');

// @desc  Ask gemini and get a response
// @route POST /chatroom/:id/message
// @access Private
const sendMessage = asyncHandler(async (req, res) => {
  const { id: chatroomId } = req.params;
  const { input } = req.body;
  
  if (!input) {
    res.status(400);
    throw new Error('Message input is required');
  }
  
  // Check if chatroom exists and belongs to user
  const chatroom = await prisma.chatroom.findUnique({
    where: { id: chatroomId },
    include: { user: true }
  });
  
  if (!chatroom || chatroom.userId !== req.user.id) {
    res.status(404);
    throw new Error('Chatroom not found');
  }
  
  // Get today's date range (start and end of day)
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  // Count user's messages from today only
  const todayMessageCount = await prisma.message.count({
    where: {
      chatroom: {
        userId: req.user.id
      },
      createdAt: {
        gte: startOfDay,
        lt: endOfDay
      }
    }
  });
  
  console.log(`User ${req.user.id} has ${todayMessageCount} messages today, tier: ${chatroom.user.subscriptionTier}`);
  
  // Block if on Basic tier and daily limit exceeded
  if (chatroom.user.subscriptionTier === 'Basic' && todayMessageCount >= 5) {
    res.status(403);
    throw new Error("Daily limit of 5 messages reached. Please try again tomorrow or upgrade your subscription.");
  }
  
  // Save user's message
  const message = await prisma.message.create({
    data: {
      input,
      chatroomId,
    },
  });
  
  // Add job to BullMQ queue to get Gemini response
  await geminiQueue.add('getResponse', {
    messageId: message.id,
    input,
  });
  
  res.status(202).json({
    message: 'Message sent. Gemini is processing your response...',
    data: message,
    remainingMessages: chatroom.user.subscriptionTier === 'Basic' 
      ? Math.max(0, 5 - (todayMessageCount + 1)) 
      : 'unlimited',
    dailyLimitInfo: {
      used: todayMessageCount + 1,
      total: chatroom.user.subscriptionTier === 'Basic' ? 5 : 'unlimited',
      resetsAt: endOfDay.toISOString()
    }
  });
});

module.exports = sendMessage;