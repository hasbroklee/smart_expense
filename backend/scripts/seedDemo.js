const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const connectDB = require('../config/database');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Alert = require('../models/Alert');
const JarConfig = require('../models/JarConfig');
const SavingsGoal = require('../models/SavingsGoal');
const RecurringTransaction = require('../models/RecurringTransaction');
const Category = require('../models/Category');

function taoAnomaly(item) {
    const laChiLonBatThuong = item.type === 'EXPENSE' && item.amount >= 5000000;

    return {
        isAnomaly: laChiLonBatThuong,
        reasons: laChiLonBatThuong ? ['ANOMALY', 'JAR_LIMIT'] : [],
        level: laChiLonBatThuong ? 'warning' : 'normal',
        message: laChiLonBatThuong
            ? 'Đây là giao dịch bất thường mẫu để phục vụ phần trình diễn và tăng dữ liệu huấn luyện.'
            : 'Khoản chi đang nằm trong ngưỡng bình thường.',
        detectedAt: item.createdAt
    };
}

function taoAIData(item) {
    return {
        predictedCategory: item.category || null,
        predictedJarKey: item.jarKey || null,
        predictedType: item.type,
        confidence: item.type === 'EXPENSE' ? 0.93 : 0.9,
        extractedAmount: item.amount,
        classifiedAt: item.createdAt
    };
}

function taoDuLieuGiaoDich(userId, expenses) {
    return expenses.map((item) => ({
        userId,
        ...item,
        ai: taoAIData(item),
        anomaly: taoAnomaly(item)
    }));
}

async function dongBoMucTieu(userId, updates) {
    for (const item of updates) {
        await SavingsGoal.updateOne(
            { userId, name: item.name },
            { $set: item.values }
        );
    }
}

async function dongBoGiaoDichDinhKy(userId, updates) {
    for (const item of updates) {
        await RecurringTransaction.updateOne(
            { userId, title: item.title },
            { $set: item.values }
        );
    }
}

async function taoCanhBao(userId, expenses) {
    const canhBaoItems = expenses.filter((item) => item.anomaly?.isAnomaly);

    if (canhBaoItems.length === 0) {
        return;
    }

    await Alert.insertMany(
        canhBaoItems.map((item, index) => ({
            userId,
            expenseId: item._id,
            type: 'ANOMALY',
            level: 'warning',
            title: index === 0 ? 'Phát hiện giao dịch bất thường mẫu' : 'Phát hiện giao dịch vượt mức thông thường',
            message: 'Giao dịch này được tạo lớn hơn bình thường để phần tổng quan có dữ liệu cảnh báo và giúp AI học mẫu chi tiêu.',
            metadata: {
                jarKey: item.jarKey,
                amount: item.amount
            }
        }))
    );
}

async function seedTaiKhoan(config) {
    let user = await User.findOne({ email: config.email });

    if (!user) {
        user = new User({
            username: config.username,
            email: config.email,
            password: config.password,
            fullName: config.fullName,
            preferences: config.preferences
        });
        await user.save();
    } else {
        user.username = config.username;
        user.fullName = config.fullName;
        user.preferences = config.preferences;
        user.isActive = true;
        await user.save();
    }

    const userId = user._id.toString();

    await JarConfig.initializeDefaultJars(userId);
    await Category.initializeDefaultCategories(userId);

    await Expense.deleteMany({ userId });
    await Alert.deleteMany({ userId });
    await SavingsGoal.deleteMany({ userId });
    await RecurringTransaction.deleteMany({ userId });

    await SavingsGoal.initializeDefaultGoals(userId);
    await RecurringTransaction.initializeDefaultRecurring(userId);

    const createdExpenses = await Expense.insertMany(
        taoDuLieuGiaoDich(userId, config.expenses)
    );

    await taoCanhBao(userId, createdExpenses);
    await dongBoMucTieu(userId, config.goalUpdates);
    await dongBoGiaoDichDinhKy(userId, config.recurringUpdates);

    return {
        email: config.email,
        username: config.username,
        password: config.password,
        transactions: createdExpenses.length
    };
}

async function seed() {
    await connectDB();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const accounts = [
        {
            email: process.env.DEMO_EMAIL || 'demo@expenseai.local',
            username: process.env.DEMO_USERNAME || 'demo_user',
            password: process.env.DEMO_PASSWORD || '123456',
            fullName: 'Demo Expense User',
            preferences: {
                currency: 'VND',
                language: 'vi',
                monthlyBudget: 30000000
            },
            expenses: [
                { description: 'Lương tháng 8', amount: 18000000, type: 'INCOME', category: 'Lương', createdAt: new Date(currentYear, currentMonth, 1, 8) },
                { description: 'Thu nhập dự án ngoài giờ', amount: 6500000, type: 'INCOME', category: 'Làm thêm', createdAt: new Date(currentYear, currentMonth, 4, 10) },
                { description: 'Mua đồ ăn siêu thị', amount: 1450000, type: 'EXPENSE', category: 'Ăn uống', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 2, 18) },
                { description: 'Nạp xăng xe máy', amount: 180000, type: 'EXPENSE', category: 'Đi lại', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 3, 8) },
                { description: 'Đóng tiền điện nước', amount: 920000, type: 'EXPENSE', category: 'Hóa đơn', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 5, 19) },
                { description: 'Mua khóa học MongoDB', amount: 890000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 7, 21) },
                { description: 'Cà phê với bạn', amount: 220000, type: 'EXPENSE', category: 'Giải trí', jarKey: 'PLAY', createdAt: new Date(currentYear, currentMonth, 8, 20) },
                { description: 'Đóng bảo hiểm sức khỏe', amount: 1200000, type: 'EXPENSE', category: 'Bảo hiểm', jarKey: 'FFA', createdAt: new Date(currentYear, currentMonth, 10, 9) },
                { description: 'Tiết kiệm mua laptop mới', amount: 3000000, type: 'EXPENSE', category: 'Tiết kiệm', jarKey: 'LTSS', createdAt: new Date(currentYear, currentMonth, 12, 7) },
                { description: 'Ủng hộ quỹ từ thiện', amount: 350000, type: 'EXPENSE', category: 'Từ thiện', jarKey: 'GIVE', createdAt: new Date(currentYear, currentMonth, 13, 16) },
                { description: 'Mua điện thoại khẩn cấp', amount: 8500000, type: 'EXPENSE', category: 'Giải trí', jarKey: 'PLAY', createdAt: new Date(currentYear, currentMonth, 14, 14) }
            ],
            goalUpdates: [
                {
                    name: 'Quy du phong 3 thang',
                    values: { currentAmount: 4500000, targetAmount: 15000000, status: 'ACTIVE' }
                },
                {
                    name: 'Tiet kiem nang cap laptop',
                    values: { currentAmount: 12000000, targetAmount: 25000000, status: 'ACTIVE' }
                }
            ],
            recurringUpdates: [
                {
                    title: 'Lương hàng tháng',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 28), amount: 18000000, category: 'Lương' }
                },
                {
                    title: 'Tiền internet',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 16), amount: 320000, category: 'Hóa đơn' }
                }
            ]
        },
        {
            email: 'office.user@expenseai.local',
            username: 'office_user',
            password: '123456',
            fullName: 'Nhân viên văn phòng',
            preferences: {
                currency: 'VND',
                language: 'vi',
                monthlyBudget: 22000000
            },
            expenses: [
                { description: 'Lương công ty tháng 8', amount: 22000000, type: 'INCOME', category: 'Lương', createdAt: new Date(currentYear, currentMonth, 1, 9) },
                { description: 'Thưởng KPI quý', amount: 3200000, type: 'INCOME', category: 'Quà tặng', createdAt: new Date(currentYear, currentMonth, 6, 11) },
                { description: 'Ăn sáng bánh mì cà phê', amount: 65000, type: 'EXPENSE', category: 'Ăn uống', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 2, 7) },
                { description: 'Ăn trưa văn phòng', amount: 95000, type: 'EXPENSE', category: 'Ăn uống', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 2, 12) },
                { description: 'Đổ xăng đi làm', amount: 150000, type: 'EXPENSE', category: 'Đi lại', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 3, 8) },
                { description: 'Thanh toán tiền điện căn hộ', amount: 780000, type: 'EXPENSE', category: 'Hóa đơn', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 5, 19) },
                { description: 'Đóng tiền nước sinh hoạt', amount: 210000, type: 'EXPENSE', category: 'Hóa đơn', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 5, 19, 30) },
                { description: 'Mua sách tiếng Anh giao tiếp', amount: 340000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 8, 20) },
                { description: 'Đóng khóa học excel nâng cao', amount: 1250000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 9, 21) },
                { description: 'Mua vé xem phim cuối tuần', amount: 240000, type: 'EXPENSE', category: 'Giải trí', jarKey: 'PLAY', createdAt: new Date(currentYear, currentMonth, 11, 20) },
                { description: 'Chuyển tiền tiết kiệm hàng tháng', amount: 4000000, type: 'EXPENSE', category: 'Tiết kiệm', jarKey: 'LTSS', createdAt: new Date(currentYear, currentMonth, 12, 7) },
                { description: 'Đóng bảo hiểm nhân thọ', amount: 2100000, type: 'EXPENSE', category: 'Bảo hiểm', jarKey: 'FFA', createdAt: new Date(currentYear, currentMonth, 13, 10) },
                { description: 'Ủng hộ đồng bào miền Trung', amount: 500000, type: 'EXPENSE', category: 'Từ thiện', jarKey: 'GIVE', createdAt: new Date(currentYear, currentMonth, 14, 9) },
                { description: 'Mua laptop làm việc gấp', amount: 18900000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 15, 15) }
            ],
            goalUpdates: [
                {
                    name: 'Quy du phong 3 thang',
                    values: { currentAmount: 8000000, targetAmount: 18000000, status: 'ACTIVE' }
                },
                {
                    name: 'Tiet kiem nang cap laptop',
                    values: { currentAmount: 15000000, targetAmount: 30000000, status: 'ACTIVE' }
                }
            ],
            recurringUpdates: [
                {
                    title: 'Lương hàng tháng',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 28), amount: 22000000, category: 'Lương' }
                },
                {
                    title: 'Tiền internet',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 18), amount: 380000, category: 'Hóa đơn' }
                }
            ]
        },
        {
            email: 'freelancer.user@expenseai.local',
            username: 'freelancer_user',
            password: '123456',
            fullName: 'Freelancer sáng tạo',
            preferences: {
                currency: 'VND',
                language: 'vi',
                monthlyBudget: 28000000
            },
            expenses: [
                { description: 'Thu tiền thiết kế landing page', amount: 9500000, type: 'INCOME', category: 'Làm thêm', createdAt: new Date(currentYear, currentMonth, 1, 10) },
                { description: 'Thu tiền bảo trì website tháng này', amount: 4200000, type: 'INCOME', category: 'Làm thêm', createdAt: new Date(currentYear, currentMonth, 5, 14) },
                { description: 'Khách tip thêm sau dự án', amount: 800000, type: 'INCOME', category: 'Quà tặng', createdAt: new Date(currentYear, currentMonth, 6, 18) },
                { description: 'Ăn tối sau giờ làm', amount: 180000, type: 'EXPENSE', category: 'Ăn uống', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 2, 20) },
                { description: 'Mua nguyên liệu nấu ăn', amount: 520000, type: 'EXPENSE', category: 'Ăn uống', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 3, 18) },
                { description: 'Đi grab gặp khách hàng', amount: 135000, type: 'EXPENSE', category: 'Đi lại', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 4, 9) },
                { description: 'Thanh toán internet studio', amount: 450000, type: 'EXPENSE', category: 'Hóa đơn', jarKey: 'NEC', createdAt: new Date(currentYear, currentMonth, 5, 8) },
                { description: 'Mua plugin Figma trả phí', amount: 690000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 7, 11) },
                { description: 'Đăng ký khóa học motion design', amount: 2400000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 9, 20) },
                { description: 'Mua chuột và bàn phím mới', amount: 1650000, type: 'EXPENSE', category: 'Giải trí', jarKey: 'PLAY', createdAt: new Date(currentYear, currentMonth, 10, 16) },
                { description: 'Nạp quỹ dự phòng freelancer', amount: 2500000, type: 'EXPENSE', category: 'Tiết kiệm', jarKey: 'LTSS', createdAt: new Date(currentYear, currentMonth, 11, 7) },
                { description: 'Đóng bảo hiểm sức khỏe cá nhân', amount: 1750000, type: 'EXPENSE', category: 'Bảo hiểm', jarKey: 'FFA', createdAt: new Date(currentYear, currentMonth, 12, 10) },
                { description: 'Ủng hộ quỹ nuôi trẻ em', amount: 300000, type: 'EXPENSE', category: 'Từ thiện', jarKey: 'GIVE', createdAt: new Date(currentYear, currentMonth, 13, 17) },
                { description: 'Mua macbook phục vụ dự án', amount: 26800000, type: 'EXPENSE', category: 'Giáo dục', jarKey: 'EDU', createdAt: new Date(currentYear, currentMonth, 14, 13) },
                { description: 'Thưởng nóng từ khách hàng cũ', amount: 1500000, type: 'INCOME', category: 'Quà tặng', createdAt: new Date(currentYear, currentMonth, 15, 10) }
            ],
            goalUpdates: [
                {
                    name: 'Quy du phong 3 thang',
                    values: { currentAmount: 6500000, targetAmount: 20000000, status: 'ACTIVE' }
                },
                {
                    name: 'Tiet kiem nang cap laptop',
                    values: { currentAmount: 21000000, targetAmount: 35000000, status: 'ACTIVE' }
                }
            ],
            recurringUpdates: [
                {
                    title: 'Lương hàng tháng',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 30), amount: 9000000, category: 'Làm thêm', description: 'Thu nhập định kỳ từ khách hàng quen' }
                },
                {
                    title: 'Tiền internet',
                    values: { nextRunAt: new Date(currentYear, currentMonth, 20), amount: 450000, category: 'Hóa đơn', description: 'Internet studio làm việc' }
                }
            ]
        }
    ];

    const results = [];

    for (const account of accounts) {
        results.push(await seedTaiKhoan(account));
    }

    console.log('Demo seed completed');
    for (const item of results) {
        console.log(`- ${item.email} | ${item.username} | ${item.password} | ${item.transactions} giao dịch`);
    }

    await mongoose.connection.close();
}

seed().catch(async (error) => {
    console.error('Seed failed:', error);
    await mongoose.connection.close();
    process.exit(1);
});
