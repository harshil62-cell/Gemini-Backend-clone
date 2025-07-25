/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Gemini Backend Clone API
 *   version: 1.0.0
 *   description: API documentation for Gemini Backend Clone
 * servers:
 *   - url: https://gemini-backend-clone.onrender.com
 *     description: Production server
 *   - url: http://localhost:5000
 *     description: Local development server
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user with mobile number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for authentication
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

/**
 * @swagger
 * /chatroom:
 *   post:
 *     summary: Create a new chatroom
 *     tags: [Chatroom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chatroom created
 */

/**
 * @swagger
 * /chatroom/{id}:
 *   get:
 *     summary: Get chatroom details
 *     tags: [Chatroom]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chatroom details
 */

/**
 * @swagger
 * /chatroom/{id}/message:
 *   post:
 *     summary: Send a message to Gemini
 *     tags: [Message]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *     responses:
 *       202:
 *         description: Message sent to Gemini
 */

/**
 * @swagger
 * /subscribe/pro:
 *   post:
 *     summary: Subscribe to Pro plan (Stripe Checkout)
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Stripe Checkout URL created
 */

/**
 * @swagger
 * /webhook/stripe:
 *   post:
 *     summary: Stripe webhook handler
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Webhook processed
 */

/**
 * @swagger
 * /subscription/status:
 *   get:
 *     summary: Get current subscription tier
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Current subscription status
 */
