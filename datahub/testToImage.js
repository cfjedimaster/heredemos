/*
the goal of this is to test taking DH features and crafting a Map Image URL of out them

Based on readall

national parks: yGnvS8f0

https://image.maps.ls.hereapi.com/mia/1.6/mapview
?apiKey={YOUR_API_KEY}
&poi=52.52,13.39,52.52,13.38,52.5253,13.386
&w=400
&h=300
*/
const fetch = require('node-fetch');

const SPACE_ID = 'yGnvS8f0';
const TOKEN = 'AHDIOVe6R6y1ry3kSAjeRQA';
const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

(async () => {
	console.log('lets get '+SPACE_ID);
	let features = await getAll(SPACE_ID, TOKEN);

	features = features.slice(0,50);
	console.log(`Done, got ${features.length} features.`);

	let url = `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${KEY}&w=500&h=500&poi=`;
	features.forEach(f => {
		//assumes point, remember in geojson its lng, lat
		url += f.geometry.coordinates[1] + ',' + f.geometry.coordinates[0];
		url += ',';
	});
	console.log(url);
})();


async function getAll(space, token) {

	let count = await getCount(space, token);

	let result = null;
	let total = 0;
	let handle = null;

	while(total < count.value) {

		let featureResult = await getFeatures(space, token,handle);
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

	return result.features;
};

async function getCount(space,token) {
	return new Promise((resolve, reject) => {
		fetch(`https://xyz.api.here.com/hub/spaces/${space}/statistics?access_token=${token}`)
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
