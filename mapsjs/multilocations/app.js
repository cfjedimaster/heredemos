/*
Credit - https://developer.here.com/documentation/examples/maps-js/services/map-with-route-from-a-to-b
I used some of the rendering functions from here!
*/

const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

document.addEventListener('DOMContentLoaded', init, false);

let map, platform, router, geocoder, ui;
let startingAddress, locateMeBtn, homeMarker, homeIcon, destFields, destMarkers = {}, destIcon, homePos, destRoutes = {},markerGroup;
let bubble;

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
			center: { lat: 30.22, lng: -92.02 },
			pixelRatio: window.devicePixelRatio || 1
		}
	);


	let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI:
	ui = H.ui.UI.createDefault(map, defaultLayers);
	markerGroup = new H.map.Group();
	map.addObject(markerGroup);

	homeIcon = new H.map.Icon('home.png');
	destIcon = new H.map.Icon('marker.png');

	router = platform.getRoutingService(null,8);
	geocoder = platform.getSearchService();

	startingAddress = document.querySelector('#startingAddress');
	startingAddress.addEventListener('change', doStartingLocation);

	destFields = document.querySelectorAll('.destField');
	destFields.forEach(d => {
		d.addEventListener('change', doDestination);
	});

}



async function doStartingLocation() {
	console.log('address change', startingAddress.value);
	if(!startingAddress.value) {
		disableDestinationFields();
		return;
	} else enableDestinationFields();
	homePos = await geocode(startingAddress.value);
	if(homePos) addHomeMarker(homePos);
}

function enableDestinationFields() {
	destFields.forEach(d => {
		d.removeAttribute('disabled');
	});
}

function disableDestinationFields() {
	destFields.forEach(d => {
		d.setAttribute('disabled','disabled');
	});
}

function addHomeMarker(pos) {
	if(homeMarker) markerGroup.removeObject(homeMarker);
	homeMarker = new H.map.Marker({lat:pos.lat, lng:pos.lng}, {icon:homeIcon});
	homeMarker.setData("You are HERE")
	markerGroup.addObject(homeMarker);
	map.setCenter(homeMarker.getGeometry());
}

async function doDestination(e) {
	let id = e.target.id;
	console.log('id', e.target.id);
	if(!e.target.value) return;
	let pos = await geocode(e.target.value);

	let routeRequestParams = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: homePos.lat+','+homePos.lng, 
        destination: pos.lat+','+pos.lng,  
        return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
    };

	let route = await getRoute(routeRequestParams);
	console.log(route);
	let totalTime = formatTime(route.sections[0].travelSummary.duration);

	addDestMarker(pos, id, `
<p>
	<strong>Destination:</strong> ${e.target.value}<br/>
	<strong>Driving Time:</strong> ${totalTime}
</p>`);

	addRouteShapeToMap(route, id);
}

function addDestMarker(pos, id, label) {
	if(destMarkers[id]) markerGroup.removeObject(destMarkers[id]);
	destMarkers[id] = new H.map.Marker({lat:pos.lat, lng:pos.lng}, {icon:destIcon});
	destMarkers[id].setData(`<div class="bubble">${label}</div>`);

	destMarkers[id].addEventListener('tap', e => {
		if(bubble) ui.removeBubble(bubble);
		bubble = new H.ui.InfoBubble(e.target.getGeometry(), {
			content:e.target.getData()
		});
		ui.addBubble(bubble);
	});
	markerGroup.addObject(destMarkers[id]);
}

async function geocode(s) {
	let params = {
		q:s
	};

	return new Promise((resolve, reject) => {
		geocoder.geocode(
			params,
			r => {
				resolve(r.items[0].position);
			},
			e => reject(e)
		);
	});
}

async function getRoute(p) { 

	let url = `https://router.hereapi.com/v8/routes?origin=${p.origin}&transportMode=${p.transportMode}&routingMode=${p.routingMode}&destination=${p.destination}&apikey=${KEY}&return=${p.return}`;
	if(p.via) {
		p.via.forEach(v => {
			url += '&via='+v;
		});
	}
	let resp = await fetch(url);
	let data = await resp.json();
	return data.routes[0];

}

function addRouteShapeToMap(route,id) {

	// remove existing route
	if(destRoutes[id]) {
		destRoutes[id].removeAll();
		markerGroup.removeObject(destRoutes[id]);
	}

	destRoutes[id] = new H.map.Group();

	route.sections.forEach((section) => {
		// decode LineString from the flexible polyline
		let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

		// Create a polyline to display the route:
		let polyline = new H.map.Polyline(linestring, {
			style: {
				lineWidth: 4,
				strokeColor: 'rgba(0, 128, 255, 0.7)'
			}
		});

		destRoutes[id].addObject(polyline);

  	});

	markerGroup.addObject(destRoutes[id]);
	map.getViewModel().setLookAtData({bounds: markerGroup.getBoundingBox()});

}

function formatTime(s) {
  //first convert to minutes and drop seconds
  let minutes = Math.floor(s/60);
  if(minutes < 60) return `${minutes} minutes`;
  let hours = Math.floor(minutes/60);
  minutes = minutes - (hours * 60);
  return `${hours} hours and ${minutes} minutes`;
}
