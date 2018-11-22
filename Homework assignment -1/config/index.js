






// Container for all the environments
var environments = {};



// Staging (default) environment
environments.stagin = {
    httpPort : 3000,
    httpsPort: 3001,
    envName : 'stagin'
};



// Production environment
environments.production = {
    httpPort : 5000,
    httpsPort: 5001,
    envName : 'production'
};



// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof( process.env.NODE_ENV ) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.stagin;



// Export the module
module.exports = environmentToExport;
