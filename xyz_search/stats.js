require('dotenv').config();

const fetch = require('node-fetch');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SPACE_ID = 'ZCtPqZJA';

fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/statistics?access_token=${ACCESS_TOKEN}`)
.then(res => res.json())
.then(res => {
	console.log(JSON.stringify(res.properties, null, '\t'));
});