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

map.setCameraGeolocationAndZoom(
	new harp.GeoCoordinates(39.82, -98.56), 5
);

fetch('cats.geojson')
.then(data => data.json())
.then(data => {
   const geoJsonDataProvider = new harp.GeoJsonDataProvider("wireless-hotspots", data);
   const geoJsonDataSource = new harp.OmvDataSource({
      dataProvider: geoJsonDataProvider,
      name: "this is not necessary for this"
   });

    map.addDataSource(geoJsonDataSource).then(() => {
        const styles = [{
            when: "$geometryType == 'point'",
            technique: "circles",
            renderOrder: 10000,
            attr: {
                color: "#7ED321",
                size: 20
            }
        }]
        geoJsonDataSource.setStyleSet(styles);
        map.update();
    });

})