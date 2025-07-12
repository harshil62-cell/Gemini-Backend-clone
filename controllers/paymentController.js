const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

const subscribePro = asyncHandler(async (req, res) => {
  const user = req.user;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: "harshil@gmail.com", 
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: 'https://gemini-backend-clone.onrender.com/success',
    cancel_url: 'https://gemini-backend-clone.onrender.com/cancel',
    metadata: {
      userId: user.id,
    },
  });

  res.status(200).json({ url: session.url });
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      mobile: true,
      subscriptionTier: true,
    },
  });

  res.status(200).json({
    message: 'Subscription status fetched',
    data: {
      tier: user.subscriptionTier,
    },
  });
});

module.exports={
    subscribePro,
    getSubscriptionStatus,
};