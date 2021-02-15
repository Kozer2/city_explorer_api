'use strict'
console.log('Server.js is connected');


const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3111;
console.log(`The port is: ${PORT}`);

app.use(express.static('./public'));
app.use(cors());
app.get('/', (request, response)=> {
    response.send('You are on the homepage.');
});

app.use('*', (request,response)=> response.send("Route does not exist."));
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

app.get('/location', (request, response) => { 
    const theDataArrayFromTheLocationJson = require('./data.location.json');
    const theDataObjFromJson = theDataArrayFromTheLocationJson[0];
    console.log(request.query, response.query);
    const searchedCity = request.query.city;

    const newLocation = new Location(searchedCity, 
        theDataObjFromJson.display_name, 
        theDataObjFromJson.lat, 
        theDataObjFromJson.lon);

    response.send(newLocation);
});


// location constructor
function Location(city, displayName, lat, lon) {
    this.city = city;
    this.displayName = displayName;
    this.lat = parseFloat(lat);
    this.lon = parseFloat(lon);
}

// weather constructor
// function Location(city, displayName, lat, lon) {
//     this.city = city;
//     this.displayName = displayName;
//     this.lat = parseFloat(lat);
//     this.lon = parseFloat(lon);
// }