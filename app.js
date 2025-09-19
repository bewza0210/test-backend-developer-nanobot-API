const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes');
const sequelize = require('./src/plugins/db');
const corsMiddleware = require('./src/plugins/cors');
const logger = require('./src/plugins/logger');
const setupSwagger = require('./src/plugins/swagger');
const cryptoPriceLatestService = require('./src/services/cryptoPriceLatest');
const cryptoPriceHistoryService = require('./src/services/cryptoPriceHistory');
const app = express();

setupSwagger(app);
app.use(cookieParser());
app.use(corsMiddleware);
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);

cryptoPriceHistoryService.initWebSocket(server);

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connected successfully!');
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`You can see API docs http://localhost:${PORT}/api-docs`);

    cryptoPriceLatestService.startPriceFetcher();
    cryptoPriceHistoryService.startPriceHistoryFetcher();
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
});
