const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error('User is not authorized - invalid token');
      }

      // Fetch user from DB
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401);
    throw new Error('User not authorized or token missing');
  }
});

module.exports = validateToken;
