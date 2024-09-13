const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple Express API",
    },
    servers: [
      {
        url: `${process.env.BACKEND_URL}`,
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")], // API 주석이 포함된 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
