var config = require("./config.js");
var SensiClient = require("sensi-client");

var log = function(message) {
    console.log(new Date().toString() + " [SensiMonitor] " + message);
};

log("Starting...");

var options = {
    username: config.sensiUsername || "",
    password: config.sensiPassword || "",
    verbose: config.verbose || false
};

var client = new SensiClient(options);

if (config.emailAlerts) {
    if (!config.emailAddressFrom) {
        log("ERROR! config.emailAddressFrom is not set! Email alerts will not be sent!");
    } else if (!config.emailAddressTo) {
        log("ERROR! config.emailAddressTo is not set! Email alerts will not be sent!");
    } else {
        var nodemailer = require("nodemailer");
        var sendmailTransport = require("nodemailer-sendmail-transport");
        var transporter = nodemailer.createTransport(sendmailTransport());
        
        if (config.verbose) {
            log(
                "Email alerts will be sent from " + 
                config.emailAddressFrom + 
                ", to " + 
                config.emailAddressTo
            );
        }
    }
}

var sendMail = function(subject, message) {
    if (!config.emailAlerts || !transporter) {
        return;
    }
    
    var email = {
        from: config.emailAddressFrom,
        to: config.emailAddressTo,
        subject: subject || "",
        message: message || ""
    };
    
    if (config.verbose) {
        log(email.subject);
    }
    
    transporter.sendMail(email, function(err, info) {
        if (err) {
            console.error(err);
        } else {
            if (config.verbose) {
                log("Email sent, details:");
                console.dir(info);
            }
        }
    });
};

var connect = function() {
    client.connect(function(err, thermostats) {
        if (err) {
            log("Encountered an error during connect:");
            console.error(err);
            process.exit(1);
        }
        
        if (!thermostats) {
            log("The Sensi API did not return any thermostats!");
            process.exit(2);
        }
        
        client.subscribe(thermostats[0].ICD, function(err) {
            if (err) {
                log("Encountered an error during subscribe:");
                console.error(err);
                process.exit(3);
            }
        });
    });
};

client.on("coolSetpointChanged", function(setpointChange) {
    sendMail(
        "Cool setpoint has changed from " +
        setpointChange.oldSetpoint + 
        " to " +
        setpointChange.newSetpoint
    );
});

client.on("heatSetpointChanged", function(setpointChange) {
    sendMail(
        "Heat setpoint has changed from " +
        setpointChange.oldSetpoint + 
        " to " + 
        setpointChange.newSetpoint
    );
});

client.on("runningModeChanged", function(modeChange) {
    sendMail(
        "Running mode has changed from " +
        modeChange.oldMode +
        " to " +
        modeChange.newMode
    );
});

client.on("systemModeChanged", function(modeChange) {
    sendMail(
        "System mode has changed from " +
        modeChange.oldMode +
        " to " +
        modeChange.newMode
    );
});

client.on("update", function(updateMessage) {
    if (config.verbose) {
        log("Thermostat update received"); 
    }
});

client.on("online", function(onlineMessage) {
    log("Thermostat is online");
});

client.on("offline", function(offlineMessage) {
    log("Thermostat is OFFLINE");
});

connect();
