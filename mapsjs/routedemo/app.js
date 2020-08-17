/*
Credit - https://developer.here.com/documentation/examples/maps-js/services/map-with-route-from-a-to-b
I used some of the rendering functions from here!
*/

const KEY = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

document.addEventListener('DOMContentLoaded', init, false);
let showRouteButton, startField, endField, directionsDiv, addWaypointButton, newWaypoint, waypointList;

let map, platform, router, geocoder;

let waypoints = [];

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
	let ui = H.ui.UI.createDefault(map, defaultLayers);

	router = platform.getRoutingService(null,8);
	geocoder = platform.getSearchService();

	showRouteButton = document.querySelector('#showRouteButton');
	showRouteButton.addEventListener('click', doShowRoute);

	startField = document.querySelector('#start');
	endField = document.querySelector('#end');

	directionsDiv = document.querySelector('#directionsText');

	addWaypointButton = document.querySelector('#addWaypointButton');
	addWaypointButton.addEventListener('click', addWaypoint);
	newWaypoint = document.querySelector('#newWaypoint');

	waypointList = document.querySelector('#waypointList');

	// temp for testing
	startField.value = 'Lafayette, LA, USA';
	endField.value = 'Chicago, Il, USA';
	newWaypoint.value = 'Las Vegas, NV';

}

async function doShowRoute() {
	console.log('do the route thing');

	let start = startField.value;
	let end = endField.value;

	if(!start) {
		alert('Specify a starting location.');
		return;
	}

	if(!end) {
		alert('Specify a end location.');
		return;
	}

	directionsDiv.innerHTML = '<p><i>Please stand by, doing awesome stuff...</i></p>';

	let originPos = await geocode(start);
	let endPos = await geocode(end);
	console.log(originPos, endPos);

    let routeRequestParams = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: originPos.lat+','+originPos.lng, 
        destination: endPos.lat+','+endPos.lng,  
        return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
    };


	for(let i=0;i<waypoints.length;i++) {
		if(!routeRequestParams.via) routeRequestParams.via = [];
		let value = waypoints[i].pos.lat+','+waypoints[i].pos.lng;
		routeRequestParams.via.push(value);
	}
	
	//routeRequestParams.via = ['36.17,-115.14','47.60537,-122.32945'];

	console.log(routeRequestParams);
	let route = await getRoute(routeRequestParams);
	console.log(route);
	addRouteShapeToMap(route);
	addRouteText(route);
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
		console.log(url);
		let resp = await fetch(url);
		let data = await resp.json();
		return data.routes[0];

}

function addRouteShapeToMap(route) {
	// remove existing routes
	let obs = map.getObjects();
	obs.forEach(ob => {
		if(ob.type === H.map.Object.Type.SPATIAL) map.removeObject(ob);
	});

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

    // Add the polyline to the map
    map.addObject(polyline);
  });
}

function addRouteText(route) {
	
	let desc = '<ol>';
	route.sections.forEach(s => {
		s.actions.forEach((a, idx) => {
			desc += `<li>${a.instruction}</li>`;
		});
	});
	desc += '</ol>';
	directionsDiv.innerHTML = desc;

}

async function addWaypoint() {
	let wp = newWaypoint.value;
	if(!wp) {
		alert('Enter a location in the waypoint field');
		return;
	}

	let pos = await geocode(wp);
	waypoints.push({label:wp, pos});
	renderWaypoints();
	newWaypoint.value = '';
	console.log(pos);
}

function renderWaypoints() {
	let s = '<ul>';
	waypoints.forEach((wp,x) => {
		s += `<li onclick='removeWp(${x})' class='waypointItem' title='Click to remove'>${wp.label}</li>`;
	});
	s += '</ul>';

	waypointList.innerHTML = s;

}

function removeWp(idx) {
	console.log('remove '+idx);
	for(let x=waypoints.length-1;x>=0;x--) {
		console.log(x,idx);
		if(x === idx) waypoints.splice(idx,1);
	}
	renderWaypoints();
}