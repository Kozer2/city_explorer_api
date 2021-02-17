'use strict'
console.log('Server.js is connected');
require('dotenv').config(); // required for dot env file

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');


const PORT = process.env.PORT || 3115;
console.log(`The port is: ${PORT}`);
const app = express();

// app.use(express.static('./public'));
app.use(cors());
app.get('/', (request, response)=> {
    response.send('You are on the homepage.');
});

// location path
app.get('/location', (request, response) => { 
    let city = request.query.city;
    let locationKey = process.env.LOCATION_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`
    superagent.get(url)
        .then(saResults => {
            let responseObj = new Location(saResults.body[0]);
            response.status(200).send(responseObj);
        })
    
        .catch((error) => {
            response.status(500).send('Location lookup failed', error);
        })
});

// weather path
app.get('/weather', (request, response) => { 
    const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    // console.log("request query", request.query.latitude);
    const lat = parseFloat(request.query.latitude);
    const lon = parseFloat(request.query.longitude);
    let weatherArr = [];
    let city = request.query.search_query;
    const queryParams = {
        key: process.env.WEATHER_KEY,
        city: city,
        lang: 'en',
        days: 5
    };
    // console.log("request query", lat, lon);
    return superagent.get(url)
        .query(queryParams)
        .then(weatherInfo => {
            weatherInfo.body.data.forEach(day => {
                weatherArr.push(new Weather(day));
            })
            console.log("Daily weather", weatherArr);
            response.status(200).send(weatherArr);
        });
    // console.log(superagent);
}); 
 



// location constructor
function Location(object) {
    this.search_query = object.searchQuery;
    this.formattedQuery = object.display_name;
    this.latitude = object.lat;
    this.longitude = object.lon;
}

// weather constructor
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
}
// data.weather.description

// function to catch errors
app.use('*', (request,response)=> response.send("Route does not exist.")); // Needs to come after all other app gets 
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); // needs to be below the app.use('*')