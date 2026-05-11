
const mqtt = require('mqtt')
const { heartbeatHandler } = require('./heartbeat.service')
const { Op } = require('sequelize')
const { Terminal } = require('../models')
const { rfidHandler } = require('./Rfid.service')
const { endCallHandler } = require('./end.call.service')
const { callStartHandler } = require('./call.start.service')

const mqttPort = process.env.MQTT_PORT
const userName = process.env.MQTT_USER_NAME
const password = process.env.MQTT_PASSWORD

const client = mqtt.connect(mqttPort, {
    username: userName,
    password: password,
    clean: true, // Clean session flag 
    reconnectPeriod: 1000, // Reconnect if disconnected
    keepalive: 60, // Keep alive time in seconds
    rejectUnauthorized: true, // Reject unauthorized
})

client.on('connect', () => {
    console.log('MQTT client connected')
})

client.on('message', function (topic, message, packet, done,) {
    // console.log("dass", packet, message.toString())
    const incomingMessage = JSON.parse(message.toString());

    if (!topic === 'sseiot') {
        console.log("This is Other topic please check", topic)
    }

    switch (incomingMessage.type) {
        case "heartbeat":
            heartbeatHandler(incomingMessage, client);
            break;

        case "card_auth_request":
            rfidHandler(incomingMessage, client);
            break;

        case "call_start":
            callStartHandler(incomingMessage, client);
            break;

        case "call_end":
            endCallHandler(incomingMessage, client);
            break;

        default:
            console.log("Unknown packet type");
    }

});

client.subscribe('sseiot');

client.on('error', function (error) {
    console.log(error);
});

client.on('disconnect', () => {
    console.log('MQTT client disconnected');
});

client.on('offline', (res) => {
    console.log('MQTT client offline', res);
});


// Inactive if not come the heartbeat message
const checkInactiveTerminals = async () => {
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

        const [updatedCount] = await Terminal.update(
            { status: "Inactive" },
            { where: { status: "Active", lastPingAt: { [Op.lt]: threeMinutesAgo } } }
        );

    } catch (error) {
        console.error("Inactive Check Error :", error);
    }
};

// Run Every 1 Minute
setInterval(checkInactiveTerminals, 60 * 1000);


// publish message 
// setInterval(() => {
//     const message = {
//         "type": "heartbeat",
//         "data": {
//             "tid": "TRM1002",
//             "imei": "123456789012345",
//             "sim": "6345789548"
//         }
//     }
//     client.publish("sseiot", JSON.stringify(message), (err) => {
//         if (err) {
//             console.error('Error message:', err);
//         }
//     },);
// }, 5000);

module.exports = { client };