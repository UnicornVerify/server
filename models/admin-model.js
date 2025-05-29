const { Schema, model, models } = require('mongoose');

const adminSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    banUser: { type: Object, default: {} },
    isAdmin: { type: Boolean, default: true },
}, {minimize: false, timestamps: true })

const AdminModel = models.Admin || new model("Admin", adminSchema);

module.exports = AdminModel;