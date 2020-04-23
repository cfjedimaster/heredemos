/*
So I wrote the initial script to populate national-parks-full.geojson, and it's good, but to enable
nicer use in Studio, which doesn't support embedded properties, I'm writing a script that reads in the
original file and outputs national-parks-studio.json. It creates a "flatter" version wih some opinionated 
decisions on what to expose.

Note this is not perfect, like i assume the first phonenumber is voice, I could improve this later.
added support for the above, basically if first # isnt voice, ignore
*/

const fs = require('fs');

let data = JSON.parse(fs.readFileSync('./national-parks-full.geojson'));

data.features = data.features.map(f => {

	let newProps = {};

	if(f.properties.contacts) {
		if(f.properties.contacts.phoneNumbers && f.properties.contacts.phoneNumbers[0].type === 'Voice') {
			newProps.phoneNumber = f.properties.contacts.phoneNumbers[0].phoneNumber;
		} 

		if(f.properties.contacts.emailAddresses) {
			newProps.emailAddress = f.properties.contacts.emailAddresses[0].emailAddress;
		} 
	}

	if(f.properties.activities) {
		newProps.activities = f.properties.activities.reduce((list, activity) => {
			if(list != '') list += ',';
			return list += activity.name;
		},'');
	}

	newProps.directionsInfo = f.properties.directionsInfo;
	newProps.directionsUrl = f.properties.directionsUrl;
	newProps.url = f.properties.url;
	newProps.weatherInfo = f.properties.weatherInfo;
	newProps.name = f.properties.name;

	if(f.properties.topics) {
		newProps.topics = f.properties.topics.reduce((list, topic) => {
			if(list != '') list += ',';
			return list += topic.name;
		},'');
	}

	newProps.description = f.properties.description;

	if(f.properties.images && f.properties.images.length >= 1) {
		newProps.image = f.properties.images[0].url;
	}

	newProps.designation = f.properties.designation;
	newProps.parkCode = f.properties.parkCode;
	newProps.fullName = f.properties.fullName;

	//console.log(newProps);
	f.properties = newProps;
	return f;
});

fs.writeFileSync('./national-parks-studio.geojson', JSON.stringify(data));


/*

				"entranceFees": [
					{
						"cost": "0.0000",
						"description": "No entrance fee required.",
						"title": "No Entrance Fee"
					}
				],

				"addresses": [
					{
						"postalCode": "02445",
						"city": "Brookline",
						"stateCode": "MA",
						"line1": "99 Warren Street",
						"type": "Physical",
						"line3": "",
						"line2": ""
					},
					{
						"postalCode": "02445",
						"city": "Brookline",
						"stateCode": "MA",
						"line1": "99 Warren Street",
						"type": "Mailing",
						"line3": "",
						"line2": ""
					}
				],

*/