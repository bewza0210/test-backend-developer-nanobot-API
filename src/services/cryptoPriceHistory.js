const { CryptoPriceHistory } = require('../models/');
const logger = require('../plugins/logger');
const { Op } = require('sequelize');
const WebSocket = require('ws');

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
const INTERVAL_SEC = 5;
let wss = null;
let buffers = {}; // เก็บ trade buffer ตาม symbol

/**
 * Start Binance WebSocket stream for trades
 */
function startBinanceWS() {
  SYMBOLS.forEach(symbol => {
    const streamName = symbol.toLowerCase() + '@trade';
    const url = `wss://stream.binance.com:9443/ws/${streamName}`;
    const binanceWS = new WebSocket(url);

    buffers[symbol] = [];

    binanceWS.on('open', () => logger.info(`Connected to Binance WS for ${symbol}`));

    binanceWS.on('message', (msg) => {
      try {
        const trade = JSON.parse(msg);
        const record = {
          price: parseFloat(trade.p),
          qty: parseFloat(trade.q),
          time: trade.T
        };

        buffers[symbol].push(record);

        // logger.info(
        //   `[${symbol}] WS trade => price=${record.price}, qty=${record.qty}, time=${new Date(record.time).toISOString()}`
        // );
      } catch (err) {
        logger.error(`Parse error ${symbol}: ${err.message}`);
      }
    });

    binanceWS.on('close', () => {
      logger.warn(`Binance WS closed for ${symbol}, reconnecting...`);
      setTimeout(() => startBinanceWS(symbol), 5000);
    });

    binanceWS.on('error', (err) => logger.error(`Binance WS error ${symbol}: ${err.message}`));
  });
}

/**
 * Aggregate buffer every INTERVAL_SEC
 */
async function aggregateAndSave() {
  for (const symbol of SYMBOLS) {
    const buffer = buffers[symbol];
    if (!buffer || buffer.length === 0) continue;

    const prices = buffer.map(t => t.price);
    const volumes = buffer.map(t => t.qty);

    const ohlcv = {
      open_price: buffer[0].price,
      high_price: Math.max(...prices),
      low_price: Math.min(...prices),
      close_price: buffer[buffer.length - 1].price,
      volume: volumes.reduce((a, b) => a + b, 0),
      interval_sec: INTERVAL_SEC,
      timestamp: new Date()
    };

    try {
      await CryptoPriceHistory.create({ symbol, ...ohlcv });
      logger.info(`[${new Date().toISOString()}] Inserted CrptoHistory for ${symbol}: ${ohlcv.close_price}`);

      // broadcast ไป client ทันที
      broadcastToClients(symbol, ohlcv);
    } catch (err) {
      logger.error(`DB insert error for ${symbol}: ${err.message}`);
    }

    buffers[symbol] = []; // reset buffer
  }
}

/**
 * Broadcast data to connected WebSocket clients
 */
function broadcastToClients(symbol, ohlcv) {
  if (!wss) return;
  const payload = JSON.stringify({ symbol, ...ohlcv });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

/**
 * Clean old price history from DB
 */
async function cleanOldPriceHistory(days = 1) {
  try {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const deleted = await CryptoPriceHistory.destroy({
      where: { timestamp: { [Op.lt]: cutoff } }
    });
    logger.info(`[${new Date().toISOString()}] Cleared ${deleted} old history records`);
  } catch (err) {
    logger.error(`Error cleaning old history: ${err.message}`);
  }
}

/**
 * Init WebSocket server for clients
 */
function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    logger.info('New WebSocket client connected');
    ws.on('close', () => logger.info('Client disconnected'));
  });
}

/**
 * Public API
 */
module.exports = {
  start: () => {
    startBinanceWS();
    setInterval(aggregateAndSave, INTERVAL_SEC * 1000);
    setInterval(() => cleanOldPriceHistory(3), 24 * 60 * 60 * 1000);
  },
  initWebSocket
};
