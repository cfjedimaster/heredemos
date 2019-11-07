const genders = ["male", "female"];
const breeds = ["persian", "bengal", "siamese", "maine coon", "sphynx", "ragdoll", "birman", "chartreux", "toyger", "devon rex"];
const NUM_CATS = 2000;

// CREDIT: https://gist.github.com/Miserlou/c5cd8364bf9b2420bb29
const cities = require('./cities.json');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName() {
	var initialParts = ["Fluffy", "Scruffy", "King", "Queen", "Emperor", "Lord", "Hairy", "Smelly", "Most Exalted Knight", "Crazy", "Silly", "Dumb", "Brave", "Sir", "Fatty", "Zombified"];
	var lastParts = ["Sam", "Smoe", "Elvira", "Jacob", "Lynn", "Fufflepants the III", "Squarehead", "Redshirt", "Titan", "Kitten Zombie", "Dumpster Fire", "Butterfly Wings", "Unicorn Rider", "Juniper", "Lindy", "Fart Pants"];
	return initialParts[getRandomInt(0, initialParts.length - 1)] + ' ' + lastParts[getRandomInt(0, lastParts.length - 1)]
};


function makeCat() {
	return {
		name: randomName(), 
		gender: genders[getRandomInt(0,1)],
		age: getRandomInt(1, 10),
		breed: breeds[getRandomInt(0, breeds.length-1)], 
		available: getRandomInt(0,1)==1?true:false
	}
}

let root = {
	"type": "FeatureCollection",
	"features": [
	]
};

// used for my testing of nested props
const weapons = ["katanas","broadswords","shortswords","pole axes"];
const cooking = ["cookies","pies","cakes","roasts"];

for(let i=0;i<NUM_CATS;i++) {
	let cat = makeCat();

	/*
	added so that I could test array props
	*/
	cat.friends = [];
	let totalFriends = getRandomInt(0,3);
	for(let i=0;i<totalFriends;i++) {
		cat.friends.push(randomName());
	}

	/*
	Added so I can test nested props
	*/
	cat.skills = {
		weapons:weapons[getRandomInt(0, weapons.length-1)],
		cooking:cooking[getRandomInt(0, cooking.length - 1)]
	};

	let city = cities[getRandomInt(0, cities.length - 1)];

	let long = 0; let lat = 0;
	let feature = {
		"type":"Feature",
		"properties":cat,
		"geometry":{
			"type":"Point",
			"coordinates":[city.longitude, city.latitude]
		}
	}
	root.features.push(feature);
}

console.log(JSON.stringify(root, null, '\t'));