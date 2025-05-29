const { cloudinary } = require('../configs/cloudinary');
const DocumentModel = require('../models/document-model');
const UserModel = require('../models/user-model');

// Upload Document : /api/document/add [POST]
const uploadDocument = async (req, res) => {
  try {
    const documentData = JSON.parse(req.body.documentData);
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'No document uploaded' });
    }

    const userId = req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingDocs = await DocumentModel.find({ userId });

    if (existingDocs.length >= user.uploadlimit) {
      return res.status(403).json({
        success: false,
        message: 'Upload limit reached. Please upgrade your plan to upload more documents.',
      });
    }

    const imageUrls = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    const newDocument = await DocumentModel.create({
      ...documentData,
      image: imageUrls,
      userId,
    });

    res.status(201).json({ success: true, message: 'Document Added', document: newDocument });

  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

// Delete Document : /api/document/delete [DELETE]
const deleteDocumentById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Document ID is required' });
    }

    const document = await DocumentModel.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Optionally, delete images from Cloudinary
    await Promise.all(
      document.image.map(async (imgUrl) => {
        const publicId = imgUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);
      })
    );

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete document', error: error.message });
  }
};

// Get User Documents : /api/document/user [GET]
const userDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await DocumentModel.find({ userId });

    res.status(200).json({ success: true, document: documents });
  } catch (error) {
    console.error('User Docs Error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching user documents', error: error.message });
  }
};

// List All Documents (Admin) : /api/document/list [GET]
const documentList = async (req, res) => {
  try {
    const documents = await DocumentModel.find({});
    res.status(200).json({ success: true, document: documents });
  } catch (error) {
    console.error('Admin List Error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching document list', error: error.message });
  }
};


// Change Preview (Admin) : /api/document/isPreview [Patch]
const changePreview = async (req, res) => {
  try {
    const { id, isPreview } = req.body;

    if (typeof isPreview !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Invalid preview value' });
    }

    const updatedDocument = await DocumentModel.findByIdAndUpdate(id, { isPreview }, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, message: 'Preview status updated', document: updatedDocument });
  } catch (error) {
    console.error('Change Preview Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update preview status', error: error.message });
  }
};


module.exports = {
  uploadDocument,
  deleteDocumentById,
  userDocuments,
  documentList,
  changePreview
};
