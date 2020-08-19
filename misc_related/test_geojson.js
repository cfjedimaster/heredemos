/*
I wrote this script after Studio reported a file had an invalid longitude:

Upload failed: The longitude (1st) value in coordinates of the Point is out of bounds (< -180 or > +180).

It basically just tries to confirm where the bad data is. :)

*/

const fs = require('fs');

let path = './countries.geojson';

let contents = fs.readFileSync(path, 'UTF-8');
let data = JSON.parse(contents);
console.log(`There are ${data.features.length} features.`);
data.features.forEach(f => {
	/*
	right now im focused on one file that's just MultiPolygon, todo, make it better
	*/
	if(f.geometry.type === 'MultiPolygon') {
		let p = f.geometry.coordinates[0][0];

		p.forEach(i => {
			let [long,lat] = i;
			if(long < -180 || long > 180) {
				console.log('BAD LONG '+long);
			}
			if(lat < -180 || lat > 180) {
				console.log('BAD LAT '+lat);
			}
		});
	}
	
});

//console.log(data.features[0].geometry.coordinates[0][0]);
