require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const firebaseAdmin = require('firebase-admin');
const app = express();

// Firebase Admin SDK initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS); // Replace with your actual path
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// CORS configuration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_KEY = process.env.API_KEY;

// Function to fetch news
function fetchNews(url, res) {
    axios.get(url)
        .then(response => {
            if (response.data.totalResults > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Successfully fetched the data",
                    data: response.data
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "No more results to show"
                });
            }
        })
        .catch(error => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to fetch data from the API",
                error: error.message
            });
        });
}

// Route to fetch all news
app.get("/all-news", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 69;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// Route to fetch country-specific news
app.get("/country-news", (req, res) => {
    let country = req.query.country; // Country code from query
    let pageSize = parseInt(req.query.pageSize) || 6;
    let page = parseInt(req.query.page) || 1;

    if (!country) {
        return res.json({
            status: 400,
            success: false,
            message: "Country code is required"
        });
    }

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// User Registration Route
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Create a new user with Firebase Authentication
        const userRecord = await firebaseAdmin.auth().createUser({
            email: email,
            password: password,
        });

        res.status(201).json({ message: "User registered successfully", uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ message: "Error registering the user", error: error.message });
    }
});

// User Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists using Firebase Authentication
        const user = await firebaseAdmin.auth().getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Firebase Authentication handles password verification automatically
        // In real apps, you'd want to generate a session or token for further use
        res.status(200).json({ message: "Login successful", uid: user.uid });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
