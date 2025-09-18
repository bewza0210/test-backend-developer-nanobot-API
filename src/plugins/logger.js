const pino = require('pino');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const fileStream = pino.destination(path.join(logDir, 'app.log'));

const consoleStream = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname'
  }
});

const logger = pino({
  level: 'info',
  base: null,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  formatters: {
    level(label) {
      return { level: label };
    }
  }
}, pino.multistream([
  { stream: consoleStream },
  { stream: fileStream }
]));

module.exports = logger;
