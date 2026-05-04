
const mqtt = require('mqtt')

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
    console.log('Received message:', topic, message.toString());
});

client.subscribe('SSE');

// publish message 
// setInterval(() => {
//     const message = `Current time: ${new Date().toLocaleTimeString()}`;
//     client.publish("SSE", message, (err) => {
//         if (err) {
//             console.error('Error message:', err);
//         }
//     },);
// }, 5000);

client.on('error', function (error) {
    console.log(error);
});

client.on('disconnect', () => {
    console.log('MQTT client disconnected');
});

client.on('offline', (res) => {
    console.log('MQTT client offline', res);
});


module.exports = { client };