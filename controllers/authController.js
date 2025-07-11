const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generateOtp = require('../utils/generateOtp');
const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');

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

module.exports={
    signup,
}


