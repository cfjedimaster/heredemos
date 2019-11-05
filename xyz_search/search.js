

require('dotenv').config();

const fetch = require('node-fetch');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const SPACE_ID = process.env.SPACE_ID;

// Example of a specific breed search
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/search?access_token=${ACCESS_TOKEN}&p.breed=ragdoll`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results (breed=ragdoll).\n\n');
})
.catch(e => {
	console.error(e);	
});

// age lte 3
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/search?access_token=${ACCESS_TOKEN}&p.age<=3`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results (age<=3).\n\n');
})
.catch(e => {
	console.error(e);
});

// age lte 3 AND beed=ragdoll
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/search?access_token=${ACCESS_TOKEN}&p.age<=3&p.breed=ragdoll`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results (age<=3 && breed=ragdoll).\n\n');
})
.catch(e => {
	console.error(e);
});

// Or search on breeds
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/search?access_token=${ACCESS_TOKEN}&p.breed=ragdoll,devon%20rex`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results (breed=ragdoll, devonrex).\n\n');
})
.catch(e => {
	console.error(e);
});

// Select props
fetch(`https://xyz.api.here.com/hub/spaces/${SPACE_ID}/search?access_token=${ACCESS_TOKEN}&p.breed=ragdoll&selection=p.breed`)
.then(res => {
	return res.json();
})
.then(res => {
	// show one sample
	if (res.features.length >= 1) console.log(JSON.stringify(res.features[0].properties, null, '\t'));
	console.log(res.features.length + ' results (breed=ragdoll, limited props to breed).\n\n');
})
.catch(e => {
	console.error(e);
});