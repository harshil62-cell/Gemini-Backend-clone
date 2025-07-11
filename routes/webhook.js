const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Stripe webhook expects raw body, so middleware will be set in index.js
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      return res.status(400).send('Missing userId in metadata');
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionTier: 'pro' },
      });

      console.log(`✅ Upgraded user ${userId} to Pro`);
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
