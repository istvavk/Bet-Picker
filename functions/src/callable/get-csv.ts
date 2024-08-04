import * as functions from 'firebase-functions';
import { admin } from '../init';
import * as csv from 'csv-parser';

const bucket = admin.storage().bucket();

export const getCSV = functions.https.onCall(async (data, context) => {
  const file = bucket.file('germany.csv');
  let csvData: any[] = [];

  return new Promise((resolve, reject) => {
    file.createReadStream()
      .pipe(csv())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        resolve({ csvData });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
});
