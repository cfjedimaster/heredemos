const fetch = require('node-fetch');
require('dotenv').config();

const APP_KEY = process.env.HERE_APP_KEY;

// New York (lat, long)
let p1 = 'geo!40.712,-74.059413';
// Boston
let p2 = 'geo!42.360,-71.0588801';

let url = `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apikey=${APP_KEY}&waypoint0=${p1}&waypoint1=${p2}&mode=fastest;car;traffic:disabled`;

fetch(url)
.then(res => res.json())
.then(res => {
	let route = res.response.route[0];
	console.log(JSON.stringify(route,null,'\t'));
	process.exit(1);
	/*
	Result data is waypoint (array of WPs), mode, leg, summary
	Details on result: https://developer.here.com/documentation/routing/dev_guide/topics/resource-type-route.html
	*/
	console.log(JSON.stringify(route.summary,null,'\t')+'\n');
	for(let i=0; i<route.waypoint.length; i++) {
		console.log('Waypoint '+(i+1));
		console.log(route.waypoint[i]);
	}

})
.catch(e => {
	console.log('Error', e);
})
