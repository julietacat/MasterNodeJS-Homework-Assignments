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

// Init functions  Start Server 
app.init = () => {
    // Server init
    server.init();
   
};

app.init();

// Export Module
module.exports = app;
