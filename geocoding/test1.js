require('dotenv').config();
const fetch = require('node-fetch');

const HERE_APP_ID = process.env.HERE_APP_ID;
const HERE_APP_CODE = process.env.HERE_APP_CODE;

let address = '403 Robinhood Circle, Lafayette, LA 70508';

let url = `https://geocoder.api.here.com/6.2/geocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&searchtext=${encodeURI(address)}`;

fetch(url)
.then(res => res.json())
.then(res => {
	let view = res.Response.View;
	console.log(JSON.stringify(view, null, '\t'));
});
