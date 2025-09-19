const axios = require('axios');
const logger = require('../plugins/logger');
const { CryptoPriceLatest } = require('../models');

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

async function fetchPrice(symbol) {
  try {
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    return parseFloat(res.data.price);
  } catch (err) {
    logger.error(`Error fetching ${symbol}: ${err.message}`);
    return null;
  }
}

async function updateLatestPrice(symbol) {
  const price = await fetchPrice(symbol);
  if (price === null) return;

  await CryptoPriceLatest.create({ symbol, price });
  logger.info(`[${new Date().toISOString()}] Inserted ${symbol} = ${price}`);
}

exports.startPriceFetcher = async () => {
  for (const symbol of SYMBOLS) {
    await updateLatestPrice(symbol);
  }

  setInterval(async () => {
    for (const symbol of SYMBOLS) {
      await updateLatestPrice(symbol);
    }
  }, 60 * 1000);
}