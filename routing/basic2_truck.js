/*
first example of routing v8
*/


const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.HERE_API_KEY;

// New York (lat, long)
let p1 = '40.712,-74.059413';
// Boston
let p2 = '42.360,-71.0588801';

let url = `https://router.hereapi.com/v8/routes?transportMode=truck&origin=${p1}&destination=${p2}&return=summary&apikey=${API_KEY}`;

fetch(url)
.then(res => res.json())
.then(res => {

	let route = res.routes[0];
	console.log(JSON.stringify(route,null,'\t'));

})
.catch(e => {
	console.log('Error', e);
})
