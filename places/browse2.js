const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.API_KEY;


let text = 'sushi';
fetch(`https://browse.search.hereapi.com/v1/browse?apikey=${API_KEY}&name=${encodeURIComponent(text)}&at=30.22,-92.02&categories=203-026&limit=10
`)
.then(res => res.json())
.then(res => {
	if(res.items) {
		if(res.items.length >= 0) {
			console.log(JSON.stringify(res.items[0],null,'\t'));
		}
	} else console.log(res);
});
