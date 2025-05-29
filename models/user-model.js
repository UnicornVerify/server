const { Schema, model, models } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uploadlimit: { type: Number, default: 3 },
}, {minimize: false, timestamps: true })

const UserModel = models.User || new model("User", userSchema);

module.exports = UserModel;