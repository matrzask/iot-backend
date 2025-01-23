require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var connectDB = require('./config/db');
var http = require('http');
var mqtt = require('mqtt');

var app = express();
var server = http.createServer(app);

var mqttClient = mqtt.connect('mqtt:localhost:1883');

require('./socketio')(server, mqttClient);
require('./mqttClient')(mqttClient);
var authRouter = require('./routes/authRoute');

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app, server };