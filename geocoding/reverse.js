require('dotenv').config();
const fetch = require('node-fetch');

const APP_KEY = process.env.HERE_API_KEY;
let address = '70508';

let loc = '48.2181679%2C16.3899064';
let url = `https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=${APP_KEY}&at=${loc}`;

fetch(url)
.then(res => res.json())
.then(res => {
	console.log(JSON.stringify(res, null, '\t'));
});
