const canvas = document.getElementById('map');


const map = new harp.MapView({
    canvas,
    theme:
        "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json",
    tileWrappingEnabled:false
    });

const controls = new harp.MapControls(map);
const omvDataSource = new harp.OmvDataSource({
    baseUrl: "https://vector.hereapi.com/v2/vectortiles/base/mc",
    apiFormat: harp.APIFormat.XYZOMV,
    styleSetName: "tilezen",
    authenticationCode: "fQ_k2NOvmptzlxz4aywA87vTsczFDxUcu7JFbzS5xpw",
    authenticationMethod: {
        method: harp.AuthenticationMethod.QueryString,
        name: "apikey"
    },
    gatherFeatureIds:true
});
map.addDataSource(omvDataSource);

map.setCameraGeolocationAndZoom(
	new harp.GeoCoordinates(1.00, 170.00), 3
);

let space = 'rSc2jACm';
let token = 'AP9GZ7xdQo-4t5hZLyB6iQA';
const music = new harp.OmvDataSource({
    baseUrl: "https://xyz.api.here.com/hub/spaces/" + space + "/tile/web",
    apiFormat: harp.APIFormat.XYZSpace,
    authenticationCode: token,
    gatherFeatureIds:true,
    gatherFeatureAttributes:true
 });

 map.addDataSource(music).then(() => {
    const styles = [{
        when: "$geometryType == 'point'",
        technique: "circles",
        renderOrder: 10000,
        attr: {
            color: "#FFC0CB",
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
    console.log('clicked, have intersections? '+intersections.length);
    if(!intersections || intersections.length === 0) return;
    const i = intersections.find(x => x.hasOwnProperty('userData') && x.userData.$layer === space);
    console.log('did i have userdata?',i);
    if(!i) return;
    console.log('db', i);
    let html = `
<h2>${i.userData.Date} - ${i.userData.Name}</h2>
<p>
${i.userData.Description}
</p>
${i.userData.link}
    `;

    defaultDiv.style.display = 'none';
    info.style.display = 'block';
    info.innerHTML = html;
}