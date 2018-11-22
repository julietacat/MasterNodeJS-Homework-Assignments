/*
The Assignment:
Please create a simple "Hello World" API. Meaning:
1. It should be a RESTful JSON API that listens on a port of your choice. 
2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 

Author: Julia Kraeva
*/





// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require( './config' ); 
var fs = require('fs');




// Instantiating the http server
var httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log(`The server listening on the port ${config.httpPort} now`);
});





// Instantiating the https server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};

 
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});



// Start the server, and have it to listern on port 3000
httpsServer.listen(config.httpsPort, () => {
    console.log(`The server listening on the port ${config.httpsPort} now`);
});




// All the server logic 
var unifiedServer = function (req, res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true)

    // Get the path
    var path = parsedUrl.pathname
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object
    var queryStringObject = parsedUrl.query

    // Get the HTTP method
    var method = req.method.toLocaleLowerCase();

    // Get the headers as an object
    var headers = req.headers

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data', function (data) {
        buffer += decoder.write(data) // when data streams in this data is decoded append buffer
    })

    req.on('end', function () {
        buffer += decoder.end()

        // Choose the handler this request should go to. If one is not found use the not found handler
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        //Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handler specified in the route
        chosenHandler(data, function (statusCode, payload) {

            // Use the status code called back by the handler, or default 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {}

            // Conver the payload to a string
            var payLoadString = JSON.stringify(payload)

            // Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payLoadString)

            console.log('(OUTCOMING) Returning response: ', statusCode, payLoadString)
        })


        // Log the request path
        console.log('(INCOMING) Request received on path: ' + trimmedPath)
        console.log('method: ' + method)
        console.log('query string parameters: ', queryStringObject)
        console.log('headers: ', headers)
        console.log('payload: ', buffer)
    })
}


// Define the handlers
var handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
    callback(200);  
};


// Hello handler
handlers.hello = ((data, callback) => {
    callback(200, {
        'message': 'My HomeWork 1!'
    });
});

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Defining Router
var router = {
  'hello': handlers.hello,
  'ping': handlers.ping
}
