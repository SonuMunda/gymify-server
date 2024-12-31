import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import error from "./middlewares/error.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app = express();


// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My Gymify API",
    version: "1",
    description: "A simple API to demonstrate Swagger integration with Express",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}/`,
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger docs using swagger-ui-express
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.get('/favicon.ico', (req, res) => res.status(204));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(helmet());

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
// app.options('*', cors);

// v1 api routes
app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;
