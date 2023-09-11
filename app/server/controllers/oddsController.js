// const axios = require('axios');
// const { processOddsData } = require('../services/oddsTransformer');

// let cache = null;
// let lastFetched = null;

// const API_ENDPOINT = 'https://api.the-odds-api.com/v4/sports';
// const apiKey = process.env.API_KEY;
// const bookmakers = 'barstool,betmgm,draftkings,fanduel,pointsbetus,williamhill_us,wynnbet,pinnacle';
// const markets = 'h2h,spreads,totals';
// const oddsFormat = 'american';
// const sportKey = 'americanfootball_nfl';
// const REFRESH = 31 * 24 * 60 * 60 * 1000;

// const getOdds = async (req, res) => {
//   const currentTime = new Date();

//   if (!lastFetched || currentTime - lastFetched > REFRESH) {
//     try {
//       const response = await axios.get(`${API_ENDPOINT}/${sportKey}/odds`, {
//         params: {
//           apiKey,
//           bookmakers,
//           markets,
//           oddsFormat,
//           sportKey
//         }
//       });
//       cache = response.data;
//       lastFetched = currentTime;
//     } catch (error) {
//       return res.status(error.response.status).json({ error: error.response.data });
//     }
//   }

//   res.json(cache);
// };

const fs = require('fs');
const path = require('path');
const { processOddsData } = require('../services/oddsTransformer');

const getOddsFromFile = () => {
  const filePath = path.join(__dirname, '../odds.json');
  const rawdata = fs.readFileSync(filePath);
  return JSON.parse(rawdata);
};

const getOdds = (req, res) => {
  try {
    const data = getOddsFromFile(); // Or fetch from the API
    const processedData = processOddsData(data);
    res.json(processedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from the file.' });
  }
};

module.exports = {
  getOdds
};
