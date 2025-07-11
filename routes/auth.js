const express=require('express');
const router=express.Router();
const {signup,sendOtp}=require('../controllers/authController');

router.post('/signup',signup);
router.post('/send-otp',sendOtp);

module.exports=router;