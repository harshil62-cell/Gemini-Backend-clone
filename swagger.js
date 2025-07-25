// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // ✅ Must be spelled EXACTLY like this
    info: {
      title: 'Gemini Backend Clone API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for Gemini Backend Clone',
    },
    servers: [
      {
        url: 'https://gemini-backend-clone.onrender.com/',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./swaggerDocs.js'], // Path to your single-file annotations
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
