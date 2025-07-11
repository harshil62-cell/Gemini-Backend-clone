require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user');

app.use(cors());
app.use(express.json());

// Routes will go here
app.get("/", (req, res) => res.send("Gemini Backend Running 🚀"));
app.use('/auth',authRoutes);
app.use('/user',userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
