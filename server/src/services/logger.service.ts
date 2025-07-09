import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';

const httpLogger = winston.createLogger({
  format: combine(
    colorize(),
    timestamp({ format: timestampFormat }),
    printf(({ timestamp, level, message, ...data }) => {
      const dataString = Object.keys(data).length ? ` ${JSON.stringify(data)}` : '';
      return `${timestamp} ${level}: ${message}${dataString}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ],
});

export default httpLogger;