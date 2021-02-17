'use strict'
console.log('Server.js is connected');
require('dotenv').config(); // required for dot env file

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');
const app = express();


// Application setup
const PORT = process.env.PORT || 3111 || 3112 || 3113 || 3114

console.log(`The port is: ${PORT}`);


// app.use(express.static('./public'));
app.use(cors());

//app.get('/', (request, response)=> {
//     response.send('You are on the homepage.');
// });


// location path
app.get('/location', (request, response) => { 
    let city = request.query.city;
    const locationKey = process.env.LOCATION_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`
    superagent.get(url)
        .then(saResults => {
            let responseObj = new Location(city, saResults.body[0]);
            response.status(200).send(responseObj);
            // console.log("Location info", responseObj);
        })
        .catch((error) => {
            response.status(500).send('Location lookup failed', error);
        })
});

// weather path
app.get('/weather', (request, response) => { 
    const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
    let city = request.query.search_query;
    // console.log("request query", request.query.latitude);
    const lat = parseFloat(request.query.latitude);
    const lon = parseFloat(request.query.longitude);
    let weatherArr = [];
    
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
            // console.log("Daily weather", weatherArr);
            response.status(200).send(weatherArr);
        })
        .catch((error) => {
            response.status(500).send('Weather lookup failed', error);
        });
    // console.log(superagent);
}); // end app weather

app.get(('/parks'), (request, response) =>{
    const parksKey = process.env.PARKS_KEY;
    const location = request.query.search_query;
    const url = `https://developer.nps.gov/api/v1/parks?q=${location}&api_key=${parksKey}`;
    const queryParams = {
        q: location,
        api_key: parksKey,
        limit: 10
    };
    let parksArr= [];
    superagent.get(url)
    .query(queryParams)
    .then(saResult => {
        saResult.body.data.forEach(park =>{
            parksArr.push(new Parks(park))
        })
        response.status(200).send(parksArr);
        // console.log(saResult.body.data);
    })
})



// location constructor
function Location(searchQuery, object) {
    this.search_query = searchQuery;
    this.formattedQuery = object.display_name;
    this.latitude = object.lat;
    this.longitude = object.lon;
}

// weather constructor
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.valid_date;
}

function Parks(parkObj){
    this.name = parkObj.fullName;
    this.address = parkObj.addresses[0];
    this.fee = parkObj.entranceFees.cost;
    this.description = parkObj.description;
    this.url = parkObj.url;
}


// function to catch errors
app.use('*', (request,response)=> response.send("Route does not exist.")); // Needs to come after all other app gets 
app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); // needs to be below the app.use('*')