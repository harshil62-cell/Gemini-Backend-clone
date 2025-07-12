require('dotenv').config();
require('./workers/geminiWorker');
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');
const chatroomRoutes=require('./routes/chatroom');
const paymentRoutes=require('./routes/payment');

app.use(cors());
app.use('/webhook/stripe', express.raw({ type: 'application/json' }), require('./routes/webhook'));
app.use(express.json());

// Routes will go here
app.get("/", (req, res) => res.send("Gemini Backend Running"));
app.get('/success',(req,res)=>res.send("Payment success"));
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/chatroom',chatroomRoutes);
app.use('/', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
