
const mqtt = require('mqtt')
const { heartbeatHandler } = require('./heartbeat.service')
const { Op } = require('sequelize')
const { Terminal, CallLog } = require('../models')
const { rfidHandler } = require('./Rfid.service')
const { endCallHandler } = require('./end.call.service')
const { callStartHandler } = require('./call.start.service')
const { TerminalHandler } = require('./terminal.service')
const { runningCallHandler } = require('./running.call.service')
const { logTerminalEvent } = require('../utils/LogCreation')

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

client.on('message', async function (topic, message, packet, done,) {
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

    try {
        const terminal = await Terminal.findOne({
            where: { terminalId: incomingMessage.tid, },
            attributes: ["id", "terminalId", "lastPingAt"]
        });

        if (!terminal) {
            console.warn(`Terminal not found : ${incomingMessage.tid}`);
            return;
        }

        terminal.lastPingAt = new Date();
        await terminal.save();

        logTerminalEvent(terminal.id, "Terminal", incomingMessage.type, incomingMessage);

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

            case "CUPD":
                runningCallHandler(incomingMessage, client);
                break;

            case "CEND":
                endCallHandler(incomingMessage, client);
                break;

            case "TCMDACK":
                TerminalHandler(incomingMessage);
                break;

            default:
                console.log("Unknown packet type");
        }
    } catch (error) {
        console.error("MQTT Processing Error:", error);
    }
});

// client.subscribe('sseiot');

client.on('error', function (error) {
    console.log(error?.message);
});

client.on('disconnect', () => {
    console.log('MQTT client disconnected');
});

client.on('offline', (res) => {
    console.log('MQTT client offline', res);
});


// Terminal Block 
const blockTerminal = async (terminalId, id) => {
    try {
        const request = {
            type: "TCMD",
            tid: terminalId,
            allowed: false
        }
        logTerminalEvent(id, "Server", request.type, request);
        client.publish(terminalId, JSON.stringify(request), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);

    } catch (error) {
        console.error("Block Terminal Error :", error);
    }
}

const unblockTerminal = async (terminalId, id) => {
    try {
        const request = {
            type: "TCMD",
            tid: terminalId,
            allowed: true
        }
        logTerminalEvent(id, "Server", request.type, request);
        client.publish(terminalId, JSON.stringify(request), (err) => {
            if (err) {
                console.error('Error message:', err);
            }
        },);
    } catch (error) {
        console.error("Block Terminal Error :", error);
    }
}

// Check Not Closed Calls
const checkNotClosedCalls = async () => {
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

        const [updatedCount] = await CallLog.update(
            { status: 1 },
            { where: { status: 0, updatedAt: { [Op.lt]: threeMinutesAgo } } }
        );

    } catch (error) {
        console.error("Inactive Check Error :", error);
    }
};

// Inactive if not come the heartbeat message
const checkInactiveTerminals = async () => {
    try {
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

        const [updatedCount] = await Terminal.update(
            { status: "Offline" },
            { where: { status: "Active", lastPingAt: { [Op.lt]: threeMinutesAgo } } }
        );

    } catch (error) {
        console.error("Inactive Check Error :", error);
    }
};

// Run Every 1 Minute
setInterval(checkInactiveTerminals, 60 * 1000);

// Run Every 2 Minute
setInterval(checkNotClosedCalls, 2 * 60 * 1000);

// publish message 
// setInterval(() => {
//     const message = {
//         "type": "PING",
//         "tid": "05260100001",
//         "imei": "123456789012345",
//         "sim": "6345789548"

//     }
//     client.publish("sseiot", JSON.stringify(message), (err) => {
//         if (err) {
//             console.error('Error message:', err);
//         }
//     },);
// }, 5000);

module.exports = { client, blockTerminal, unblockTerminal };