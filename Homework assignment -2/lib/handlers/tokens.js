/*

TOKENS HANDLER (POST GET PUT DELETE)

*/


// Dependencies
var _data = require('../data');
var helpers = require('../helpers');


// Container
var tokens = {};



// Methods
// Accepted: POST, GET, PUT, DELETE


// Post
// Required Data: name, email
// Optional: none
tokens.post = (data, callback) => {
    // Data check
    var _ = data.payload;
    var name = typeof (_.name) == 'string' && _.name.trim().length > 0 ? _.name.trim() : false;
    var email = typeof (_.email) == 'string' && helpers.emailValidator(_.email) ? _.email.trim() : false;
    var password = typeof (_.password) == 'string' && _.password.trim().length > 0 ? _.password : false;


    // If name and email are valid
    if (password && email && name) {
        // look for the user that matches the name
        _data.read('users', name, (err, userData) => {
            if (!err && userData) {
                // Check if the hashed psw correspond to the one in the user object
                var hashedPsw = helpers.hash(password);
                if (hashedPsw == userData.password) {

                    var tokenID = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60; // Tokens expires in 1 hour
                    // Build the token object
                    var tokenObject = {
                        'name': name,
                        'id': tokenID,
                        'expires': expires
                    }
                    // Store the token
                    _data.create('tokens', tokenID, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(400, { 'Error': 'Could not write the data' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Password not correct for the specified user' });
                }

            } else {
                callback(400, { 'Error': 'Couldnt find the user' });
            }
        });
    }

};

// Get
// Required Data: id
// Optional: none
tokens.get = (data, callback) => {
    // Check for requried data
    var _ = data.queryStringObject
    var id = typeof (_.id) == 'string' && _.id.trim().length == 20 ? _.id : false;

    // If the id exist
    if (id) {
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(400, { 'Error': 'Could not find the token ID' });
            }
        });
    } else {
        callback(400, { 'Error': 'Required field missing or incomplete' });
    }

};

// Put => Extend the token expiration time
// Required Data: id, extend
// optional: none
tokens.put = (data, callback) => {
    // Check for requried data
    var _ = data.payload
    var id = typeof (_.id) == 'string' && _.id.trim().length == 20 ? _.id : false;
    var extend = typeof (_.extend) == 'boolean' && _.extend == true ? true : false;
    console.log(id, extend);
    if (id && extend) {
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    // update the token data with the new expiring date
                    _data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not extend token expiration date' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'The token cnnot be extended' });
                }
            } else {
                callback(400, { 'Error': 'The specified token doesnt exist' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing or invalid required field' });
    }


};

// Delete
// Required Data: id
// optional: none
tokens.delete = (data, callback) => {
    // Check for requried data
    var _ = data.queryStringObject;
    var id = typeof (_.id) == 'string' && _.id.trim().length == 20 ? _.id : false;

    if (id) {
        // Look for the token in the directory
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // delete the token
                _data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(400, { 'Error': 'Could not delete the tokend' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Could not find ths pecified token' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};


// Functions
tokens.emailValidator = (email) => {
    // Validate the email format
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // If the email is writte in the correct format return true
    return re.test(String(email).toLowerCase());
}

// Exports
module.exports = tokens;
