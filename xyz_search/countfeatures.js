/*
Point me at a geojson file and I tell you the # of features
*/

const fs = require('fs');

if(process.argv.length < 3) {
	console.error('Pass in the file name as an argument.');
	process.exit(1);
}

let fileToRead = process.argv[2];
console.log(`Parse ${fileToRead}`);
let contents = fs.readFileSync(fileToRead, 'utf-8');
let featureCount = JSON.parse(contents).features.length;
console.log(`This file had ${featureCount} features.`);