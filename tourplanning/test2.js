require('dotenv').config();

const fetch = require('node-fetch');
const KEY = process.env.KEY;

/*
Summary: Given a set of locations + delivery time, use the TP API to plan the tour, 
then for each step of the tour, generate a route from X to Y
*/

/*
First, a set of locations around Seattle, starting with the beginning location.
*/

//1780 E Yesler Way, Seattle, WA 98122, USA
const start = {lat:47.602, lng:-122.30941}

/*
loc0 = 2320 E Cherry St, Seattle, WA 98122, USA
loc1 = 2212 E Thomas St, Seattle, WA 98112, USA
loc2 = 2402 E Newton St, Seattle, WA 98112, USA
loc3 = 2040 Franklin Ave E, Seattle, WA 98102, USA
loc4 = 2105 Westlake Ave N, Seattle, WA 98109, USA
loc5 = 2231 Western Ave, Seattle, WA 98121, USA
loc6 = 423 Maynard Ave S, Seattle, WA 98104, USA
loc7 = 2515 18th Ave S, Seattle, WA 98144, USA
loc8 = 3202 S Judkins St, Seattle, WA 98144, USA
loc9 = 1215 Lexington Way E, Seattle, WA 98112, USA
*/
const deliveries = [
	{
		location: {lat:47.60834, lng:-122.30207},
		deliveryWindow: ["2020-07-04T10:00:00.000Z","2020-07-04T12:00:00.000Z"]
	},
	{
		location: {lat:47.62153, lng:-122.30297},
		deliveryWindow: ["2020-07-04T10:00:00.000Z","2020-07-04T12:00:00.000Z"]
	},
	{
		location: {lat:47.63807, lng:-122.30117},
		deliveryWindow: ["2020-07-04T12:00:00.000Z","2020-07-04T14:00:00.000Z"]
	},
	{
		location: {lat:47.63781, lng:-122.32456},
		deliveryWindow: ["2020-07-04T12:00:00.000Z","2020-07-04T14:00:00.000Z"]
	},
	{
		location: {lat:47.63836, lng:-122.34125},
		deliveryWindow: ["2020-07-04T12:00:00.000Z","2020-07-04T14:00:00.000Z"]
	},
	{
		location: {lat:47.61204, lng:-122.3467},
		deliveryWindow: ["2020-07-04T12:00:00.000Z","2020-07-04T14:00:00.000Z"]
	},
	{
		location: {lat:47.59856, lng:-122.32537},
		deliveryWindow: ["2020-07-04T14:00:00.000Z","2020-07-04T15:00:00.000Z"]
	},
	{
		location: {lat:47.58056, lng:-122.30992},
		deliveryWindow: ["2020-07-04T14:00:00.000Z","2020-07-04T15:00:00.000Z"]
	},
	{
		location: {lat:47.59237, lng:-122.29138},
		deliveryWindow: ["2020-07-04T14:00:00.000Z","2020-07-04T15:00:00.000Z"]
	},
	{
		location: {lat:47.63036, lng:-122.28816},
		deliveryWindow: ["2020-07-04T14:00:00.000Z","2020-07-04T15:00:00.000Z"]
	}
];

/*
define our fleet, this is hard coded, not very abstract. I took this from test1.js
which took it from the docs. The only change is that shift start+end use start.lat and start.lng
*/
const fleet = {
    "types": [
      {
        "id": "myVehicle",
        "profile": "normal_car",
        "costs": {
          "distance": 0.0002,
          "time": 0.004806,
          "fixed": 22
        },
        "shifts": [{
          "start": {
            "time": "2020-07-04T09:00:00Z",
            "location": {"lat": start.lat, "lng": start.lng}
          },
          "end": {
            "time": "2020-07-04T18:00:00Z",
            "location": {"lat": start.lat, "lng": start.lng}
          }
        }],
        "capacity": [10],
        "amount": 1
      }
    ],
    "profiles": [{
      "name": "normal_car",
      "type": "car"
     }]
 };

/*
Ok, so in theory we have what we want and we can call the TP api. I'm going to define a main async function for this part of the script.
The first operation will be calling getTourPlan.
*/
(async () => {

	let plan = await getTourPlan(deliveries, fleet, KEY);
	console.log('THE PLAN-------------');
	console.log(JSON.stringify(plan,null,'\t'));

})();

 // I wrap calls to the API and let you pass in *slighty* simpler data
 async function getTourPlan(dests, fleet, key) {
	console.log('start getTourPlan');
	let body = {
		"plan": {
			"jobs": [
			]
		},
		fleet: fleet
	};

	// demand and duration hard coded for right now 
	dests.forEach((d,idx) => {
		body.plan.jobs.push({
			"id": "myJob"+idx,
			"places": {
				"deliveries": [
					{
						"location": {"lat": d.location.lat, "lng": d.location.lng},
						"times": [d.deliveryWindow],
						"duration": 180,
						"demand": [1]
					}
				]
			}
		});
	});

	return new Promise((resolve, reject) => {
		fetch('https://tourplanning.hereapi.com/v2/problems?apikey='+key, {
			method:'POST', 
			body:JSON.stringify(body),
			headers: {
				'Content-Type':'application/json',
				'Content-Accepts':'application/json'
			}
		}).then(res => res.json())
		.then(res => {
			resolve(res);
		});
	});

 }

