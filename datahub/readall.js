/*
Given a space and read only token, get all the data.

todo, make it async/looping etc

*/

const fetch = require('node-fetch');
const fs = require('fs');

const SPACE_ID = 'A9cZVQ4j';
const ACCESS_TOKEN = 'ANvZbM7tTzucCxOvTYPKzQA';
// this is the max the API allows
const MAX = 30000;
// hard coded output path,
const outputPath = './output.geojson';

(async () => {

	let count = await getCount(SPACE_ID, ACCESS_TOKEN);
	console.log(`Grabbing ${count.value} features.`);

	let result = null;
	let total = 0;
	let handle = null;

	while(total < count.value) {

		let featureResult = await getFeatures(SPACE_ID, ACCESS_TOKEN,handle);
		if(!result) {
			result = featureResult;
			handle = featureResult.handle;
			//remove it
			delete featureResult.handle;
		} else {
			result.features = result.features.concat(featureResult.features);
			handle = featureResult.handle;
		}
		total += featureResult.features.length;
	}

	console.log(`Done, to confirm, I have ${result.features.length} features.`);
	fs.writeFileSync(outputPath, JSON.stringify(result), 'UTF8');
	console.log(`Written to ${outputPath}`);
})();

async function getCount(space,token) {
	return new Promise((resolve, reject) => {
		fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/statistics?access_token=${ACCESS_TOKEN}`)
		.then(res => res.json())
		.then(res => {
			resolve(res.count);
		})
		.catch(e => {
			reject(e);
		});
	});
}

async function getFeatures(space,token,handle) {
	return new Promise((resolve, reject) => {
		let url = `https://xyz.api.here.com/hub/spaces/${space}/iterate?access_token=${token}`;
		if(handle) url += `&handle=${handle}`;
		console.log('Fetching '+url);
		fetch(url)
		.then(res => res.json())
		.then(res => {
			resolve(res);
		})
		.catch(e => {
			reject(e);
		});
	});

}