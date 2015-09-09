var config = {
    dataLogging: true,
    dataLoggingConnectionString: "sensi",
    dataLoggingCollectionName: "readings",
    
    emailAlerts: true,
    emailAddressTo: process.env.SENSI_MONITOR_EMAIL_TO,
    emailAddressFrom: process.env.SENSI_MONITOR_EMAIL_FROM,
    
    sensiUsername: process.env.SENSI_USERNAME,
    sensiPassword: process.env.SENSI_PASSWORD,

    verbose: true
};

module.exports = config;