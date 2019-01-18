/*

 USERS (POST GET PUT DELETE)

*/


// Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var config = require('../config');

// Container
var users = {};



// Methods
// Accepted: POST, GET, PUT, DELETE


// Post
// Required Data: name, email, address, creditcard, currency, password
// Optional: none
users.post = (data, callback) => {
    // Check all the required field
    var _ = data.payload;

    var name = typeof (_.name) == 'string' && _.name.trim().length > 0 ? _.name.trim() : false;
    var email = typeof (_.email) == 'string' && helpers.emailValidator(_.email) ? _.email.trim() : false;
    var password = typeof (_.password) == 'string' && _.password.trim().length > 0 ? _.password : false;
    var address = typeof (_.address) == 'string' && _.address.trim().length > 0 ? _.address.trim() : false;
    var currency = typeof (_.currency) == 'string' && config.acceptedCurrencies.indexOf(_.currency) > -1 ? _.currency : false;
    var creditCard = typeof (_.creditCard) == 'string' && config.acceptedCreditCards.indexOf(_.creditCard) > -1 ? 'tok_' + _.creditCard : false;

    // If all the required field are valid continue
    if (name && email && address && currency && creditCard) {
        // Make sure the user does not already exisit
        _data.read('users', name, (err, data) => {
            if (err) {
                // Hash the psw
                var hashedPsw = helpers.hash(password);

                if (hashedPsw) {
                    // Create the user object
                    var userObject = {
                        'name': name,
                        'email': email,
                        'password': hashedPsw,
                        'address': address,
                        "orders": [],
                        "currency": currency,
                        "creditCardType": creditCard
                    };

                    // Store the user object
                    _data.create('users', name, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'The user could not be created' });
                        }
                    });

                } else {
                    callback(400, { 'Error': 'Could not hash the psw' });
                }

            } else {
                callback(400, { 'Error': 'A user with that name already exisit' });
            }
        });

    } else {
        callback(400, { 'Error': 'Missing required field' })
    }




};

// Get
// Required Data: name, email
// Optional: none
// Verify that the user is logged in with token
users.get = (data, callback) => {
    // Check all the required field
    var _ = data.queryStringObject;

    var name = typeof (_.name) == 'string' && _.name.trim().length > 0 ? _.name.trim() : false;
    var email = typeof (_.email) == 'string' && helpers.emailValidator(_.email) ? _.email.trim() : false;
    if (name && email) {
        // Check if the re is a token and is valid
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        users.verifyToken(token, name, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('users', name, (err, userData) => {
                    if (!err && userData) {
                        // Delete the hashed psw from the user before returning to the user
                        delete data.hashedPsw;
                        callback(200, userData);
                    } else {
                        callback(404, { 'Error': 'Page not found' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Missing or expired token' });
            }
        });
        // If there is a valid token contiue

    } else {
        callback(404, { 'Error': 'Required field missing or incorrect' });
    }

};

// Put -> CHange email or address
// Required Data: name
// optional: address
// Verify that the user is logged in with token
users.put = (data, callback) => {
    // Check all the required field
    var _ = data.payload;
    var name = typeof (_.name) == 'string' && _.name.trim().length > 0 ? _.name.trim() : false;
    var email = typeof (_.email) == 'string' && helpers.emailValidator(_.email) ? _.email.trim() : false;
    // Check optional data
    var address = typeof (_.address) == 'string' && _.address.trim().length > 0 ? _.address.trim() : false;
    var password = typeof (_.password) == 'string' && _.password.trim().length > 0 ? _.password : false;
    var currency = typeof (_.currency) == 'string' && config.acceptedCurrencies.indexOf(_.currency) > -1 ? _.currency : false;
    var creditCard = typeof (_.creditCard) == 'string' && config.acceptedCreditCards.indexOf(_.creditCard) > -1 ? 'tok_' + _.creditCard : false;

    if (name) {
        // Check if there is at least one optional data
        if (email || address || password || currency || creditCard) {
            // Check the token and if it is valid
            var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
            users.verifyToken(token, name, (tokenIsValid) => {
                if (tokenIsValid) {
                    _data.read('users', name, (err, userData) => {
                        if (!err && userData) {
                            // If there is any optional data update the user object
                            if (email) {
                                userData.email = email
                            }
                            if (address) {
                                userData.address = address;
                            }
                            if (password) {
                                userData.hashedPsw = helpers.hash(password);
                            }
                            if (currency) {
                                userData.currency = currency;
                            }
                            if (creditCard) {
                                userData.creditCardType = creditCard
                            }

                            // Update the user file
                            _data.update('users', name, userData, (err) => {
                                if (!err) {
                                    callback(200, userData);
                                } else {
                                    callback(500, { 'error': 'Could not write the new data' });
                                }
                            });
                        } else {
                            callback(400, { 'Error': 'We could not find the urequested user' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'The Session is expired' });
                }
            });


        } else {
            callback(400, { 'Error': 'You need at least one fiedl to update' });
        }

    } else {
        callback(400, { 'Error': 'Missing or incorrect required fields' });
    }

};

// Delete
// Required Data: name, email
// optional: none
users.delete = (data, callback) => {
    // Check all the required field
    var _ = data.queryStringObject;
    var name = typeof (_.name) == 'string' && _.name.trim().length > 0 ? _.name.trim() : false;
    var email = typeof (_.email) == 'string' && helpers.emailValidator(_.email) ? _.email.trim() : false;

    // get the token
    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
    users.verifyToken(token, name, (tokenIsValid) => {
        if (tokenIsValid) {
            _data.read('users', name, (err, userData) => {
                if (!err && userData) {
                    _data.delete('users', name, (err) => {
                        if (!err) {
                            callback(200, { 'Deletion': 'User have been deleted' });
                        } else {
                            callback(500, { 'Error': 'Could not delete the user' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Could not find the user' });
                }
            });
        } else {
            callback(400, { 'Error': 'Token expired or invalid' });
        }
    });
};


// Functions
// Verify if a given token id is currently valid for a given user
users.verifyToken = function (id, name, callback) {
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

// Exports
module.exports = users;
