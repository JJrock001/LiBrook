const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userAuthDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Serve static files (your HTML pages)
app.use(express.static('public'));

// Register route (for creating new accounts)
app.post('/create-account', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.send('Account created successfully');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid password');
    }

    req.session.user = user;
    res.send('Login successful');
});

// Home route (for logged-in users)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    res.send(`Welcome to your dashboard, ${req.session.user.username}`);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
