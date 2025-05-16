import dotenv from 'dotenv';
import { schedule } from 'node-cron';
import { writeFile, readFileSync } from 'fs';
import { promisify } from 'util';
import { URL, URLSearchParams } from 'url';

dotenv.config();

// Promisify writeFile
const writeFileAsync = promisify(writeFile);

let previousData = [];

// Try to load existing data from file
try {
  const { FILENAME } = process.env;
  if (FILENAME) {
    const fileContent = readFileSync(FILENAME, 'utf8');
    previousData = JSON.parse(fileContent);
    console.log('Loaded existing data from file');
  }
} catch (error) {
  console.log('No existing data file found or error reading it, starting fresh');
}

// Build API request
function buildRequest() {
  const { API_KEY, API_ROUTE, BASE_URL, TEAM, API_TOKEN } = process.env;
  
  if (!API_ROUTE || !BASE_URL) {
    throw new Error('Missing required environment variables: API_ROUTE or BASE_URL');
  }

  // Teams request
  if (API_TOKEN && TEAM) {
    const url = new URL(API_ROUTE, BASE_URL);
    const params = new URLSearchParams({
      "team": TEAM
    });

    url.search = params.toString();

    return {
      method: 'GET',
      url: url.toString(),
      headers: {
        'X-API-Access-Token': API_TOKEN
      }
    };
  }

  // Return Enterprise request config
  if (!API_KEY) {
    throw new Error('Missing required environment variable: API_KEY');
  }
  
  const url = new URL(API_ROUTE, BASE_URL);

  return {
    method: 'GET',
    url: url.toString(),
    headers: {
      'X-API-KEY': API_KEY
    }
  };
}

// API request function using native fetch
async function makeRequest() {
  const config = buildRequest();
  
  const response = await fetch(config.url, {
    method: config.method,
    headers: config.headers
  });
  
  console.log(`Status: ${response.status}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('API response does not contain an items array');
  }
  
  return data.items;
}

// Write data to file
async function writeDataToFile(filename, data) {
  try {
    // Combine and deduplicate data
    const combinedData = [...previousData, ...data];
    const dedupedData = [...new Map(combinedData.map(item => 
      [item.question_id, item])).values()];
    const stringifiedData = JSON.stringify(dedupedData);

    await writeFileAsync(filename, stringifiedData);

    previousData = dedupedData;

    console.log('Data has been added to file successfully.');
  } catch (error) {
    console.error('Data failed to write to file.', error instanceof Error ? error.message : String(error));
  }
}

// Combine API request and add to file
async function fetchAndWriteData() {
  try {
    const filedata = await makeRequest();

    const filename = process.env.FILENAME;
    if (!filename) {
      throw new Error('FILENAME not defined in environment variables');
    }

    await writeDataToFile(filename, filedata);
    console.log('Fetched data and inserted to file.');
  } catch(error) {
    console.error('Failed to fetch data and write file.', error instanceof Error ? error.message : String(error));
  }
}

// Schedule a job to run every day at midnight
const job = schedule("0 0 * * *", fetchAndWriteData);

// Run once immediately
fetchAndWriteData();
export default job;