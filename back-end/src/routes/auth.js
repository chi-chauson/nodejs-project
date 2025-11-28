const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// POST /api/auth/register - Register new user
router.post('/register',
    [
        body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: { message: errors.array()[0].msg } });
            }

            const { username, email, password, avatar } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                const field = existingUser.email === email ? 'Email' : 'Username';
                return res.status(400).json({ error: { message: `${field} already exists` } });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const user = new User({
                username,
                email,
                passwordHash,
                avatar: avatar || null
            });

            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: { message: 'Registration failed' } });
        }
    }
);

// POST /api/auth/login - Login user
router.post('/login',
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: { message: errors.array()[0].msg } });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: { message: 'Invalid email or password' } });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({ error: { message: 'Invalid email or password' } });
            }

            // Generate token
            const token = generateToken(user._id);

            res.json({
                message: 'Login successful',
                token,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: { message: 'Login failed' } });
        }
    }
);

module.exports = router;