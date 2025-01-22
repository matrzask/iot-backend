var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt:localhost:1883');

function bytesToFloat(bytes) {
    if (bytes.length !== 4) {
        throw new Error('Invalid byte length for float conversion');
      }
    var buffer = Buffer.from(bytes);
    return buffer.readFloatLE(0);
  }

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
  if(topic.startsWith('/gps/')) {
    try {
      let value = bytesToFloat(message);
      console.log(`Received message: ${value} on topic: ${topic}`);
    } catch (error) {
      console.error(`Error processing message on topic ${topic}: ${error.message}`);
    }
  }
  else {
    console.log(`Received message: ${message.toString()} on topic: ${topic}`);
  }
});