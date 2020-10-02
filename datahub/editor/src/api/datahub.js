module.exports = {

	async loadSpaces(token) {
		console.log('load spaces in the wrapper');
		let resp = await fetch(`https://xyz.api.here.com/hub/spaces?access_token=${token}`);
		let data = await resp.json();
		return data;
	},

	async loadSpace(id, token) {
		console.log('load space '+id);
		// no pagination currently, but gets 30K results
		let resp = await fetch(`https://xyz.api.here.com/hub/spaces/${id}/iterate?access_token=${token}`);
		let data = await resp.json();
		return data.features;
	},

	async saveFeature(space, feature, token) {
		let resp = await fetch(`https://xyz.api.here.com/hub/spaces/${space}/features/${feature.id}?access_token=${token}`, 
		{
			method:'PUT',
			body:JSON.stringify(feature),
			headers: {
				'Content-Type':'application/geo+json'
			}
		});
		let data = await resp.json();
		return data;

	}
}