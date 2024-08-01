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
          oddsFormat: 'american',
          apiKey: API_KEY
        }
      });
      res.status(200).send(response.data);
    } catch (error) {
      console.error('Error getting odds:', error);
      res.status(500).send('Failed to fetch odds');
    }
  });
});
