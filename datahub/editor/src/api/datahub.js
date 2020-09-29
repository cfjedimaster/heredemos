module.exports = {

	async loadSpaces(token) {
		console.log('load spaces in the wrapper');
		let resp = await fetch(`https://xyz.api.here.com/hub/spaces?access_token=${token}`);
		let data = await resp.json();
		return data;
	}
}