

require('dotenv').config();

const fetch = require('node-fetch');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SPACE_ID = 'ylfzY538';

// Example of a specific breed search
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/bbox?access_token=${ACCESS_TOKEN}&west=-94.24928&north=32.82697&east=-90.11567&south=29.9372`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results\n\n');
})
.catch(e => {
	console.error(e);	
});
