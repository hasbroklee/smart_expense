/**
 * Authentication Routes
 * User registration and login
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const JarConfig = require('../models/JarConfig');
const SavingsGoal = require('../models/SavingsGoal');
const RecurringTransaction = require('../models/RecurringTransaction');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    let session;
    try {
        const { username, email, password, fullName } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Tên đăng nhập, email và mật khẩu là bắt buộc'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmailOrUsername(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email hoặc tên đăng nhập này đã tồn tại'
            });
        }

        // Check username uniqueness
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                error: 'Tên đăng nhập đã được sử dụng'
            });
        }

        session = await mongoose.startSession();

        let user;
        await session.withTransaction(async () => {
            user = new User({
                username,
                email,
                password,
                fullName: fullName || ''
            });

            await user.save({ session });
            await JarConfig.initializeDefaultJars(user._id.toString(), session);
            await SavingsGoal.initializeDefaultGoals(user._id.toString(), session);
            await RecurringTransaction.initializeDefaultRecurring(user._id.toString(), session);
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                user: user.toJSON(),
                token
            },
            message: 'Đăng ký tài khoản thành công'
        });
    } catch (error) {
        console.error('Register Error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: `${field} đã tồn tại`
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Không thể đăng ký tài khoản'
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validate required fields
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email hoặc tên đăng nhập và mật khẩu là bắt buộc'
            });
        }

        // Find user by email or username
        const user = await User.findByEmailOrUsername(identifier);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Email, tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Tài khoản đang bị vô hiệu hóa'
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Email, tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            data: {
                user: user.toJSON(),
                token
            },
            message: 'Đăng nhập thành công'
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể đăng nhập'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user.toJSON()
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể tải thông tin tài khoản'
        });
    }
});

/**
 * PUT /api/auth/me
 * Update current user profile (requires authentication)
 */
router.put('/me', authenticate, async (req, res) => {
    try {
        const { fullName, preferences } = req.body;
        const user = req.user;

        // Update allowed fields
        if (fullName !== undefined) user.fullName = fullName;
        if (preferences) {
            if (preferences.currency) user.preferences.currency = preferences.currency;
            if (preferences.language) user.preferences.language = preferences.language;
            if (preferences.monthlyBudget !== undefined) {
                user.preferences.monthlyBudget = preferences.monthlyBudget;
            }
        }

        user.updatedAt = new Date();
        await user.save();

        res.json({
            success: true,
            data: user.toJSON(),
            message: 'Cập nhật hồ sơ thành công'
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể cập nhật hồ sơ'
        });
    }
});

/**
 * PUT /api/auth/change-password
 * Change user password (requires authentication)
 */
router.put('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }

        const user = req.user;

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Không thể đổi mật khẩu'
        });
    }
});

/**
 * POST /api/auth/verify-token
 * Verify if token is valid
 */
router.post('/verify-token', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Phiên đăng nhập hợp lệ',
        data: {
            userId: req.userId,
            email: req.user.email
        }
    });
});

module.exports = router;

