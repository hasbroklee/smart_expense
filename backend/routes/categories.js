const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const { authenticate } = require('../middleware/auth');

const CATEGORY_LABELS = {
    Food: 'Ăn uống',
    Transportation: 'Đi lại',
    Bills: 'Hóa đơn',
    Healthcare: 'Sức khỏe',
    Insurance: 'Bảo hiểm',
    Savings: 'Tiết kiệm',
    Education: 'Giáo dục',
    Entertainment: 'Giải trí',
    Charity: 'Từ thiện',
    Salary: 'Lương',
    Freelance: 'Làm thêm',
    Gift: 'Quà tặng',
    Other: 'Khác',
    Uncategorized: 'Chưa phân loại'
};

const hienThiDanhMuc = (name) => CATEGORY_LABELS[name] || name;

router.get('/', authenticate, async (req, res) => {
    try {
        const { type, jarKey, includeInactive } = req.query;
        const query = { userId: req.userId };

        if (type) query.type = type;
        if (jarKey) query.jarKey = jarKey;
        if (includeInactive !== 'true') query.isActive = true;

        const categories = await Category.find(query).sort({ type: 1, name: 1 });
        const translatedCategories = categories.map(category => ({
            ...category.toObject(),
            name: hienThiDanhMuc(category.name)
        }));
        res.json({ success: true, data: translatedCategories });
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tải danh mục' });
    }
});

router.post('/initialize', authenticate, async (req, res) => {
    try {
        const categories = await Category.initializeDefaultCategories(req.userId);
        res.json({
            success: true,
            data: categories,
            message: 'Đã khởi tạo danh mục mặc định thành công'
        });
    } catch (error) {
        console.error('Initialize Categories Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể khởi tạo danh mục mặc định' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { name, type, jarKey, color, icon, keywords = [] } = req.body;

        if (!name || !type) {
            return res.status(400).json({ success: false, error: 'Tên danh mục và loại giao dịch là bắt buộc' });
        }

        const category = await Category.create({
            userId: req.userId,
            name,
            type,
            jarKey: type === 'EXPENSE' ? (jarKey || 'NEC') : null,
            color,
            icon,
            keywords
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tạo danh mục' });
    }
});

router.get('/stats/usage', authenticate, async (req, res) => {
    try {
        const stats = await Expense.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    lastUsedAt: { $max: '$createdAt' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        res.json({
            success: true,
            data: stats.map(item => ({
                type: item._id.type,
                category: hienThiDanhMuc(item._id.category || 'Uncategorized'),
                totalAmount: item.totalAmount,
                count: item.count,
                lastUsedAt: item.lastUsedAt
            }))
        });
    } catch (error) {
        console.error('Category Usage Stats Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Không thể tải thống kê sử dụng danh mục' });
    }
});

module.exports = router;
