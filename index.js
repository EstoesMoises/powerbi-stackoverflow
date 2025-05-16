//Require dependencies

require('dotenv').config();
const nodeCron = require('node-cron');
const axios = require('axios');
var fs = require('fs');
const dedupe = require('dedupe');

let previousData = [];

//Build API request
function buildRequest() {
  const {API_KEY, API_ROUTE, BASE_URL, TEAM, API_TOKEN} = process.env;

  //Teams request
  if (API_TOKEN && TEAM) {
    const url = new URL(API_ROUTE, BASE_URL);
    const params = new URLSearchParams({
      "team" : TEAM
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

  //Return Enterprise
  const url = new URL(API_ROUTE, BASE_URL);

  return {
      method: 'GET',
      url: url.toString(),
      headers: {
        'X-API-KEY': API_KEY
      }
  };
}

//API request function
async function makeRequest() {
  const config = buildRequest();

  const res = await axios(config);

  console.log(res.status);

  return res.data.items;
}

//Write data to file
function writeDataToFile (filename, data) {
  try {

    const combinedData = previousData.concat(data);
    const dedupedData = dedupe(combinedData, value => value.question_id);
    const stringifiedData = JSON.stringify(dedupedData);

    fs.writeFileSync(filename, stringifiedData);

    previousData = dedupedData;

    console.log('Data has been added to file succesfully.');
  } catch (error) {
    console.error('Data failed write to file.', error);
  }
}

//Combine API request and add to file
async function fetchAndWriteData() {
  try {
    const filedata = await makeRequest();

    writeDataToFile(process.env.FILENAME, filedata);
    console.log('Fetched data and inserted to file.');
  } catch(error) {
    console.error('Failed to fetch data and write file.', error);
  }
}

//Schedule a job to run every day at midnight
const job = nodeCron.schedule("0 0 * * *", fetchAndWriteData);
