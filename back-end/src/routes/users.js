const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/me - Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        res.json({ user: req.user.toJSON() });
    } catch (error) {
        res.status(500).json({ error: { message: 'Failed to fetch user profile' } });
    }
});

// PUT /api/users/me - Update current user profile
router.put('/me',
    auth,
    [
        body('username').optional().trim().isLength({ min: 3, max: 30 }),
        body('email').optional().isEmail().normalizeEmail(),
        body('password').optional().isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: { message: errors.array()[0].msg } });
            }

            const { username, email, password, avatar } = req.body;
            const updates = {};

            // Check if username/email are already taken by another user
            if (username && username !== req.user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ error: { message: 'Username already exists' } });
                }
                updates.username = username;
            }

            if (email && email !== req.user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ error: { message: 'Email already exists' } });
                }
                updates.email = email;
            }

            if (password) {
                updates.passwordHash = await bcrypt.hash(password, 10);
            }

            if (avatar !== undefined) {
                updates.avatar = avatar;
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.userId,
                updates,
                { new: true, runValidators: true }
            );

            res.json({
                message: 'Profile updated successfully',
                user: updatedUser.toJSON()
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ error: { message: 'Failed to update profile' } });
        }
    }
);

// GET /api/users/:id - Get user by ID (public profile)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: { message: 'User not found' } });
        }

        res.json({ user: user.toJSON() });
    } catch (error) {
        res.status(500).json({ error: { message: 'Failed to fetch user' } });
    }
});

module.exports = router;