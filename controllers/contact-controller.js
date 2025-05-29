const ContactModel = require("../models/contact-model");

// Add Contact API : POST /api/contact
const contactUs = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        await ContactModel.create({ name, email, phone, subject, message });

        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { contactUs };
