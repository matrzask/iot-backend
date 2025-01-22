var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt:localhost:1883');

function bytesToFloat(bytes) {
  if (bytes.length !== 4) {
      throw new Error('Invalid byte length for float conversion');
  }
  var buffer = Buffer.from(bytes);
  return buffer.readFloatLE(0);
}

function bytesToInt(bytes) {
  var buffer = Buffer.from(bytes);
  if (bytes.length == 4) {
    return buffer.readInt32LE(0);
  }
  else if (bytes.length == 2) {
    return buffer.readInt16LE(0);
  }
  else {
    throw new Error('Invalid byte length for int conversion');
  }
}

client.on('connect', function () {
  console.log('Connected to MQTT broker');
  client.subscribe('/+/gps/#', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
  client.subscribe('/+/termistor/#', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
  client.subscribe('/+/max30102/#', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
  client.subscribe('/+/adxl345/#', function (err) {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  if(topic.includes('/gps/') || topic.includes('/termistor/temperature')) {
    try {
      let value = bytesToFloat(message);
      console.log(`Received message: ${value} on topic: ${topic}`);
    } catch (error) {
      console.error(`Error processing message on topic ${topic}: ${error.message}`);
    }
  }
  else if(topic.includes('/max30102/') || topic.includes('/adxl345/')) {
    try {
      let value = bytesToInt(message);
      console.log(`Received message: ${value} on topic: ${topic}`);
    } catch (error) {
      console.error(`Error processing message on topic ${topic}: ${error.message}`);
    }
  }
  else {
    console.log(`Received message: ${message.toString()} on topic: ${topic}`);
  }
});