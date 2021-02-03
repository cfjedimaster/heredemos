const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

/*
Defines our categories to search.

600-6400-0000 - Drugstore or Pharmacy
700-7300-0280 - Ambulance Services
800-8000-0000 - Hospital or Health Care Facility

*/
const CATEGORIES = '600-6400-0000,700-7300-0280,800-8000-0000';

// Radius for circular search in meters, 3200 ~= 2 miles
const RADIUS = 3200;

document.addEventListener('DOMContentLoaded', init, false);

let map, platform, ui, geocoder, search;


function init() {
	platform = new H.service.Platform({
		'apikey': KEY
	});

	// Obtain the default map types from the platform object:
	let defaultLayers = platform.createDefaultLayers();

	
	map = new H.Map(
		document.getElementById('map'),
		defaultLayers.vector.normal.map,
		{
			zoom: 5,
			center: { lat: 31.51073, lng: -96.4247 },
			pixelRatio: window.devicePixelRatio || 1,
			padding: {top: 50, left: 50, bottom: 50, right: 50}
		}
	);

	new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI:
	ui = H.ui.UI.createDefault(map, defaultLayers);

	markerIcon = new H.map.Icon('marker.png');

	geocoder = platform.getGeocodingService();
	search = platform.getSearchService();

	map.addEventListener('tap', handleClick);
}

async function handleClick(evt) {
	var coord = map.screenToGeo(
		evt.currentPointer.viewportX,
		evt.currentPointer.viewportY);
	let lat = coord.lat.toFixed(4);
	let lng = coord.lng.toFixed(4);
	let location = await reverseGeocode(lat, lng);
	console.log(location);
	
	let medicalResources = await getMedicalResources(lat, lng, RADIUS);
	console.log(medicalResources);

	/*
	do we have a county and state? we need this to get covid info
	*/
	let county, state;
	if(location.AdditionalData) {
		// so location.State is LA, but covid api needs the fuill name
		location.AdditionalData.forEach(a => {
			if(a.key === 'StateName') state = a.value;
			if(a.key === 'CountyName') county = a.value;
		});
	}
	if(county && state) {
		let covidData = await getCovidData(county, state);
		console.log(covidData);
	}

}

async function reverseGeocode(lat, lng) {

	var reverseGeocodingParameters = {
		prox: lat + ',' + lng,
		mode: 'retrieveAddresses',
		maxresults: 1
	};

	return new Promise((resolve, reject) => {
		geocoder.reverseGeocode(
			reverseGeocodingParameters,
			e => {
				if(e.Response.View.length > 0) {
					let result = e.Response.View[0].Result[0];
					resolve(result.Location.Address);
				} else reject('No result');
			},
			function(e) { reject(e); }
		);
	});
}

async function getMedicalResources(lat, lng, radius) {
	let searchParams = {
		at:`${lat},${lng}`,
		categories:CATEGORIES,
		limit:100,
		in:`circle:${lat},${lng};r=${radius}`
	};

	return new Promise((resolve, reject) => {
		search.browse(
			searchParams,
			e => {
				resolve(e);
				/*
				if(e.Response.View.length > 0) {
					let result = e.Response.View[0].Result[0];
					resolve(result.Location.Address);
				} else reject('No result');
				*/
			},
			function(e) { reject(e); }
		);
	});
}

async function getCovidData(county, state) {
	console.log(`look up ${county}, ${state}`);
//	curl -X GET "https://covid-api.com/api/reports?iso=USA&region_province=Louisiana&city_name=Lafayette" -H "accept: application/json" -H "X-CSRF-TOKEN: "
// curl -X GET "https://covid-api.com/api/reports?q=Church%20Point%2C%20Louisiana&iso=USA" -H "accept: application/json" -H "X-CSRF-TOKEN: "
	return new Promise(async (resolve, reject) => {

//		let resp = await fetch(`https://covid-api.com/api/reports?iso=USA&q=${encodeURIComponent(city)}%20${encodeURIComponent(state)}`);
		let resp = await fetch(`https://covid-api.com/api/reports?iso=USA&city_name=${encodeURIComponent(county)}&region_provice=${encodeURIComponent(state)}`);
		let data = await resp.json();

		resolve(data.data[0]);
	});
}