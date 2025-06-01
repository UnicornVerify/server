require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const connectDB = require('./configs/db');
const { connectCloudinary } = require('./configs/cloudinary')
const PORT = process.env.PORT || 4000;

const contactRoute = require('./routes/contact-router');
const userRoute = require('./routes/user-router');
const adminRoute = require('./routes/admin-router');
const documentRoute = require('./routes/document-router');

const clorsOption = {
    origin: ["http://localhost:5173", "https://unicornverify.netlify.app"],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(clorsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.send("Server is now active."));
app.use("/api/contact", contactRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/document", documentRoute);

const start = async () => {
    try {
        await connectDB();
        await connectCloudinary();
        app.listen(PORT, () => {
            console.log(`server is listen on PORT : ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();