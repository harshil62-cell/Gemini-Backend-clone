const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateOtp = require('../utils/generateOtp');
const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
const generateToken=require('../utils/jwt');

//@desc Registers a new user with mobile number 
//and optional info.
//@route POST /auth/signup
//@access public
const signup=asyncHandler(async(req,res)=>{
    const {mobile,name}=req.body;

    if(!mobile || !name){
        res.status(400);
        throw new Error("mobile number and name are required");
    }

    const existingUser=await prisma.user.findUnique({where:{mobile}});
    if(existingUser){
        res.status(409);
        throw new Error("User already exists");
    }

    const newUser=await prisma.user.create({
        data:{mobile,name},
    });

    res.status(201).json({
        message: "User registered successfully login to continue",
        user:{
            id: newUser.id,
            mobile: newUser.mobile,
            name: newUser.name,
        },
    });
});

//@desc Sends an OTP to the user’s mobile 
//number (mocked, returned in response). 
//@route POST /auth/send-otp
//@access public
const sendOtp=asyncHandler(async(req,res)=>{
    const{mobile}=req.body;
    if(!mobile){
        res.status(400);
        throw new Error("Mobile number not provided");
    }

    const otp=generateOtp();

    let user=await prisma.user.findUnique({where:{mobile}});
    if(!user){
        res.status(400);
        throw new Error("User does not exist please signup first");
    }else{
        await prisma.user.update({where:{mobile},data:{otp}});
    }

    res.status(200).json({message:"OTP sent",otp});
});

//@descVerifies the OTP and returns a JWT token 
//for the session.  
//@route POST /auth/verify-otp 
//@access public
const verifyOtp=asyncHandler(async(req,res)=>{
    const{mobile,otp}=req.body;

    if(!mobile || !otp){
        res.status(400);
        throw new Error("Mobile number and OTP not provided");
    }

    const user=await prisma.user.findUnique({where:{mobile}});

    if(!user||user.otp!==otp){
        res.status(400);
        throw new Error("Invalid OTP or mobile number");
    }

    //clear the OTP field
    await prisma.user.update({
        where:{mobile},
        data:{otp:null},
    });

    //generate jwt token
    const token=generateToken(user.id);

    res.status(200).json({
        message:"OTP verified successfully",
        token,
    });
});

module.exports={
    signup,sendOtp,verifyOtp
}


