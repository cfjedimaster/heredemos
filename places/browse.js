const fetch = require('node-fetch');
require('dotenv').config();

const APP_ID = process.env.APP_ID;
const APP_CODE = process.env.APP_CODE;


//let cat = '101-000';
let cat = 'petrol-station';
cat = '';

fetch(`https://places.api.here.com/places/v1/discover/explore?app_id=${APP_ID}&app_code=${APP_CODE}&in=40.7127837,-74.0059413;r=5000&cat=${cat}`)
.then(res => res.json())
.then(res => {
	if(res.results) {
		if(res.results.items.length === 0) console.log('No results');
		res.results.items.forEach(p => {
			let isOpen = 'unknown';
			if(p.openingHours && p.openingHours.isOpen) isOpen = p.openingHours.isOpen;
			console.log(`Title: ${p.title}, category: ${p.category.title} / ${p.category.id}, open? ${isOpen} [${p.position}]`);
		});
	} else console.log(res);
});