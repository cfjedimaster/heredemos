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

	console.log('Asking Tour Planning for plan.');
	let plan = await getTourPlan(deliveries, fleet, KEY);
	console.log('Plan received...');
	// If you want to see a result, look at result.json
	//console.log(JSON.stringify(plan,null,'\t'));
	/*
	Given we have a result with .tours.stops...
	The first item in this array should be leaving the start location: 
	
				{
					"location": {
						"lat": 47.602,
						"lng": -122.30941
					},
					"time": {
						"arrival": "2020-07-04T09:56:35Z",
						"departure": "2020-07-04T09:56:35Z"
					},
					"load": [
						10
					],
					"activities": [
						{
							"jobId": "departure",
							"type": "departure"
						}
					]
				},

	Then we have should have ten more stop (cuz we had ten deliveries). Here is one sample:

				{
					"location": {
						"lat": 47.60834,
						"lng": -122.30207
					},
					"time": {
						"arrival": "2020-07-04T10:00:00Z",
						"departure": "2020-07-04T10:03:00Z"
					},
					"load": [
						9
					],
					"activities": [
						{
							"jobId": "myJob0",
							"type": "delivery"
						}
					]
				},

	We end up coming back home:

					{
					"location": {
						"lat": 47.602,
						"lng": -122.30941
					},
					"time": {
						"arrival": "2020-07-04T14:41:23Z",
						"departure": "2020-07-04T14:41:23Z"
					},
					"load": [
						0
					],
					"activities": [
						{
							"jobId": "arrival",
							"type": "arrival"
						}
					]
				}
	*/

	// If we check, we should have 12 stops, our initial step, go to 10 places, then home
	let stops = plan.tours[0].stops;
	console.log('Number of stops:',stops.length);
	// so lets now get routes between stop 1 to 2, 2 to 3, and so forth
	for(let i=0;i<stops.length-1;i++) {
		let from = stops[i].location;
		let to = stops[i+1].location;
		let departureTime = stops[i].time.departure;

		console.log(`Get route from stop ${i+1} (${JSON.stringify(from)}) to ${i+2} (${JSON.stringify(to)}) at ${departureTime}`);

		//todo - add time
		let props = {
			transportMode:'car',
			origin:`${from.lat},${from.lng}`,
			destination:`${to.lat},${to.lng}`,
			return:'summary,actions,polyline',
			departureTime
		};
		let route = await getRoute(props, KEY);
		console.log('Route returned:');
		// remove the polyline for now, it's noisy
		delete route.sections[0].polyline;
		console.log(route);
	}
})();

// I wrap calls to the API and let you pass in *slighty* simpler data
async function getTourPlan(dests, fleet, key) {
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

async function getRoute(props,key) {
	let url = `https://router.hereapi.com/v8/routes?apikey=${key}`
	for(let key in props) {
		url += `&${key}=${props[key]}`;
	}
	let resp = await fetch(url);
	let data = await resp.json();
	if(!data.routes) console.log(data);
	return data.routes[0];

}