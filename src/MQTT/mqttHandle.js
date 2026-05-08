
const mqtt = require('mqtt')
const { heartbeatHandler } = require('./heartbeat.service')

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
    console.log("dass",packet,message.toString())
    const incomingMessage = JSON.parse(message.toString());
    
    if (incomingMessage.type === 'heartbeat') {
        // heartbeatHandler(incomingMessage, client);
    }
    if (incomingMessage.type === 'card_auth_request') {
        console.log("Rfid Card Request", incomingMessage.data)
    }
    if (incomingMessage.type === 'call_start') {
        console.log("Call Start Event", incomingMessage.data)
    }
    if (incomingMessage.type === 'call_end') {
        console.log("Call End Event", incomingMessage.data)
    }
});

client.subscribe('SSE');
client.subscribe('SSEE');

client.on('error', function (error) {
    console.log(error);
});

client.on('disconnect', () => {
    console.log('MQTT client disconnected');
});

client.on('offline', (res) => {
    console.log('MQTT client offline', res);
});


// publish message 
// setInterval(() => {
//     const message = {
//         "type": "heartbeat",
//         "data": {
//             "tid": 35178,
//             "imei": "123456789012345",
//             "sim": "6345789548"
//         }
//     }
//     client.publish("SSE", JSON.stringify(message), (err) => {
//         if (err) {
//             console.error('Error message:', err);
//         }
//     },);
// }, 5000);

module.exports = { client };