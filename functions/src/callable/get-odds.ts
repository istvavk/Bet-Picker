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
          regions: 'eu',
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
                  { name: 'Bayern Munchen', price: 1.73 },
                  { name: 'Draw', price: 3.10 },
                  { name: 'Borussia Dortmund', price: 5.50 }
                ]
              }
            ]
          }
        ]
      };

      const demoMatch2 = {
        id: 'demo-match-2',
        sport_key: 'soccer_germany_bundesliga1',
        commence_time: '2024-08-09T20:00:00Z',
        home_team: 'FC Schalke 04',
        away_team: 'Hamburger SV',
        bookmakers: [
          {
            key: 'demo_bookmaker',
            title: 'Demo Bookmaker',
            markets: [
              {
                key: 'h2h',
                outcomes: [
                  { name: 'FC Schalke 04', price: 3.0 },
                  { name: 'Draw', price: 2.4 },
                  { name: 'Hamburger SV', price: 3.0 }
                ]
              }
            ]
          }
        ]
      };

      oddsData.push(demoMatch, demoMatch2);

      res.status(200).send(oddsData);
    } catch (error) {
      console.error('Error getting odds:', error);
      res.status(500).send('Failed to fetch odds');
    }
  });
});
