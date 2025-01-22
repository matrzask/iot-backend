const socketIo = require('socket.io');

const io = socketIo(server);

io.on('connection', async (socket) => {
    const token = socket.handshake.query.token; // token passed in query
    if (!token) {
        socket.disconnect(true);
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            socket.disconnect(true);
            return;
        }

        console.log(`User ${user._id} connected`);

        // Save user's socket ID for device-based filtering
        socket.deviceId = user.deviceId;

        socket.on('disconnect', () => {
            console.log(`User ${user._id} disconnected`);
        });
    } catch (error) {
        socket.disconnect(true);
    }
  });