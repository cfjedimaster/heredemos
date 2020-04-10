const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

let id = 'here:pds:place:8409vqef-c2e32cec334649f694d4e8ca75f8914a';
fetch(`https://lookup.search.hereapi.com/v1/lookup?apikey=${API_KEY}&id=${id}`)
.then(res => res.json())
.then(res => {
			console.log(JSON.stringify(res,null,'\t'));
});
