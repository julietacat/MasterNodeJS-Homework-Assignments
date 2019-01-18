/*

Handlers

*/

// Dependencies

var _users = require('./handlers/users');
var _tokens = require('./handlers/tokens');
var _menu = require('./handlers/menu');
var _orders = require('./handlers/orders');
var _checkout = require('./handlers/checkout');

// Container
var handlers = {};

// Handlers

// NOT FOUND
handlers.notFound = (data, callback) => {
  callback(404, { data });
};


// Users
handlers.users = (data, callback) => {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Token 
handlers.tokens = (data, callback) => {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Menu
handlers.menu = (data, callback) => {
  var acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _menu[data.method](data, callback);
  } else {
    callback(405);
  }  
};

// Orders
handlers.orders = (data, callback) => {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _orders[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Checkout
handlers.checkout = (data, callback) => {
  var acceptableMethods = ['post','get','put','delete'];
  if (acceptableMethods.indexOf(data.method) > -1 ) {
    _checkout[data.method](data,callback);
  } else {
    callback(405);
  }
}


// Exports
module.exports = handlers;
