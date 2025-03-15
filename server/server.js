require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_KEY = process.env.API_KEY;
const FIREBASE_API_KEY = process.env.WEB_API_KEY; // Firebase Web API Key

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
    let country = req.query.country;
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

// User Registration Route using Firebase REST API
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
            { email, password, returnSecureToken: true }
        );
        res.status(201).json({ message: "User registered successfully", uid: response.data.localId });
    } catch (error) {
        res.status(500).json({ message: "Error registering the user", error: error.response.data });
    }
});

// User Login Route using Firebase REST API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            { email, password, returnSecureToken: true }
        );
        res.status(200).json({ message: "Login successful", uid: response.data.localId });
    } catch (error) {
        res.status(401).json({ message: "Invalid credentials", error: error.response.data });
    }
});

// Port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
