const KEY = 'change me';

document.addEventListener('DOMContentLoaded', init, false);

let map, platform, ui, router;
let rangeInput, rangeControls, rangeType;

let mapData, markerGroup, isoGroup;

async function init() {
	platform = new H.service.Platform({
		'apikey': KEY
	});

	// Obtain the default map types from the platform object:
	let defaultLayers = platform.createDefaultLayers();

	router = platform.getRoutingService();
	
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

	markerGroup = new H.map.Group();
	map.addObject(markerGroup);

	isoGroup = new H.map.Group();
	map.addObject(isoGroup);

	new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI:
	ui = H.ui.UI.createDefault(map, defaultLayers);

	// get stuff from the DOM to use later
	rangeInput = document.querySelector('#range');
	rangeInput.addEventListener('change', handleRange);

	rangeControls = document.querySelector('#rangeControls');

	rangeType = document.querySelectorAll('input[name=rangetype]');
	rangeType.forEach(r => r.addEventListener('change', handleRange));

	mapData = await loadData();
	renderMapData();

	//show the controls div
	rangeControls.style.display = 'block';

}

/*
I'm the function that loads your data. It must return an array of items where 
each item has a lat and lng property.
*/
async function loadData() {
	alert('change me!');
}

function renderMapData() {
	markerGroup.removeAll();
	mapData.forEach(m => {
		markerGroup.addObject(new H.map.Marker(m));
	});

	map.getViewModel().setLookAtData({bounds: markerGroup.getBoundingBox()});

}

function handleRange() {
	//note, the call below isn't documented
	if(markerGroup.getChildCount() === 0) return;

	isoGroup.removeAll();

	let range = rangeInput.value;

	/*
	rangetype=time, its seconds
	rangetype=distance, its meters
	*/
	let type = 'distance';
	if(rangeType[1].checked) type = 'time'; 

	if(type === 'distance') {
		//convert km input to m
		range = range * 1000;
	} else {
		//convert minutes to s
		range = range * 60;
	}

	mapData.forEach(m => {

		let routingParams = {
			'mode': 'fastest;car;',
			'start': `geo!${m.lat},${m.lng}`,
			'range': range,
			'rangetype': type
		};

		router.calculateIsoline(
			routingParams,
			drawISOResult,
			error => alert(error.message));

	});

}

function drawISOResult(result) {

    let isolineCoords = result.response.isoline[0].component[0].shape,
    linestring = new H.geo.LineString(),
    isolinePolygon;

	// Add the returned isoline coordinates to a linestring:
	isolineCoords.forEach(function(coords) {
		linestring.pushLatLngAlt.apply(linestring, coords.split(','));
	});

	// Create a polygon and a marker representing the isoline:
	isolinePolygon = new H.map.Polygon(linestring);

	// Add the polygon and marker to the map:
	isoGroup.addObjects([isolinePolygon]);

	// Center and zoom the map so that the whole isoline polygon is
	// in the viewport:
	map.getViewModel().setLookAtData({bounds: isoGroup.getBoundingBox()});
}