const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

document.addEventListener('DOMContentLoaded', init, false);

let map, platform, ui;
let fileInput, dinstanceInput;

let mapData, markerGroup;

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

	markerGroup = new H.map.Group();
	map.addObject(markerGroup);

	new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI:
	ui = H.ui.UI.createDefault(map, defaultLayers);

	markerIcon = new H.map.Icon('marker.png');


	fileInput = document.querySelector('#fileUpload');
	fileInput.addEventListener('change', handleFile);

	distanceInput = document.querySelector('#distance');
	distanceInput.addEventListener('change', handleDistance);
}

function handleFile() {
	console.log('handleFile');
	console.log(fileInput.files);


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
		if(type === 'csv') alert('TODO');

		renderMapData();
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


function renderMapData() {
	console.log('called', mapData);
	markerGroup.removeAll();
	mapData.forEach(m => {
		markerGroup.addObject(new H.map.Marker(m, { icon:markerIcon }));
	});

	map.getViewModel().setLookAtData({bounds: markerGroup.getBoundingBox()});

}

/*
todo: change name, its distance or time
todo: dont do shit till we have data
*/
function handleDistance() {
	//note, the call below isn't documented
	if(markerGroup.getChildCount() === 0) return;
	console.log('ok draw some freaking isolines!');

}