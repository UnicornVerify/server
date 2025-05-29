const { Schema, model, models } = require('mongoose');

const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true })

const ContactModel = models.Contact || new model("Contact", contactSchema);

module.exports = ContactModel;