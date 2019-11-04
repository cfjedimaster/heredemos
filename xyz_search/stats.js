/*

This script runs the statistics endpoint on a hard coded space (should be moved to .env, will do so now)
which reports on properties and their searchability.
*/

require('dotenv').config();

const fetch = require('node-fetch');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SPACE_ID = process.env.SPACE_ID;

fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/statistics?access_token=${ACCESS_TOKEN}`)
.then(res => res.json())
.then(res => {
	console.log(JSON.stringify(res.properties, null, '\t'));
});