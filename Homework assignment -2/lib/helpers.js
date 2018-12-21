/*
*
* Helpers Functions
*
*/


// Dependencies
var config = require('./config');
var querystring = require('querystring');
var https = require('https');
var crypto = require('crypto');
var StringDecoder = require('string_decoder').StringDecoder;


// Container
var helpers = {};

// FUnctons
helpers.parseJSONToObject = (str) => {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};


// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        var str = '';
        for (i = 1; i <= strLength; i++) {
            // Get a random charactert from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the string
            str += randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
};

helpers.emailValidator = (email) => {
    // Validate the email format
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // If the email is writte in the correct format return true
    return re.test(String(email).toLowerCase());
};

helpers.processPayment = (order, user, callback) => {
    // validete parameters
    order = typeof (order) == 'object' ? order : false;
    user = typeof (user) == 'object' ? user : false;

    if (order && user) {

        // get the date correcty formatted
        var date = helpers.getFormattedDate();
        // configure the request payload        
        var payload = {
            'amount': order.total * 100,
            'currency': user.currency,
            'description': 'Food delivery on date: ' + date,
            'source': user.creditCardType
        }

        var payloadString = querystring.stringify(payload);

        // Request details
        var reqDetails = {
            'auth': config.stripe_api_key,
            'hostname': 'api.stripe.com',
            'method': 'POST',
            'timeout': 5 * 1000,
            'path': '/v1/charges'
        };

        // Instantiate the request object
         var req = https.request(reqDetails, (res) => {
            var status = res.statusCode;

            res.on('data', (d) => {
                if (res.statusCode == 200) {
                    callback(false);
                } else {
                    console.log(res.statusCode);
                    callback(true);
                }
            });
           

        });
        req.setHeader('Authorization', ('Bearer ' + config.stripe_api_key));
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', Buffer.byteLength(payloadString));

        // Bind to the error event so it doesn't get thrown
        req.on('error', function (e) {
            callback(e);
        });

        // Add the payload
        req.write(payloadString);

        // End the request

        req.end();

    } else {
        callback('Given parameters are missing or invald');
    }
}

helpers.sendPaymentEmailConfirmation = (orderObject, userObject, callback) => {
    var order = typeof (orderObject) == "object" && orderObject.has_payed == true ? orderObject : false;
    var user = typeof (userObject) == 'object' && userObject.name == orderObject.name ? userObject : false;

    // Verify that the user has payed and that correspond to the order
    if (order && user) {
        // Get date of receipt sent
        var date = helpers.getFormattedDate();

        // Configure the payload for the request
        var payload = {
            'from': '<julia@'+config.mailgun_domain+ '>',
            'to': config.validete_Email_recipient,
            'subject': 'Food delivery order: ' + order.id,
            'text': querystring.stringify(order)
        };
        console.log(payload);
        var payloadString = querystring.stringify(payload);

        // Request details
        var reqDetails = {
            'auth': 'api:'+ config.mailgun_api_key,
            'hostname': 'api.mailgun.net',
            'method': 'POST',
            'timeout': 5 * 1000,
            'path': '/v3/'+ config.mailgun_domain +'/messages'
        };
        console.log(reqDetails)
        // Instantiate the request object
        var req = https.request(reqDetails, (res) => {
            var decoder = new StringDecoder('utf-8');
            var buffer = ''
            res.on('data', (d) => {             
                console.log('on-data');   
                buffer += decoder.write(d);
                if (res.statusCode == 200) {
                    callback(false);//false
                } else {
                    callback(true);//true
                }
            });
            res.on('end', () => {
                console.log('end-data');
                buffer += decoder.end();
            }); 

        });

        //req.setHeader('Authorization', ('Bearer ' + config.mailgun_api_key));
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', Buffer.byteLength(payloadString));

        // Bind to the error event so it doesn't get thrown
        req.on('error', function (e) {
            callback(e);
        });

        // Add the payload
        req.write(payloadString);

        // End the request

        req.end();

    } else {
        callback(400, { 'Error': 'This order has not been processed yet or is not valid' });
    }
}

helpers.getFormattedDate = () => {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    return (curr_date + '/' + curr_month + '/' + curr_year);
}







// Export
module.exports = helpers;