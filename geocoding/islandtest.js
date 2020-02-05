/*
trying to help this user: https://stackoverflow.com/questions/59987623/encountered-problem-with-geocoder-here-api-for-searching-island
*/

require('dotenv').config();
const fetch = require('node-fetch');

const HERE_APP_ID = process.env.HERE_APP_ID;
const HERE_API_KEY = process.env.HERE_API_KEY;
let address = '403 Robinhood Circle, Lafayette, LA 70508';


let url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${HERE_API_KEY}&searchtext=%C3%8Ele%20de%20R%C3%A9&additionaldata=IncludeShapeLevel%2C%20default&gen=9&mapview=46.14288%2C-1.5629%3B46.2582%2C-1.25416&additionaldata=IncludeShapeLevel,country`;

fetch(url)
.then(res => res.json())
.then(res => {
	
	let view = res.Response.View[0].Result[0].Location.NavigationPosition;
	//console.log(JSON.stringify(view, null, '\t'));
	
	//console.log(JSON.stringify(res, null, '\t'));
	
	

});


let url2 = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${HERE_API_KEY}&mode=retrieveAreas&at=46.17123,-1.24126`;
//let url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${HERE_API_KEY}&mode=retrieveAreas&prox=52.5309,13.3847,250`;
fetch(url2)
.then(res => res.json())
.then(res => {
	console.log(JSON.stringify(res, null, '\t'));
	console.log('in reverse');
});
