const express=require('express');
const router=express.Router();
const { getCurrentUser } = require('../controllers/authController');
const validateToken = require('../middlewares/validateTokenHandler');

router.get('/me',validateToken,getCurrentUser);

module.exports=router;