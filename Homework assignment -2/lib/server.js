/*
*
* Server tasks
*
*/


// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./config');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var helpers = require('./helpers');
var util = require('util');
var path = require('path');
var debug = util.debuglog('server');
var handlers = require('./handlers');


// Container
var server = {}

// Instantiate the http servers
server.httpServer = http.createServer((req, res) => {
    server.unifiedServers(req, res);
});

// Instantiate the https servers

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServers(req, res);
});



// Build the logic for both http and https 

// Functions

// Both http and https server logic
server .unifiedServers = (req, res) => {
    // Grab the url of the request
    var parsedUrl = url.parse(req.url, true);

    // Get the path to be sent to the router
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Geth the method
    var method = req.method.toLowerCase();

    // Get the header as an object
    var headers = req.headers;

    // Get the payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    // Process the end of the request
    req.on('end', () => {
        buffer += decoder.end();

        // Check the router for the right path handler otherwise redirect to the notFound route
        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
        // Construct the data object
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJSONToObject(buffer)
        }

        chosenHandler(data, (statusCode, payload) => {
            // Use the status code returned from the handlers 
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            console.log(statusCode);

            // use the payload returned from the handler and convert it to a string
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
         if(statusCode == 200){
            debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
          } else {
            debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
          }

        });


    });

};

// Routes
server.router = {
    'users': handlers.users,
    'tokens': handlers.tokens,
    'menu': handlers.menu,
    'orders': handlers.orders,
    'checkout': handlers.checkout
}

// => INIT functions to listen to the servers
server.init = () => {
    // Start the http server
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[36m%s\x1b[0m','The HTTP server is listening to port: ', config.httpPort);
    });

    // Start the https server
    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[36m%s\x1b[0m','The HTTPS server is listening to port: ', config.httpsPort);
    });
};



// Export Module
module.exports = server;