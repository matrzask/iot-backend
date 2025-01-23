const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel.js');

let io;

module.exports = (server, mqttClient) => {
    io = socketIo(server,
        {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        }
    );

    io.on('connection', async (socket) => {
        const token = socket.handshake.query.token; // token passed in query

        if (!token) {
            socket.disconnect(true);
            console.log('No token provided');
            return
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                console.log('Invalid token');
                socket.disconnect(true);
                return;
            }

            console.log(`User ${user._id} connected`);

            // Save user's socket ID for device-based filtering
            socket.deviceId = user.deviceId;

            socket.on('disconnect', () => {
                console.log(`User ${user._id} disconnected`);
            });
            socket.on('message', (data) => {
                console.log(`Received message from user ${user._id}:`, data);
            });
            socket.on('setDelay', (delay) => {
                console.log(`Setting ${user.deviceId} delay to ${delay}`);
                mqttClient.publish(`/${user.deviceId}/delay`, delay.toString());
            });
        } catch (error) {
            console.log('Error during token verification or user retrieval:', error);
            socket.disconnect(true);
        }
    });
}

module.exports.getIo = () => io;