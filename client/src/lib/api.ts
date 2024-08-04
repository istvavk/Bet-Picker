import axios from 'axios';
import {httpsCallable} from "firebase/functions";
import {firebaseFunctions} from "$lib/firebase";

const PROJECT_ID = 'bet-picker';

export async function fetchOdds(sport: string) {
  try {
    console.log(`Fetching odds for sport: ${sport}`);
    const response = await axios.get(`http://localhost:5001/${PROJECT_ID}/us-central1/api-getOdds`, {
      params: {
        sport
      }
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
}

export const fetchCSVData = async () => {
  const getCSV = httpsCallable(firebaseFunctions, 'api-getCSV');
  try {
    const result = await getCSV();
    return result.data.csvData;
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
};