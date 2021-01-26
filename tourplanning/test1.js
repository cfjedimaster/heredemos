require('dotenv').config();

const fetch = require('node-fetch');
const KEY = process.env.KEY;

const body = {
  "plan": {
    "jobs": [
      {
        "id": "myJob",
        "places": {
          "deliveries": [
            {
              "location": {"lat": 52.46642, "lng": 13.28124},
              "times": [["2020-07-04T10:00:00.000Z","2020-07-04T12:00:00.000Z"]],
              "duration": 180,
              "demand": [1]
            }
          ]
        }
      }
    ]
  },
  "fleet": {
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
            "location": {"lat": 52.52568, "lng": 13.45345}
          },
          "end": {
            "time": "2020-07-04T18:00:00Z",
            "location": {"lat": 52.52568, "lng": 13.45345}
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
  }
};

fetch('https://tourplanning.hereapi.com/v2/problems?apikey='+KEY, {
	method:'POST', 
	body:JSON.stringify(body),
	headers: {
		'Content-Type':'application/json',
		'Content-Accepts':'application/json'
	}
}).then(res => res.json())
.then(res => {
	console.log(JSON.stringify(res, null, '\t'));
});