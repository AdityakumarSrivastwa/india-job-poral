//API Documentation **********
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");
//package import
const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

//security packges
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
//file imports
const connectDB = require("./config/db");
const testRoutes = require("./routes/testRoutes");
const authRoute = require("./routes/authRoute");
const { errroMiddelware } = require("./middelwares/errorMiddleware");
const jobsRoutes = require("./routes/jobsRoutes");
const userRoutes = require("./routes/userRoutes");
//routes import

//Dot ENV config
dotenv.config();
// mongoDB connection
connectDB();
//Sawagger API config****************************
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8080",
        //  url: "https://nodejs-job-portal-app.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

//rest object
const app = express();

//Middelwares
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/test", testRoutes);
app.use("/auth", authRoute);
app.use("/user", userRoutes);
app.use("/job", jobsRoutes);

//homeroute root**********************
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
//validation middelware
app.use(errroMiddelware);
//port

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node server Running on ${process.env.DEV_MODE} Mode on port no ${PORT}`
  );
});
