const canvas = document.getElementById('map');

//"https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_base_globe.json",

const map = new harp.MapView({
    canvas,
    theme:
        "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_base_globe.json",
        projection: harp.sphereProjection,
   //For tile cache optimization:
   maxVisibleDataSourceTiles: 40, 
   tileCacheSize: 100
});
const controls = new harp.MapControls(map);
const omvDataSource = new harp.OmvDataSource({
    baseUrl: "https://vector.hereapi.com/v2/vectortiles/base/mc",
    apiFormat: harp.APIFormat.XYZOMV,
    styleSetName: "tilezen",
    authenticationCode: "c1LJuR0Bl2y02PefaQ2d8PvPnBKEN8KdhAOFYR_Bgmw",
    authenticationMethod: {
        method: harp.AuthenticationMethod.QueryString,
        name: "apikey"
    },
    gatherFeatureIds:true
});
map.addDataSource(omvDataSource);

map.setCameraGeolocationAndZoom(
	new harp.GeoCoordinates(39.82, -98.56), 5
);

let space = 'VdHRsrXD';
const music = new harp.OmvDataSource({
    baseUrl: "https://xyz.api.here.com/hub/spaces/" + space + "/tile/web",
    apiFormat: harp.APIFormat.XYZSpace,
    authenticationCode: 'AK8NuG-XRNmumBtho_dgbQA',
    gatherFeatureIds:true,
    gatherFeatureAttributes:true
 });

 map.addDataSource(music).then(() => {
    const styles = [{
        when: "$geometryType == 'point'",
        technique: "circles",
        renderOrder: 10000,
        attr: {
            color: "#7ED321",
            size: 30
        }
    }]

    music.setStyleSet(styles);
    map.update();
 });

let info = document.querySelector('#info');
let defaultDiv = document.querySelector('#default');

 canvas.onclick = e => {
    defaultDiv.style.display = 'block';
    info.style.display = 'none';
    const intersections = map.intersectMapObjects(e.clientX, e.clientY);
    if(!intersections) return;
    const i = intersections.find(x => x.hasOwnProperty('userData') && x.userData.$layer === space);
    if(!i) return;
    console.log('db', i);
    let embed = i.userData.link.replace(/\/track/,'/embed/track');
    let html = `
<h2>${i.userData.Date} - ${i.userData.Name}</h2>
<p>
${i.userData.Description}
</p>
<iframe src="${embed}" width="300" height="300" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
    console.log(html);
    //<iframe src="https://open.spotify.com/embed/track/6mcxQ1Y3uQRU0IHsvdNLH1" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    defaultDiv.style.display = 'none';
    info.style.display = 'block';
    info.innerHTML = html;
}