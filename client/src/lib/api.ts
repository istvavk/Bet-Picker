import axios from 'axios';

const PROJECT_ID = 'bet-picker';

export async function fetchOdds(sport: string) {
  try {
    console.log(`Fetching odds for sport: ${sport}`);  // Log the request
    const response = await axios.get(`http://localhost:5001/${PROJECT_ID}/us-central1/api-getOdds`, {
      params: {
        sport
      }
    });
    console.log('Response:', response.data);  // Log the response
    return response.data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    throw error;
  }
}
