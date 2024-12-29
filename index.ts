import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./config/logger.js";
import app from "./app.js";
import { Server } from "http";
import chalk from "chalk";

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL as string;
const PORT = process.env.PORT || 3000;

mongoose.connection.on("error", (err) => {
  logger.error(
    chalk.bgRed.bold("🔥 ERROR ") +
      " " +
      chalk.white.bold("MongoDB connection failed! ⚡") +
      "\n" +
      chalk.red(`Details: ${err}`)
  );
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

let server: Server;
mongoose.connect(CONNECTION_URL).then(() => {
  logger.info(
    chalk.bgGreen.bold("✅ INFO ") +
      " " +
      chalk.green("MongoDB connected successfully!")
  );
  server = app.listen(PORT, () => {
    logger.info(
      chalk.bgCyan.bold("🌐 INFO ") +
        " " +
        chalk.cyan(`Server listening on port ${PORT}... 🚀`)
    );
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info(
        chalk.bgYellow.bold("⚠️ INFO ") +
          " " +
          chalk.yellow("Server is shutting down... 😔")
      );
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(
    chalk.bgRed.bold("🔥 ERROR ") +
      " " +
      chalk.white.bold("Unexpected error occurred! ⚠️") +
      "\n" +
      chalk.red(`Error details: ${error}`)
  );
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
