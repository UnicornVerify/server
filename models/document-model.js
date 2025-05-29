const { Schema, model, models } = require('mongoose');

const documentSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: Array, require: true },
    isPreview: { type: Boolean, default: true },
}, { timestamps: true })

const DocumentModel = models.Document || new model("Document", documentSchema);

module.exports = DocumentModel;