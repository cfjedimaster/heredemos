/*

See the comments on the first file. :) So now I read in a file and get 20 parks that are not processed yet. To keep simple, 
I'm adding _processed to properties.
*/

const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const NPS_KEY = process.env.NPS_KEY;

const BUCKET_SIZE = 20;

let rawData = fs.readFileSync('./national-parks-full.geojson','utf8');
let data = JSON.parse(rawData);
console.log(`Read in my file and I have ${data.features.length} features to parse.`);

let bucket = [];
for(let i=0;i<data.features.length;i++) {
	if(!data.features[i].properties._processed) {
		let code = data.features[i].properties.Code;
		bucket.push(code);
	} else {
		console.log(`Skipping ${data.features[i].properties.parkCode} as it has been done.`);
	}
}

console.log(`I've got ${bucket.length} parks to process.`);

//Our bucket may be too big
bucket = bucket.slice(0, BUCKET_SIZE);

console.log(`Please stand by, I'm requesting a lot of data (specifically, ${bucket.length} items).`);

getParkData(bucket)
.then(result => {
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
			data.features[origIndex].properties._processed=1;
		}

	}

	fs.writeFileSync('./national-parks-full.geojson', JSON.stringify(data));
	console.log('All done, yo!');

})
.catch(e => {
	console.error(e);
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

