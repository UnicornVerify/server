
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/admin-model');
const UserModel = require('../models/user-model');
const ContactModel = require('../models/contact-model');

// Register API : /api/admin/register
const register = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name, !email, !phone, !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existAdmin = await AdminModel.findOne({ phone });

        if (existAdmin) {
            return res.json({ success: false, message: 'Admin already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await AdminModel.create({ name, phone, email, password: hashedPassword });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '3d' })

        res.cookie('adminToken', token, {
            httpOnly: true, //Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === 'production', //Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Production
            maxAge: 3 * 24 * 60 * 60 * 1000, //Cookie expiration time
        })

        return res.json({ success: true, admin: { phone: admin.phone, email: admin.email, name: admin.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login API : /api/admin/login
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.json({ success: false, message: 'Required phone and password' });
        }

        const admin = await AdminModel.findOne({ phone });

        if (!admin) {
            return res.json({ success: false, message: 'Invalid phone or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid phone or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '3d' });

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: 'Login successful',
            admin: {
                id: admin._id,
                name: admin.name,
                phone: admin.phone,
                email: admin.email,
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Auth Admin API : /api/admin/auth
const authAdmin = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const admin = await AdminModel.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.json({ success: true, admin });
    } catch (error) {
        console.log("Auth Admin Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Logout API : /api/admin/logout
const logout = async (req, res) => {
    try {
        res.clearCookie('adminToken', {
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


// Get Users : /api/admin/get-users [GET]
const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json({ success: true, users: users });
    } catch (error) {
        console.error('User List Error:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching user list', error: error.message });
    }
}

// Get Admins : /api/admin/get-admins [GET]
const getAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find({});
        res.status(200).json({ success: true, admins: admins });
    } catch (error) {
        console.error('Admin List Error:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching admin list', error: error.message });
    }
}

// Get Contacts : /api/admin/get-contacts [GET]
const getContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find({});
        res.status(200).json({ success: true, contacts: contacts });
    } catch (error) {
        console.error('Contact List Error:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching contact list', error: error.message });
    }
}

// Upgrade Plan : /api/admin/upgrade-plan [Patch]
const upgradePlan = async (req, res) => {
    try {
        const { id, uploadlimit } = req.body;

        if (typeof uploadlimit !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Upload limit must be a number. Please provide a valid number.',
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { uploadlimit },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Upload limit updated to ${uploadlimit}`,
            user: updatedUser,
        });

    } catch (error) {
        console.error('Upgrade Plan Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error upgrading plan',
            error: error.message,
        });
    }
};

module.exports = { register, login, authAdmin, logout, getUsers, getAdmins, getContacts, upgradePlan };