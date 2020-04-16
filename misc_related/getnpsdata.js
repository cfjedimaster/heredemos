/*
Ok, so here's the idea. We read in the source geojson, national-parks.geojson, and get all features. That includes Code+Name. 
We then use the NPS API to fetch data about the parks by code. Their API lets you pass an array of codes but doesn't say how many. 
I'm going to assume 25.

So get the codes, chunk em to lists of 25 each.
Fetch them all.
Update our data and save to a new file, let's say national-parks-full.geojson

Ok, so version 1 worked in short spurts, but got 502 errors when I tried hitting all 400. 
I'm going to work on v2 in a new file that works progressively.
*/

const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const NPS_KEY = process.env.NPS_KEY;

const BUCKET_SIZE = 25;

let rawData = fs.readFileSync('./national-parks.geojson','utf8');
let data = JSON.parse(rawData);
console.log(`Read in my file and I have ${data.features.length} features to parse.`);

let buckets = [];
let idx = 0;
buckets[idx] = [];
for(let i=0;i<data.features.length;i++) {
	let code = data.features[i].properties.Code;
	buckets[idx].push(code);
	if(buckets[idx].length === BUCKET_SIZE) {
		idx++;
		buckets[idx] = [];
	}
}

console.log(`Please stand by, I'm requesting a lot of data.`);
let requestQueue = [];
for(let i=0;i<buckets.length;i++) {
	requestQueue.push(getParkData(buckets[i]));
}

Promise.all(requestQueue).then(results => {
	console.log(`Fetched a LOT of data. Now I need to get this into my JSON.`);
	//its an array of array, so let's make one big one
	let result = [];
	for(let i=0;i<results.length;i++) {
		for(let k=0;k<results[i].length;k++) {
			result.push(results[i][k]);
		}
	}

	/*
		Now we need to connect ths data to the original data. Going to use a
		lot of looping which is slow but meh. Also note the API returns codes in lowercase, 
		the original data was uppercase. Also know we will be storing stuff in properties we don't need, 
		like latlong, longitude, and latitude. I'm ok with the extra though. I will remove .parkCode though so as to not conflict with .Code
		Actually scratch that, I'm going to replace the orig properties w/ the new props cuz woot woot
	*/
	for(let i=0;i<result.length;i++) {
		let park = result[i];
		let origIndex = data.features.findIndex(p => {
			return p.properties.Code === park.parkCode.toUpperCase();
		});
		if(origIndex >= 0) {
			data.features[origIndex].properties = park;
		}

	}

	fs.writeFileSync('./nationl-parks-full.geojson', JSON.stringify(data));
	console.log('All done, yo!');
});

function getParkData(list) {
	return new Promise((resolve, reject) => {
		let url = `https://developer.nps.gov/api/v1/parks?api_key=${NPS_KEY}&parkCode=${list}`;

		fetch(url)
		.then(res => res.json())
		.then(res => {
			resolve(res.data);
		})
		.catch(e => {
			console.error(e);
			reject(e);
		});
	});
}

//https://developer.nps.gov/api/v1/parks?stateCode=${state}&limit=100&fields=images&api_key=${NPS_KEY}