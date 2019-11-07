require('dotenv').config();

const HERE_APP_ID = process.env.HERE_APP_ID;
const HERE_APP_CODE = process.env.HERE_APP_CODE;

const fetch = require('node-fetch');

// test observation
/*
fetch(`https://weather.api.here.com/weather/1.0/report.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&product=observation&name=Lafayette,LA&metric=false`)
.then(res => res.json())
.then(res => {
	console.log('Observation:', res.observations.location[0]);
	console.log('---------------------------------------');
});

// test forecast_7days, returns 3 items per day
fetch(`https://weather.api.here.com/weather/1.0/report.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&product=forecast_7days&name=Lafayette,LA&metric=false`)
.then(res => res.json())
.then(res => {
	console.log('Forcast (7 Days):', res.forecasts.forecastLocation);
	console.log('---------------------------------------');
});

// test forecast_7days_simple
fetch(`https://weather.api.here.com/weather/1.0/report.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&product=forecast_7days_simple&name=Lafayette,LA&metric=false`)
.then(res => res.json())
.then(res => {
	console.log('Forcast (7 Days Simple):', res.dailyForecasts.forecastLocation);
	console.log('---------------------------------------');
});
*/
