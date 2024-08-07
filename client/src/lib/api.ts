import axios from 'axios';
import { httpsCallable } from "firebase/functions";
import { firebaseFunctions } from "$lib/firebase";
import {normalizeTeamName} from "$lib/utils";

const PROJECT_ID = 'bet-picker';

export async function fetchOdds(sport: string) {
  try {
    console.log(`Fetching odds for sport: ${sport}`);

    const response = await axios.get(`http://localhost:5001/${PROJECT_ID}/us-central1/api-getOdds`, {
      params: { sport }
    });

    console.log('Response:', response.data);

    const odds = response.data.map((odd: any) => {
      const bookmaker = odd.bookmakers?.[0]; // Provjerava postoji li prvi bookmaker
      if (!bookmaker) return { home_team: odd.home_team, away_team: odd.away_team, home_odds: 'N/A', draw_odds: 'N/A', away_odds: 'N/A' };

      const homeOdds = bookmaker.markets?.[0]?.outcomes.find((o: any) => normalizeTeamName(o.name) === normalizeTeamName(odd.home_team))?.price;
      const drawOdds = bookmaker.markets?.[0]?.outcomes.find((o: any) => o.name.toLowerCase() === 'draw')?.price;
      const awayOdds = bookmaker.markets?.[0]?.outcomes.find((o: any) => normalizeTeamName(o.name) === normalizeTeamName(odd.away_team))?.price;

      console.log('Processed Odds:', {
        home_team: odd.home_team,
        away_team: odd.away_team,
        homeOdds,
        drawOdds,
        awayOdds
      });

      return {
        home_team: odd.home_team,
        away_team: odd.away_team,
        home_odds: homeOdds ? parseFloat(homeOdds).toFixed(2) : null,
        draw_odds: drawOdds ? parseFloat(drawOdds).toFixed(2) : null,
        away_odds: awayOdds ? parseFloat(awayOdds).toFixed(2) : null
      };
    });

    console.log('Final Odds:', odds);
    return odds;

  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
}

export const fetchCSVData = async () => {
  const getCSV = httpsCallable(firebaseFunctions, 'api-getCSV');
  try {
    const result = await getCSV();
    const csvData = result.data.csvData;
    console.log('Fetched CSV Data:', csvData);
    return csvData;
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
};
