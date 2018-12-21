/*
*
* Primary file for the API
*
*/


// Dependencies
var server = require('./lib/server');


// Container
var app = {}


// Functions

// Init functions -> Start Server and Workers
app.init = () => {
    // Server init
    server.init();
    // TODO: Workers init
};

app.init();

// Export Module
module.exports = app;