const fetch = require('node-fetch');
require('dotenv').config();

const APP_KEY = process.env.HERE_APP_KEY;

//in=countryCode:CAN&
let url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=49.35,-73.81&limit=5&q=quebec&apikey=${APP_KEY}`;

fetch(url)
.then(res => res.json())
.then(res => {
	console.log('result');
	console.log(JSON.stringify(res, null, '\t'));

})
.catch(e => {
	console.log('Error', e);
})
