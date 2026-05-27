
const mqtt = require('mqtt')
const { heartbeatHandler } = require('./heartbeat.service')
const { Op } = require('sequelize')
const { Terminal } = require('../models')
const { rfidHandler } = require('./Rfid.service')
const { endCallHandler } = require('./end.call.service')
const { callStartHandler } = require('./call.start.service')
const { blockTerminalHandler, unblockTerminalHandler } = require('./terminal.service')

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
    let incomingMessage;
    try {
        console.log("sseiot message", message.toString())
        incomingMessage = JSON.parse(message.toString());
    } catch (err) {
        console.error("Invalid JSON:", message.toString());
        return; // stop only this message
    }

    if (!topic === 'sseiot') {
        console.log("This is Other topic please check", topic)
    }

    switch (incomingMessage.type) {
        case "PING":
            heartbeatHandler(incomingMessage, client);
            break;

        case "CARQ":
            rfidHandler(incomingMessage, client);
            break;

        case "CSTAT":
            callStartHandler(incomingMessage, client);
            break;

        case "CEND":
            endCallHandler(incomingMessage, client);
            break;

        case "CUPD":
            blockTerminalHandler(incomingMessage);
            break;

        case "CUPDACK":
            unblockTerminalHandler(incomingMessage);
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


// Terminal Block 
const blockTerminal = async (terminalId) => {
    try {
        const request = {
            type: "termina_block",
            data: {
                tid: terminalId
            }
        }
        client.publish(terminalId, JSON.stringify(request), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);

    } catch (error) {
        console.error("Block Terminal Error :", error);
    }
}

const unblockTerminal = async (terminalId) => {
    try {
        const request = {
            type: "termina_release",
            data: {
                tid: terminalId
            }
        }

        client.publish(terminalId, JSON.stringify(request), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);
    } catch (error) {
        console.error("Block Terminal Error :", error);
    }
}

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

module.exports = { client, blockTerminal, unblockTerminal };