const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

const MAX_FEATURE_SIZE = 10;

document.addEventListener('DOMContentLoaded', init, false);

let map, platform, ui, router;
let fileInput, rangeInput, rangeControls, rangeType;

let mapData, markerGroup, isoGroup;

function init() {
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

	markerIcon = new H.map.Icon('marker.png');


	fileInput = document.querySelector('#fileUpload');
	fileInput.addEventListener('change', handleFile);

	rangeInput = document.querySelector('#range');
	rangeInput.addEventListener('change', handleRange);

	document.querySelector('#max_display').innerHTML = MAX_FEATURE_SIZE;

	rangeControls = document.querySelector('#rangeControls');

	rangeType = document.querySelectorAll('input[name=rangetype]');
	rangeType.forEach(r => r.addEventListener('change', handleRange));

}

function handleFile() {
	let file = fileInput.files[0];
    if(!file) return;
    let type = file.name.split('.').pop();

	if(type !== 'geojson' && type !== 'csv') {
		alert('Please select a geojson or csv file. Or else!');
		return;
	}

    // Credit: https://stackoverflow.com/a/754398/52160
	let reader = new FileReader();
	reader.readAsText(file, "UTF-8");
	reader.onload =  evt => {
		let text = evt.target.result;
		console.log('read text');

		if(type === 'geojson') mapData = parseGeoJSON(text);
		if(type === 'csv') {
			mapData = parseCSV(text);
			if(!mapData) return;
		}

		//limit to total
		mapData = mapData.slice(0, MAX_FEATURE_SIZE-1);
		renderMapData();
		//show the controls div
		rangeControls.style.display = 'block';

	}
	reader.onerror = evt => {
		console.error(evt);
	}
}

/*
Both parse functions are responsible for creating a simpler version of themselves where it is an array of
objects in this shape:

lat:x, lng: y

And that's it. We need *something* else eventually to add labels but - for now, just that.

Note, we are assuming Point geometries
*/
function parseGeoJSON(text) {
	let data = JSON.parse(text);
	return data.features.map(f => {
		return {
			lat:f.geometry.coordinates[1],
			lng:f.geometry.coordinates[0],
		}
	});
}

function parseCSV(text) {
	let parsedData = Papa.parse(text, {header:true, skipEmptyLines:true});

	if(parsedData.meta.fields.indexOf("lat") === -1 || parsedData.meta.fields.indexOf("lng") === -1) {
		alert('CSV file must contain headers named lat and lng');
		return;
	}

	return parsedData.data.map(f => {
		return {
			lat:f.lat,
			lng:f.lng,
		}
	});


}

function renderMapData() {
	console.log('called', mapData);
	markerGroup.removeAll();
	mapData.forEach(m => {
		markerGroup.addObject(new H.map.Marker(m, { icon:markerIcon }));
	});

	map.getViewModel().setLookAtData({bounds: markerGroup.getBoundingBox()});

}

/*
todo: dont do shit till we have data
*/
function handleRange() {
	//note, the call below isn't documented
	if(markerGroup.getChildCount() === 0) return;
	console.log('ok draw some freaking isolines!');

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
	console.log('drawISOResult', result);

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