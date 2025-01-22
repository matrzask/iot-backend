var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt:localhost:1883');

client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe('/info/connect', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
  client.subscribe('/gps/#', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});