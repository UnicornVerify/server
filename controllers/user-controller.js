const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = async (req, res) => {
    try {
        res.status(200).send('Hello, please authenticate you!');
    } catch (error) {
        console.log(error);
    }
}

// Register API : /api/user/register
const register = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existUser = await UserModel.findOne({ phone });

        if (existUser) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ name, phone, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET_KEY, { expiresIn: '3d' })

        res.cookie('token', token, {
            httpOnly: true, //Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Production
            maxAge: 3 * 24 * 60 * 60 * 1000, //Cookie expiration time
        })

        return res.json({ success: true, user: { phone: user.phone, email: user.email, name: user.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login API : /api/user/login
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.json({ success: false, message: 'Required phone and password' });
        }

        const user = await UserModel.findOne({ phone });

        if (!user) {
            return res.json({ success: false, message: 'Invalid phone or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid phone or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET_KEY, { expiresIn: '3d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Auth User API : /api/user/auth
const authUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        console.log("Auth User Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Logout API : /api/user/logout
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { auth, register, login, authUser, logout };