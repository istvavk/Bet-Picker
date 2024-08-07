import * as functions from 'firebase-functions';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

dotenv.config();

const API_KEY = process.env.API_KEY;

const corsHandler = cors({ origin: true });

export const getOdds = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { sport } = req.query;
    if (!sport) {
      res.status(400).send('Missing sport parameter');
      return;
    }

    try {
      const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds`, {
        params: {
          regions: 'us',
          oddsFormat: 'decimal',
          apiKey: API_KEY
        }
      });

      let oddsData = response.data;

      // demo utakmica za Bundesligu
      const demoMatch = {
        id: 'demo-match-1',
        sport_key: 'soccer_germany_bundesliga',
        commence_time: '2023-01-01T12:00:00Z',
        home_team: 'Bayern Munchen',
        away_team: 'Borussia Dortmund',
        bookmakers: [
          {
            key: 'demo_bookmaker',
            title: 'Demo Bookmaker',
            markets: [
              {
                key: 'h2h',
                outcomes: [
                  { name: 'Bayern Munchen', price: 1.50 },
                  { name: 'Draw', price: 3.75 },
                  { name: 'Borussia Dortmund', price: 6.00 }
                ]
              }
            ]
          }
        ]
      };

      oddsData.push(demoMatch);

      res.status(200).send(oddsData);
    } catch (error) {
      console.error('Error getting odds:', error);
      res.status(500).send('Failed to fetch odds');
    }
  });
});
