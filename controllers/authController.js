const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            data: {
                user,
                token,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            res.status(200).json({
                status: 'success',
                data: {
                    user,
                    token,
                },
            });
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password',
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}

exports.setDeviceId = async (req, res) => {
    const { _id, deviceId } = req.body;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        if (deviceId !== '') {
            const existingUser = await User.findOne({ deviceId });
            if (existingUser) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Device ID is already in use by another user',
                });
            }
        }

        user.deviceId = deviceId;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}