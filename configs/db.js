const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        console.log("connecting database...");
        await mongoose.connect(URI);
        console.log("database successfully connected");
    } catch (error) {
        console.log("database connection failed", error.message);
        process.exit(1);
    }
}

module.exports = connectDB; 