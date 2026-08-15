import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { format } from 'date-fns'
import {
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    BellIcon,
    PlusIcon
} from '@heroicons/react/24/outline'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts'
import { hienThiDanhMuc, nhanMucDoCanhBao } from '../utils/displayText'

const JAR_COLORS = {
    NEC: '#e74c3c',
    FFA: '#3498db',
    LTSS: '#2ecc71',
    EDU: '#9b59b6',
    PLAY: '#f39c12',
    GIVE: '#e67e22',
}

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [insights, setInsights] = useState(null)
    const [recentExpenses, setRecentExpenses] = useState([])
    const [unreadAlerts, setUnreadAlerts] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const now = new Date()
            const [statsRes, insightsRes, expensesRes, alertsRes] = await Promise.all([
                api.get(`/expenses/stats/summary?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
                api.get('/expenses/stats/insights'),
                api.get('/expenses?limit=5'),
                api.get('/alerts/unread')
            ])

            setStats(statsRes.data.data)
            setInsights(insightsRes.data.data)
            setRecentExpenses(expensesRes.data.data)
            setUnreadAlerts(alertsRes.data.count || 0)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    const chartData = stats?.expenseByJar?.map(jar => ({
        name: jar.jarKey,
        value: jar.total,
        color: JAR_COLORS[jar.jarKey] || '#gray'
    })) || []

    const dailyData = stats?.daily?.map((d) => ({
        day: d.day,
        ThuNhap: d.income || 0,
        ChiTieu: d.expense || 0
    })) || []

    const topCategories = insights?.topCategories || []
    const anomalySummary = insights?.anomalySummary || []
    const goalItems = insights?.goals || []
    const recurringDue = insights?.recurringDue || []

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tổng quan tài chính</h1>
                    <p className="text-gray-600 mt-1">
                        Theo dõi thu nhập, chi tiêu và số dư của bạn trong tháng hiện tại.
                    </p>
                </div>
                <Link
                    to="/expenses"
                    className="btn btn-primary flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm giao dịch
                </Link>
            </div>

            {/* Thông tin tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Thu nhập tháng này</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.totalIncome?.toLocaleString() || 0} VND
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tổng chi tháng này</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.totalExpense?.toLocaleString() || 0} VND
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Số dư (Thu - Chi)</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.net?.toLocaleString() || 0} VND
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <BellIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cột trái: 2 biểu đồ */}
                <div className="space-y-6">
                    {/* Biểu đồ phân bổ chi tiêu theo hũ (JAR) */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Phân bổ chi tiêu theo hũ</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Chưa có dữ liệu chi tiêu
                            </div>
                        )}
                    </div>

                    {/* Biểu đồ thu - chi theo ngày trong tháng */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Thu - chi theo ngày trong tháng</h2>
                        {dailyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                                    <Legend />
                                    <Bar dataKey="ThuNhap" fill="#10B981" name="Thu nhập" />
                                    <Bar dataKey="ChiTieu" fill="#EF4444" name="Chi tiêu" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Chưa có giao dịch trong tháng này
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải: Giao dịch gần đây */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Giao dịch gần đây</h2>
                        <Link to="/expenses" className="text-sm text-primary-600 hover:text-primary-700">
                            Xem tất cả
                        </Link>
                    </div>
                    {recentExpenses.length > 0 ? (
                        <div className="space-y-3">
                            {recentExpenses.map((expense) => (
                                <div
                                    key={expense._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{expense.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(expense.createdAt), 'dd/MM')} • {hienThiDanhMuc(expense.category)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {expense.amount.toLocaleString()} VND
                                        </p>
                                        {expense.jarKey && (
                                            <span
                                                className="text-xs px-2 py-1 rounded"
                                                style={{
                                                    backgroundColor: `${JAR_COLORS[expense.jarKey] || '#e5e7eb'}33`,
                                                    color: JAR_COLORS[expense.jarKey] || '#374151'
                                                }}
                                            >
                                                {expense.jarKey}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>Chưa có giao dịch nào</p>
                            <Link to="/expenses" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                                Thêm giao dịch đầu tiên
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Top danh mục tháng này</h2>
                    <div className="space-y-3">
                        {topCategories.length > 0 ? topCategories.map(item => (
                            <div key={item._id || item.total} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                <div>
                                    <p className="font-medium text-gray-900">{hienThiDanhMuc(item._id)}</p>
                                    <p className="text-sm text-gray-500">{item.count} giao dịch</p>
                                </div>
                                <p className="font-semibold text-gray-900">{item.total.toLocaleString()} VND</p>
                            </div>
                        )) : <p className="text-gray-500">Chưa có dữ liệu danh mục.</p>}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng hợp bất thường</h2>
                    <div className="space-y-3">
                        {anomalySummary.length > 0 ? anomalySummary.map(item => (
                            <div key={item._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                <div>
                                    <p className="font-medium text-gray-900">{nhanMucDoCanhBao[item._id] || item._id}</p>
                                    <p className="text-sm text-gray-500">{item.count} giao dịch bị gắn cờ</p>
                                </div>
                                <p className="font-semibold text-gray-900">{item.totalAmount.toLocaleString()} VND</p>
                            </div>
                        )) : <p className="text-gray-500">Chưa có anomaly nào trong tháng này.</p>}
                        <div className="rounded-lg bg-primary-50 p-4 text-sm text-primary-800">
                            {unreadAlerts > 0 ? `Bạn đang có ${unreadAlerts} cảnh báo chưa đọc.` : 'Hiện không có cảnh báo chưa đọc.'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Mục tiêu tiết kiệm</h2>
                        <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700">Quản lý</Link>
                    </div>
                    <div className="space-y-3">
                        {goalItems.length > 0 ? goalItems.map(goal => (
                            <div key={goal._id} className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-900">{goal.name}</p>
                                    <span className="text-sm text-primary-700">{goal.progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-gray-200 mb-2">
                                    <div className="h-2 rounded-full bg-primary-600" style={{ width: `${Math.min(goal.progress, 100)}%` }}></div>
                                </div>
                                <p className="text-sm text-gray-500">{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} VND</p>
                            </div>
                        )) : <p className="text-gray-500">Chưa có mục tiêu tiết kiệm nào.</p>}
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Giao dịch định kỳ đến hạn</h2>
                        <Link to="/recurring" className="text-sm text-primary-600 hover:text-primary-700">Xem chi tiết</Link>
                    </div>
                    <div className="space-y-3">
                        {recurringDue.length > 0 ? recurringDue.map(item => (
                            <div key={item._id} className="rounded-lg bg-gray-50 p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{item._id === 'EXPENSE' ? 'Chi tiêu định kỳ' : item._id === 'INCOME' ? 'Thu nhập định kỳ' : item._id}</p>
                                    <p className="text-sm text-gray-500">{item.count} mục đến hạn</p>
                                </div>
                                <p className="font-semibold text-gray-900">{item.totalAmount.toLocaleString()} VND</p>
                            </div>
                        )) : <p className="text-gray-500">Hiện chưa có giao dịch định kỳ nào đến hạn.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

