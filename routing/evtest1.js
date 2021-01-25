const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.HERE_API_KEY;

/*
&ev[freeFlowSpeedTable]=0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351
&ev[trafficSpeedTable]=0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36
&ev[auxiliaryConsumption]=1.8
&ev[ascent]=9
&ev[descent]=4.3

?departureTime=any
&origin=52.533959,13.404780
&ev[connectorTypes]=iec62196Type2Combo
&transportMode=car
&destination=51.741505,14.352413
&return=summary
&ev[freeFlowSpeedTable]=0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351
&ev[trafficSpeedTable]=0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36
&ev[auxiliaryConsumption]=1.8
&ev[ascent]=9&ev[descent]=4.3
&ev[makeReachable]=true
&ev[initialCharge]=48
&ev[maxCharge]=80
&ev[chargingCurve]=0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1
&ev[maxChargeAfterChargingStation]=72
*/

(async () => {

	// New York (lat, long)
	let p1 = '40.712,-74.059413';
	// Boston
	let p2 = '42.360,-71.0588801';

	let props = {
		transportMode:'car',
		origin:p1,
		destination:p2,
		'ev[freeFlowSpeedTable]':'0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351',
		'ev[trafficSpeedTable]':'0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36',
		'ev[auxiliaryConsumption]':1.8,
		'ev[ascent]':9,
		'ev[descent]':4.3,
		'ev[initialCharge]':48,
		'ev[maxCharge]':80,
		'ev[makeReachable]':true,
		'ev[connectorTypes]':'iec62196Type1Combo,iec62196Type2Combo,Chademo,Tesla',
		'ev[chargingCurve]':'0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1',
		'ev[maxChargeAfterChargingStation]':72,
		return:'summary,actions,polyline'
	};

	let route = await getRoute(props);
	// polyline is huge and noisy
	for(let i=0;i<route.sections.length;i++) {
		if(route.sections[i].polyline) route.sections[i].polyline = 'Deleted to make output easier to read.';
	}
	console.log(JSON.stringify(route, null,'\t'));

})();

async function getRoute(props) {
	let url = `https://router.hereapi.com/v8/routes?apikey=${API_KEY}`
	for(let key in props) {
		url += `&${key}=${props[key]}`;
	}
	let resp = await fetch(url);
	let data = await resp.json();
	if(!data.routes) console.log(data);
	return data.routes[0];

}