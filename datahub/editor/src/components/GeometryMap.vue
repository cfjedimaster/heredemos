<template>
  <img v-if="imgSrc" :src="imgSrc">
</template>

<script>

//todo - remove :)
const key = 'c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw';

export default {
	name: 'GeometryMap',
	props:{
		geometry: { required: true },
		width: { default: 500 },
		height: { default: 500 }
	},
	created() {
		this.imgSrc = this.featureToMap(JSON.parse(this.geometry), key, this.width, this.height);
	},
	data: () => ({
		imgSrc:null
	}),
	methods:{
		featureToMap(geometry,key,w=500,h=500) {
			let url = 'https://image.maps.ls.hereapi.com/mia/1.6/';
			if(geometry.type === 'Point') {
				url += `mapview?apiKey=${key}&w=${w}&h=${h}`;
				url += `&c=${geometry.coordinates[1]},${geometry.coordinates[0]}`;
			} else if(geometry.type === 'MultiPoint') {
				url += `mapview?apiKey=${key}&w=${w}&h=${h}&poi=`;
				for(let i=0;i<geometry.coordinates[0].length;i++) {
					url += `${geometry.coordinates[i][1]},${geometry.coordinates[i][0]}`;
					if(i < geometry.coordinates.length-1) {
						url += ',';
					}
				}
			} else if(geometry.type === 'LineString') {
				url += `route?apiKey=${key}&w=${w}&h=${h}`;
				url += '&r0=';
				for(let i=0;i<geometry.coordinates.length;i++) {
					url += `${geometry.coordinates[i][1]},${geometry.coordinates[i][0]}`;
					if(i < geometry.coordinates.length-1) {
						url += ',';
					}
				}
			} else if(geometry.type === 'Polygon') {
				url += `region?apiKey=${key}&w=${w}&h=${h}`;
				url += '&a=';
				for(let i=0;i<geometry.coordinates[0].length;i++) {
					url += `${geometry.coordinates[0][i][1]},${geometry.coordinates[0][i][0]}`;
					if(i < geometry.coordinates[0].length-1) {
						url += ',';
					}
				}
			} else {
				return;
			}
			return url;
			
		}

	}
}
</script>
