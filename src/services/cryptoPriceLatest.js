const WebSocket = require('ws');
const logger = require('../plugins/logger');
const { CryptoPriceLatest } = require('../models');

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

// Binance stream format: lowercase + @ticker
const streams = SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/');
const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

function startPriceStream() {
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    logger.info('Connected to Binance WebSocket stream');
  });

  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data);
      const { s: symbol, c: price } = parsed.data;
      const numericPrice = parseFloat(price);

      await CryptoPriceLatest.create({ symbol, price: numericPrice });
      logger.info(`[${new Date().toISOString()}] Insert CrptoPriceLatest ${symbol} = ${numericPrice}`);
    } catch (err) {
      logger.error(`Error parsing message: ${err.message}`);
    }
  });

  ws.on('error', (err) => {
    logger.error(`WebSocket error: ${err.message}`);
  });

  ws.on('close', () => {
    logger.warn('WebSocket closed. Reconnecting in 5s...');
    setTimeout(startPriceStream, 5000); 
  });
}

exports.startPriceFetcher = startPriceStream;
