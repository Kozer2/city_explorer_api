'use strict'
console.log('Server.js is connected');


const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3111;
console.log(`The port is: ${PORT}`);







function Location(city, displayName, lat, lon) {
    this.city = city;
    this.displayName = displayName;
    this.lat = parseFloat(lat);
    this.lon = parseFloat(lon);
}