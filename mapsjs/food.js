const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';


const platform = new H.service.Platform({
	'apikey': KEY
});

const searchService = platform.getSearchService();


document.addEventListener('DOMContentLoaded', init, false);

function init() {


	// Obtain the default map types from the platform object:
	var defaultLayers = platform.createDefaultLayers();

	var map = new H.Map(
		document.getElementById('mapContainer'),
		defaultLayers.vector.normal.map,
		{
			zoom: 5,
			center: { lat: 35.22, lng: -92.02 },
			pixelRatio: window.devicePixelRatio || 1
		}
	);

	var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	var ui = H.ui.UI.createDefault(map, defaultLayers);
	
	let instructions = document.querySelector('#instructions');
	let result = document.querySelector('#result');

	map.addEventListener('tap', async evt => {

		// hide once tapped
		instructions.style.display = 'none';

		let geom = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
		let address = await reverseGeocode(geom);
		console.log('address is '+address);	
		let restaurants = await getRestaurants(geom);
		//console.log('restaurants', restaurants);
		//Note, we are NOT reporting on types in this demo, but I may bring it back.
	   	let types = sortToArray(generateRestaurantTypes(restaurants));
	    let foodTypes = sortToArray(generateFoodTypes(restaurants));
		console.log(foodTypes);
		let html = `
<h3>Location: ${address}</h3>

<b>Most Popular Food Types:</b>
<ul>
		`;
		for(let i=0;i<Math.min(foodTypes.length,10);i++) {
			html += `
			<li>${foodTypes[i].name}</li>
			`;
		};
		html += '</ul>';
		result.innerHTML = html;
	});
}

async function reverseGeocode(coords) {
	return new Promise((resolve, reject) => {
		searchService.reverseGeocode({
			at: `${coords.lat},${coords.lng}`
		}, result => {
			//assume one result always
			let match = result.items[0];
			// we also want to return at the city level, not street. We can do county too 
			if(match.address.city && match.address.state) resolve(`${match.address.city}, ${match.address.state}`);
			else if(match.address.county && match.address.state) resolve(`${match.address.county}, ${match.address.state}`);
			else {
				console.log('got result', match);
				// better than nothing
				resolve(match.title);
			}
		}, e => reject(e));
	});
}

async function getRestaurants(coords) {
	return new Promise((resolve, reject) => {
		searchService.browse({
			at: `${coords.lat},${coords.lng}`,
			limit: 100,
			categories: '100-1000-0000',
			lang:'en-US'
		}, results => {
			let restaurants = results.items.map(m => {
				let open = '';
				let openHours = '';
				if(m.openingHours && m.openingHours.length >= 1) {
					open = m.openingHours[0].isOpen;
					openHours = m.openingHours[0].text;
				}
				return {
					title:m.title,
					address:m.address,
					position:m.position,
					contacts:m.contacts,
					open:open,
					openHours:openHours,
					categories:m.categories,
					foodTypes:m.foodTypes
				}
			});
			resolve(restaurants);
		
		}, e => reject(e));

	});
}


function generateFoodTypes(items) {
	let result = {};
	for(i of items) {
		if(i.foodTypes) {
			for(c of i.foodTypes) {
				//only do the primary
				if(c.primary) {
					if(!result[c.name]) result[c.name] = 0;
					result[c.name]++;
				}
			}
		}
	}
	return result;
}

function generateRestaurantTypes(items) {
	let result = {};
	for(i of items) {
		for(c of i.categories) {
			//ignore the generic
			if(c.id !== '100-1000-0000') {
				if(!result[c.name]) result[c.name] = 0;
				result[c.name]++;
			}
		}
	}
	return result;
}

function sortToArray(ob) {
	//generic utility for sorting an object of key/value
	let result = [];
	let keys = Object.keys(ob);
	for(o of keys) {
	result.push({name:o, value:ob[o]});
	}
	result.sort((a,b) => {
		if(a.value < b.value) return 1;
		if(a.value > b.value) return -1;
		return 0;
	});
	return result;
}
