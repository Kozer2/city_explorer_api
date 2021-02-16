'use strict'
console.log('Server.js is connected');
require('dotenv').config(); // required for dot env file

const express = require('express');


const PORT = process.env.PORT || 3115;
console.log(`The port is: ${PORT}`);
const cors = require('cors');
const app = express();

// app.use(express.static('./public'));
app.use(cors());
app.get('/', (request, response)=> {
    response.send('You are on the homepage.');
});

// location path
app.get('/location', (request, response) => { 
    let search_query = request.query.city;
    let locationData = require('./data/location.json');
    let returnObject = {
        search_query: search_query,
        formatted_query: locationData[0].display_name,
        latitude: locationData[0].lat,
        longitude: locationData[0].lon
    }
    response.status(200).send(returnObject);
    // const theDataObjFromJson = theDataArrayFromTheLocationJson[0];
    // // console.log(request.query, response.query);
    // const searchedCity = request.query.city;
    // let newLocation = new Location(searchedCity,
    //     theDataObjFromJson);
    // response.send(newLocation);
    
}); //.catch(error => {
    //response.status(500).send('Location lookup failed')
//});

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
}); //.catch(error => {
    //response.status(500).send('Weather lookup failed')
//});
 
app.use('*', (request,response)=> response.send("Route does not exist.")); // Needs to come after all other app gets 


// location constructor
function Location(object) {
    this.searchQuery = object.searchQuery;
    this.formattedQuery = object.display_name;
    this.latitude = object.lat;
    this.longitude = object.lon;
}

// weather constructor
function Weather(weather, valid_date) {
    this.weather = weather;
    this.valid_date = valid_date;
}
// data.weather.description

// function to catch errors

app.listen(PORT,() => console.log(`Listening on port ${PORT}`)); // needs to be below the app.use('*')