/*
*
* MENU (GET)
*
*/


// Accept dependencies
var _data = require('../data');

// Container
var menu = {};


// MEthods
// GET
// Required name, email, valid token
// optional: none
menu.get = (data, callback) => {
    // Check required data
    var _ = data.queryStringObject;
    // Validate the email format
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var name = typeof(_.name) == 'string' && _.name.trim().length > 0 ? _.name : false;
    var email = typeof(_.email) == 'string' && re.test(String(_.email).toLowerCase()) ? _.email : false;
    console.log(name,email);
    // If name and email are corect
    if (name && email) {
        // look for the user if the token is valid
        var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;
        menu.verifyToken(token,name, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('users', name, (err, userData) => {
                    if (!err && userData) {
                        // TODO: Get the menu
                        _data.read('menu','menu', (err, menuData) => {
                            if (!err) {
                                callback(200, menuData);
                            } else {
                                callback(400,{'Error':'Could not get hte menu'});
                            }
                        });
                    } else {
                        callback(400,{'Error':'Could not find the user'});
                    }
                });
            }else {
                callback(400,{'Error':'Session is expired or token not correct'});
            }
        });

    } else {
        callback(400,{'Error':'Missing required field(s)'});
    }


};

// Functions
// Verify if a given token id is currently valid for a given user
menu.verifyToken = function(id,name,callback){
    // Lookup the token
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        // Check that the token is for the given user and has not expired
        if(tokenData.name == name && tokenData.expires > Date.now()){
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
module.exports = menu;
