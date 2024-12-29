import winston from "winston";
import chalk from "chalk";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    // Apply colorize based on log level
    winston.format.colorize(), // Allows for color-based formatting
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message }) => {
      // Define custom color for each log level
      const levelColors: Record<string, (str: string) => string> = {
        info: chalk.bgGreen.bold, // Bold green background for info
        debug: chalk.bgBlue.bold, // Bold blue background for debug
        error: chalk.bgRed.bold, // Bold red background for error
        warn: chalk.bgYellow.bold, // Bold yellow background for warn
      };

      // Colorize the level based on the log level
      const colorizedLevel = levelColors[level]
        ? levelColors[level](level) // Apply the appropriate color
        : level;

      // Return the formatted message
      return `${colorizedLevel}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
