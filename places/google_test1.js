require('dotenv').config();
const fetch = require('node-fetch');
const google_token = process.env.GOOGLE_TOKEN;

(async () => {

	/*
	This version returns one item - not very useful
	let googleUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${google_token}`;
	let resp = await fetch(`${googleUrl}&input=sushi&inputtype=textquery&locationbias=point:30.22,-92.02&fields=formatted_address,geometry,icon,name,permanently_closed,photos,place_id,plus_code,type`);
	*/
	let googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${google_token}`;
	let resp = await fetch(`${googleUrl}&keyword=cajun&location=30.22,-92.02&radius=5000`);

	let data = await resp.json();

	console.log(data.results[0]);

	// now get the detail on first one
	if(data.results.length > 0) {

		googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${google_token}`;
		resp = await fetch(`${googleUrl}&place_id=${data.results[0].place_id}`);
		data = await resp.json();
		console.log('----------- DETAIL ON FIRST ----------');
		console.log(data);
	}
})();
