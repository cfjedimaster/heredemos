require('dotenv').config();

const fetch = require('node-fetch');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SPACE_ID = 'ylfzY538';

let body = {
    "type": "Polygon",
    "coordinates": [
		[
			[-94.0565, 33.0183],
			[-91.1669, 32.9510],
			[-89.0984,29.1543],
			[-93.8898, 29.7350],
			[-94.0565, 33.0183]
		]
	]
}

fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/spatial?access_token=${ACCESS_TOKEN}`, {
	method:'POST',
	body:JSON.stringify(body),
	headers: {
		'Content-Type':'application/geo+json'
	}
})
.then(res => {
	return res.json();
})
.then(res => {
	if (res.features.length >= 1) {
		res.features.forEach(f => console.log(f.properties.fullName));
	}
	console.log(res.features.length + ' results\n\n');
})
.catch(e => {
	console.error(e);	
});
