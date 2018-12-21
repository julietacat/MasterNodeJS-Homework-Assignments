/*
*
* CHECHOUT ROUTE => post get put delete
*
*/

// Dependencies
var helpers = require('../helpers');
var _data = require('../data');

// Container
var checkout = {};

// Routes

// POST => validate the order and process payment
// Required data: orderID, name, token has to be valid
checkout.post = (data, callback) => {
    //check for the required data
    var _ = data.payload
    var orderID = typeof(_.orderID) == 'string' && _.orderID.trim().length == 20 ? _.orderID : false;
    var name = typeof(_.name) == 'string' && _.name.trim().length > 0 ? _.name : false 
    if (orderID && name) {
        // Verify that the user is logged in with the token
        var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;
        checkout.verifyToken(token,name, (tokenIsValid) => {
            if (tokenIsValid) {
                // look for the order 
                _data.read('orders', orderID, (err, orderObject) => {
                    if (!err && orderObject) {
                        if (!orderObject.has_payed) {
                            // If the order exisit verify that is to the logged in user
                        _data.read('users', name, (err, userObject) => {
                            if (!err && userObject) {
                                // make the payment
                                helpers.processPayment(orderObject,userObject,(err) => {
                                    if (!err) {
                                        // Change the value of the hasValue property to true
                                        
                                        orderObject.has_payed = true;
                                        _data.update('orders',orderID,orderObject, (err) => {
                                            if (!err) {
                                                helpers.sendPaymentEmailConfirmation(orderObject, userObject, (err) => {
                                                    if (!err) {
                                                        callback(200);
                                                    } else {
                                                        callback(400,{'Error':'Could not send the email'});
                                                    }
                                                });
                                            } else {
                                                callback(500,{'Error':'Could not update the data'});
                                            }
                                        });                                        
                                    } else {
                                        callback(400, {'error':'Could not process the payment'});
                                    }
                                }); 

                            } else {
                                callback(400,{'Error':'Could not find the user'});
                            }
                        });
                        } else {
                            callback(500,{'Error':'This order have already being processed'});
                        }
                        
                    } else {
                       callback(400,{'Error':'Could not find the order'});     
                    }
                });
            } else {
                callback(400,{'Error':'The token is not valid or missing'});
            }
        });
    } else {
        callback(400,{'Error':'Missing required fields'});
    }
};





// FUnctions
checkout.verifyToken = function (id, name, callback) {
    // Lookup the token
    _data.read('tokens', id, function (err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.name == name && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Export
module.exports = checkout;