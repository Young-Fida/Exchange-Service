const {createRateService} = require('../lib/exim-rates.cjs');
const getRates = createRateService();
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end(JSON.stringify({error: 'METHOD_NOT_ALLOWED'}));
  }
  try {
    res.statusCode = 200;
    res.end(JSON.stringify(await getRates()));
  } catch (error) {
    const code = ['KEY_NOT_CONFIGURED', 'NO_DATA'].includes(error.message) ? error.message : 'RATES_UNAVAILABLE';
    res.statusCode = 503;
    res.end(JSON.stringify({error: code}));
  }
};
