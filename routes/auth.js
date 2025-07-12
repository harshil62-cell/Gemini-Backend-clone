const express=require('express');
const router=express.Router();
const {signup,sendOtp, verifyOtp,forgotPassword,changePassword}=require('../controllers/authController');
const validateToken=require('../middlewares/validateTokenHandler');


router.post('/signup',signup);
router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);

router.post('/forgot-password',validateToken, forgotPassword);
router.post('/change-password', validateToken, changePassword);

module.exports=router;