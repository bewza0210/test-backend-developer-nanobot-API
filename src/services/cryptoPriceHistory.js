const axios = require('axios');
const { CryptoPriceHistory } = require('../models/');
const logger = require('../plugins/logger');
const { Op } = require('sequelize');
const WebSocket = require('ws');

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
const INTERVAL_SEC = 3; // group data ทุก 3 วินาที
let wss = null;

/**
 * Fetch ticker data from Binance API
 */
async function fetchTicker(symbol) {
  try {
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    return {
      open_price: parseFloat(res.data.openPrice),
      high_price: parseFloat(res.data.highPrice),
      low_price: parseFloat(res.data.lowPrice),
      close_price: parseFloat(res.data.lastPrice),
      volume: parseFloat(res.data.volume),
    };
  } catch (err) {
    logger.error(`Error fetching ${symbol}: ${err.message}`);
    return null;
  }
}

/**
 * Insert a single price history record
 */
async function insertPriceHistory(symbol) {
  const ticker = await fetchTicker(symbol);
  if (!ticker) return;

  await CryptoPriceHistory.create({
    symbol,
    ...ticker,
    interval_sec: INTERVAL_SEC,
    timestamp: new Date(),
  });

  logger.info(`[${new Date().toISOString()}] Inserted history for ${symbol}: ${ticker.close_price}`);
}

/**
 * Periodically insert price history for all symbols
 */
function startHistoryFetcher() {
  setInterval(() => {
    SYMBOLS.forEach(symbol => insertPriceHistory(symbol));
  }, INTERVAL_SEC * 1000);
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
 * Periodically clean old price history (every 24h)
 */
function startCleanUpTask() {
  setInterval(() => cleanOldPriceHistory(3), 24 * 60 * 60 * 1000);
}

/**
 * Broadcast latest prices to all connected WebSocket clients
 */
async function broadcastLatestPrices() {
  if (!wss) return;

  for (const symbol of SYMBOLS) {
    const latest = await CryptoPriceHistory.findOne({
      where: { symbol },
      order: [['timestamp', 'DESC']]
    });
    if (!latest) continue;

    const payload = JSON.stringify({
      symbol: latest.symbol,
      open_price: parseFloat(latest.open_price),
      high_price: parseFloat(latest.high_price),
      low_price: parseFloat(latest.low_price),
      close_price: parseFloat(latest.close_price),
      timestamp: latest.timestamp
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  }
}

/**
 * Start broadcasting prices every INTERVAL_SEC
 */
function startBroadcast() {
  setInterval(broadcastLatestPrices, INTERVAL_SEC * 1000);
}

/**
 * Initialize WebSocket server
 */
function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    logger.info('New WebSocket client connected');
    ws.on('close', () => logger.info('Client disconnected'));
  });

  startBroadcast();
}

/**
 * Public API
 */
module.exports = {
  startPriceHistoryFetcher: () => {
    startHistoryFetcher();
    startCleanUpTask();
  },
  initWebSocket,
  broadcastLatestPrices
};
