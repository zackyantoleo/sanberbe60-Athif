import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Final Project Node JS Sanbercode Batch 60",
    description: "Athif Zakiyanto",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://sanberbe60-athif.vercel.app/api",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      ProductsRequest: {
        name: "Kemeja",
        description: "Kemeja Pria",
        image: "kemeja.jpg",
        price: 10000,
        qty: 10,
        category: "{id_category}",
      },
      CategoryRequest: {
        name: "Kemeja",
      },
      OrderRequest: {
        grandTotal: 10000,
        orderItems: [
          {
            name: "Kemeja",
            productId: "{id_product}",
            price: 10000,
            quantity: 2,
          },
        ],
        status: "pending",
      },
      LoginRequest: {
        email: "joni2024@yopmail.com",
        password: "123412341",
      },
      RegisterRequest: {
        fullName: "joni joni",
        username: "joni2024",
        email: "joni2024@yopmail.com",
        password: "123412341",
        confirmPassword: "123412341",
      },
      UpdateProfileRequest: {
        fullName: "joni joni",
        username: "joni2024",
        email: "joni2024@yopmail.com",
        password: "123412341",
        confirmPassword: "123412341",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
