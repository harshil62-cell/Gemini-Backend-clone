# Gemini Backend Clone

A production-grade backend service that allows users to interact with Gemini (Google Generative AI) through authenticated chatrooms. It includes authentication, chat functionality, Stripe integration for Pro subscription, and BullMQ-based response queuing with Redis.

---

## 🔧 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/gemini-backend-clone.git
cd gemini-backend-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure:

```env
DATABASE_URL=your_postgresql_url
ACCESS_TOKEN_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
REDIS_URL=rediss://...
```

### 4. Run migrations and generate Prisma client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Redis (locally or use Upstash)

If using Upstash, make sure `REDIS_URL` is correct and secure.

### 6. Start the project

```bash
npm start
```

---

## 🏛 Architecture Overview

- **Express.js** – Main web framework
- **Prisma ORM** – PostgreSQL ORM
- **Redis + BullMQ** – For background message processing
- **Stripe** – Subscription-based Pro upgrade
- **JWT Auth** – Secured user sessions
- **Gemini API** – AI-generated responses via Google Generative AI

---

## 📦 Queue System (BullMQ + Redis)

1. User sends a message → message is stored
2. Job is added to `gemini` queue
3. `geminiWorker.js` picks it up asynchronously
4. Worker calls Gemini API → stores the response

### Benefits

- Scalable async processing
- Decoupled AI logic
- Easy monitoring via Redis

---

## 🤖 Gemini API Integration

- Uses `@google/generative-ai` npm package
- Model used: `gemini-pro`
- Returns streaming or text-based response
- Free tier supports a limited number of requests

---

## 🧠 Design Decisions & Assumptions

- OTPs are mocked and sent in response (not SMS)
- Pro users are identified via Stripe + webhook + metadata
- Redis runs on Upstash (free-tier)
- Free tier: 5 messages allowed
- Stripe flow uses `checkout.session.completed` webhook to upgrade users

---

## 📬 API Endpoints

### Auth Routes

| Method | Endpoint                | Auth | Description |
|--------|-------------------------|------|-------------|
| POST   | /auth/signup            | ❌   | Signup with mobile number |
| POST   | /auth/send-otp          | ❌   | Sends OTP to mobile |
| POST   | /auth/verify-otp        | ❌   | Verifies OTP, returns JWT |
| POST   | /auth/forgot-password   | ❌   | Sends OTP for password reset |
| POST   | /auth/change-password   | ✅   | Changes password when logged in |
| GET    | /user/me                | ✅   | Returns current user info |

### Chatroom Routes

| Method | Endpoint                  | Auth | Description |
|--------|---------------------------|------|-------------|
| POST   | /chatroom/                | ✅   | Create a chatroom |
| GET    | /chatroom/                | ✅   | Get all chatrooms (cached) |
| GET    | /chatroom/:id             | ✅   | Get specific chatroom details |
| POST   | /chatroom/:id/message     | ✅   | Send a message to Gemini |

### Subscription (Stripe) Routes

| Method | Endpoint                  | Auth | Description |
|--------|---------------------------|------|-------------|
| POST   | /subscribe/pro            | ✅   | Starts Stripe checkout |
| POST   | /webhook/stripe           | ⛔   | Stripe calls this on payment success |
| GET    | /subscription/status      | ✅   | Get current subscription tier |

---

## 📮 Testing via Postman

1. Import the exported Postman collection (`Gemini Backend.postman_collection.json`)
2. Set the `{{baseUrl}}` variable to `https://gemini-backend-clone.onrender.com/`
3. Test endpoints in this order:
   - `POST /auth/signup`
   - `POST /auth/send-otp`
   - `POST /auth/verify-otp` → Save JWT token
   - Set `Authorization: Bearer <token>` for protected routes
   - `POST /subscribe/pro` → Complete Stripe payment
   - Test `GET /subscription/status` and chatroom APIs

---

## 🌐 Deployment

### Backend Hosted On:
👉 [`https://gemini-backend-clone.onrender.com/`](https://gemini-backend-clone.onrender.com/)

### PostgreSQL:
👉 Hosted on Railway

### Redis:
👉 Hosted on Upstash

---

## 👨‍💻 Author

Built by [Harshil Vasani](https://github.com/harshilvasani)