const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const prisma = new PrismaClient();

// @desc    Creates a new chatroom
//for the authenticated user
// @route   POST /chatroom
// @access  Private
const createChatroom = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Chatroom name is required');
  }

  const chatroom = await prisma.chatroom.create({
    data: {
      name,
      userId: req.user.id,
    },
  });

  res.status(201).json({
    message: 'Chatroom created successfully',
    data: chatroom,
  });
});

// @desc    Get all chatrooms for current user
// @route   GET /chatroom
// @access  Private
const getChatrooms = asyncHandler(async (req, res) => {
  const chatrooms = await prisma.chatroom.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    message: 'Chatrooms fetched successfully',
    data: chatrooms,
  });
});

// @desc    Get a single chatroom by ID
// @route   GET /chatroom/:id
// @access  Private
const getChatroomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chatroom = await prisma.chatroom.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!chatroom || chatroom.userId !== req.user.id) {
    res.status(404);
    throw new Error('Chatroom not found');
  }

  res.status(200).json({
    message: 'Chatroom details fetched successfully',
    data: chatroom,
  });
});

module.exports = {
  createChatroom,
  getChatrooms,
  getChatroomById,
};
