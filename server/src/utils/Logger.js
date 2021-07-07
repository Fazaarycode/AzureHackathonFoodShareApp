const winston = require('winston');

const colorizer = winston.format.colorize();

const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL,
  format: winston.format.simple(),
  transports: [

    // General Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(msg => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: `) + msg.message),
      ),
    }),
  ],
  exitOnError: false,
});

if (process.env.ENVIRONMENT !== 'production') {
  logger.add(
    new winston.transports.File({ filename: 'run.log' }),
  );
}

/**
 * Logger Class
 */
module.exports = {
  log: (text) => {
    logger.info(text);
  },
  info: (text) => {
    logger.info(text);
  },
  error: (text) => {
    logger.error(text);
  },
  warn: (text) => {
    logger.warn(text);
  },
  debug: (text) => {
    logger.debug(text);
  },
  silly: (text) => {
    logger.silly(text);
  },
};
