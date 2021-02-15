'use strict'
console.log('Server.js is connected');
require('dotenv').config(); // required for dot env file

const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3115;
console.log(`The port is: ${PORT}`);

app.use(express.static('./public'));
app.use(cors());
app.get('/', (request, response)=> {
    response.send('You are on the homepage.');
});

// location path
app.get('/location', (request, response) => { 
    const theDataArrayFromTheLocationJson = require('./data/location.json');
    const theDataObjFromJson = theDataArrayFromTheLocationJson[0];
    // console.log(request.query, response.query);
    const searchedCity = request.query.city;

    const newLocation = new Location(searchedCity, 
        theDataObjFromJson.display_name, 
        theDataObjFromJson.lat, 
        theDataObjFromJson.lon);

    response.send(newLocation);
});

// weather path
app.get('/weather', (request, response) => { 
    const theDataArrayFromTheWeatherJson = require('./data/weather.json');
    const theDataObjFromJson = theDataArrayFromTheWeatherJson.data[0];
    // console.log(request.query, response.query);
    // const searchedCity = request.query.city;

    const newWeather = new Weather( 
        theDataObjFromJson.weather.description, 
        theDataObjFromJson.valid_date);

    response.send(newWeather);
});
 
app.use('*', (request,response)=> response.send("Route does not exist.")); // Needs to come after all other app gets 
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); // needs to be below the app.use('*')

// location constructor
function Location(city, displayName, lat, lon) {
    this.city = city;
    this.displayName = displayName;
    this.lat = parseFloat(lat);
    this.lon = parseFloat(lon);
}

// weather constructor
function Weather(weather, valid_date) {
    this.weather = weather;
    this.valid_date = valid_date;
}

// data.weather.description