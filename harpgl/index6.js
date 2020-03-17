const map = new harp.MapView({
    canvas: document.getElementById("map"),
    theme:
        "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json"
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
    }
});
map.addDataSource(omvDataSource);

/*
map.setCameraGeolocationAndZoom(
    new harp.GeoCoordinates(30.22, -92.02), 14 
);
*/

const options = { tilt: 45, distance: 3000 };
const coordinates = new harp.GeoCoordinates(30.22, -92.02);
let azimuth = 300;

map.addEventListener(harp.MapViewEventNames.Render, () => {
   map.lookAt(coordinates, options.distance, options.tilt, (azimuth += 0.1))
});
map.beginAnimation();