var mqtt = require('mqtt');
var { getIo } = require('./socketio');

module.exports = (client) => {
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
    client.subscribe('/+/thermistor/#', function (err) {
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
    let value = message.toString();
    if(topic.includes('/gps/') || topic.includes('/thermistor/temperature') || topic.includes('/adxl345/')) {
      try {
        value = bytesToFloat(message);
        console.log(`Received message: ${value} on topic: ${topic}`);
      } catch (error) {
        console.error(`Error processing message on topic ${topic}: ${error.message}`);
      }
    }
    else if(topic.includes('/max30102/')) {
      try {
        value = bytesToInt(message);
        console.log(`Received message: ${value} on topic: ${topic}`);
      } catch (error) {
        console.error(`Error processing message on topic ${topic}: ${error.message}`);
      }
    }

    const io = getIo();
    for (let [id, socket] of io.of('/').sockets) {
      if (socket.deviceId === topic.split('/')[1]) {
        socket.emit("mqttdata", {topic, value});
      }
    }
  });
}