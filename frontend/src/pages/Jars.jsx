import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { PencilIcon } from '@heroicons/react/24/outline'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const JAR_INFO = {
    NEC: {
        name: 'Nhu cầu thiết yếu',
        description: 'Chi tiêu cho các nhu cầu bắt buộc hằng ngày: ăn uống, nhà ở, điện nước, đi lại...',
        color: '#e74c3c',
        icon: '🏠'
    },
    FFA: {
        name: 'Tự do tài chính',
        description: 'Đầu tư, tích luỹ dài hạn để tạo thu nhập thụ động và tự do tài chính.',
        color: '#3498db',
        icon: '🛡️'
    },
    LTSS: {
        name: 'Tiết kiệm dài hạn',
        description: 'Tiết kiệm cho các mục tiêu lớn trong tương lai: mua nhà, xe, cưới hỏi...',
        color: '#2ecc71',
        icon: '🏦'
    },
    EDU: {
        name: 'Giáo dục & phát triển',
        description: 'Đầu tư cho học tập, kỹ năng, khoá học, sách, hội thảo...',
        color: '#9b59b6',
        icon: '📚'
    },
    PLAY: {
        name: 'Giải trí',
        description: 'Ăn chơi, du lịch, xem phim, gặp gỡ bạn bè, sở thích cá nhân...',
        color: '#f39c12',
        icon: '🎮'
    },
    GIVE: {
        name: 'Cho đi / từ thiện',
        description: 'Tặng quà, ủng hộ, từ thiện, giúp đỡ gia đình và cộng đồng.',
        color: '#e67e22',
        icon: '❤️'
    },
}

export default function Jars() {
    const [jars, setJars] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingJar, setEditingJar] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchJars()
    }, [])

    const fetchJars = async () => {
        setLoading(true)
        try {
            let response = await api.get('/jars')
            let jarsData = response.data.data || []

            // Nếu chưa có cấu hình hũ nào, khởi tạo mặc định rồi load lại
            if (jarsData.length === 0) {
                try {
                    await api.post('/jars/initialize')
                    response = await api.get('/jars')
                    jarsData = response.data.data || []
                    if (jarsData.length > 0) {
                        toast.success('Đã tạo cấu hình 6 hũ mặc định')
                    }
                } catch (initError) {
                    toast.error('Không thể khởi tạo 6 hũ')
                }
            }

            setJars(jarsData)
        } catch (error) {
            toast.error('Lấy thông tin 6 hũ thất bại')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/jars/${editingJar.jarKey}`, {
                monthlyLimit: editingJar.monthlyLimit
            })
            toast.success('Cập nhật hạn mức hũ thành công')
            setShowModal(false)
            setEditingJar(null)
            fetchJars()
        } catch (error) {
            toast.error('Không thể cập nhật hạn mức hũ')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    const chartData = jars.map(jar => ({
        name: jar.jarKey,
        value: jar.currentSpending || 0,
        color: JAR_INFO[jar.jarKey]?.color || '#gray'
    }))

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mô hình 6 hũ</h1>

            {/* Biểu đồ tổng quan chi tiêu theo hũ */}
            {jars.length > 0 && (
                <div className="card mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan chi tiêu theo 6 hũ</h2>
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
                </div>
            )}

            {/* Danh sách 6 hũ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jars.map((jar) => {
                    const info = JAR_INFO[jar.jarKey] || {}
                    const spendingPercentage = jar.spendingPercentage || 0
                    const isOverLimit = spendingPercentage > 100

                    return (
                        <div key={jar._id} className="jar-card">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-2">{info.icon}</span>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {info.name || jar.jarName} {jar.jarKey ? `(${jar.jarKey})` : ''}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {info.description || jar.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingJar(jar)
                                        setShowModal(true)
                                    }}
                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Đã chi</span>
                                        <span className="font-semibold text-gray-900">
                                            {jar.currentSpending?.toLocaleString() || 0} VND
                                        </span>
                                    </div>
                                    {jar.monthlyLimit && (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${isOverLimit ? 'bg-red-500' : 'bg-primary-600'
                                                        }`}
                                                    style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Hạn mức: {jar.monthlyLimit.toLocaleString()} VND</span>
                                                <span className={isOverLimit ? 'text-red-600 font-semibold' : ''}>
                                                    {spendingPercentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {jar.remaining !== null && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Còn lại</span>
                                            <span
                                                className={`font-semibold ${jar.remaining < 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}
                                            >
                                                {jar.remaining.toLocaleString()} VND
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Edit Modal */}
            {showModal && editingJar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chỉnh sửa hạn mức hũ</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hạn mức hàng tháng (VND)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={editingJar.monthlyLimit || ''}
                                    onChange={(e) =>
                                        setEditingJar({
                                            ...editingJar,
                                            monthlyLimit: e.target.value ? parseInt(e.target.value) : null
                                        })
                                    }
                                    placeholder="Nhập hạn mức hàng tháng"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button type="submit" className="flex-1 btn btn-primary">
                                    Cập nhật
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingJar(null)
                                    }}
                                    className="flex-1 btn btn-secondary"
                                >
                                    Huỷ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

