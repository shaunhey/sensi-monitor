var config = {
    dataLogging: true,
    dataLoggingConnectionString: process.env.SENSI_MONITOR_MONGO_CONNECTION_STRING,
    dataLoggingCollectionName: process.env.SENSI_MONITOR_MONGO_COLLECTION,
    
    emailAlerts: true,
    emailAddressTo: process.env.SENSI_MONITOR_EMAIL_TO,
    emailAddressFrom: process.env.SENSI_MONITOR_EMAIL_FROM,
    
    emailAlertOnRunningModeChanged: false,
    emailAlertOnSystemModeChanged: true,
    emailAlertOnSetpointChanged: true,
    
    sensiUsername: process.env.SENSI_USERNAME,
    sensiPassword: process.env.SENSI_PASSWORD,

    verbose: true
};

module.exports = config;