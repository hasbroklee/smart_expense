import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const JAR_COLORS = {
    NEC: '#e74c3c',
    FFA: '#3498db',
    LTSS: '#2ecc71',
    EDU: '#9b59b6',
    PLAY: '#f39c12',
    GIVE: '#e67e22',
}

export default function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    // type: '' = để AI tự quyết định, 'EXPENSE' = chi tiêu, 'INCOME' = thu nhập
    const [formData, setFormData] = useState({ description: '', amount: '', category: '', jarKey: '', type: '' })

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses')
            setExpenses(response.data.data)
        } catch (error) {
            toast.error('Lấy danh sách giao dịch thất bại')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                // Nếu để trống, gửi null để backend tự xử lý (ví dụ: đọc từ mô tả)
                amount: formData.amount === '' ? null : Number(formData.amount || 0)
            }

            if (editingExpense) {
                await api.put(`/expenses/${editingExpense._id}`, payload)
                toast.success('Cập nhật giao dịch thành công')
            } else {
                await api.post('/expenses', payload)
                toast.success('Thêm giao dịch thành công')
            }
            setShowModal(false)
            setEditingExpense(null)
            setFormData({ description: '', amount: '', category: '', jarKey: '', type: '' })
            fetchExpenses()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Lưu giao dịch thất bại')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xoá giao dịch này?')) return

        try {
            await api.delete(`/expenses/${id}`)
            toast.success('Xoá giao dịch thành công')
            fetchExpenses()
        } catch (error) {
            toast.error('Xoá giao dịch thất bại')
        }
    }

    const openEditModal = (expense) => {
        setEditingExpense(expense)
        setFormData({
            description: expense.description,
            amount: expense.amount || '',
            category: expense.category || '',
            jarKey: expense.jarKey || '',
            type: expense.type || 'EXPENSE'
        })
        setShowModal(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Giao dịch</h1>
                <button
                    onClick={() => {
                        setEditingExpense(null)
                        setFormData({ description: '', amount: '', category: '', jarKey: '', type: '' })
                        setShowModal(true)
                    }}
                    className="btn btn-primary flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm giao dịch
                </button>
            </div>

            {/* Expenses List */}
            <div className="card">
                {expenses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Mô tả</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Loại</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Danh mục</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Hũ</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Số tiền</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{expense.description}</p>
                                            {expense.ai?.confidence && (
                                                <p className="text-xs text-gray-500">
                                                    Độ tin cậy AI: {(expense.ai.confidence * 100).toFixed(1)}%
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${expense.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {expense.type === 'INCOME' ? 'THU NHẬP' : 'CHI TIÊU'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className="px-2 py-1 rounded text-sm font-medium"
                                                style={{
                                                    backgroundColor: `${JAR_COLORS[expense.jarKey]}20`,
                                                    color: JAR_COLORS[expense.jarKey]
                                                }}
                                            >
                                                {expense.jarKey}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                                            {expense.amount.toLocaleString()} VND
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {format(new Date(expense.createdAt), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => openEditModal(expense)}
                                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense._id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Chưa có giao dịch nào</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            Thêm giao dịch đầu tiên
                        </button>
                    </div>
                )}
            </div>

            {/* Thêm / chỉnh sửa giao dịch */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {editingExpense ? 'Sửa giao dịch' : 'Thêm giao dịch'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ví dụ: Mua đồ ăn 150000 đồng"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    AI sẽ tự đọc số tiền từ mô tả (VD: \"Mua đồ ăn 150000 đồng\"), bạn có thể nhập thêm bên dưới nếu là thu nhập.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại giao dịch
                                </label>
                                <select
                                    className="input"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="">Tự động</option>
                                    <option value="EXPENSE">Chi tiêu</option>
                                    <option value="INCOME">Thu nhập</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số tiền (tuỳ chọn – nên nhập khi là Thu nhập)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="VD: 15000000"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục (tuỳ chọn)
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Ăn uống, Đi lại, ..."
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hũ (tuỳ chọn)
                                    </label>
                                    <select
                                        className="input"
                                        value={formData.jarKey}
                                        onChange={(e) => setFormData({ ...formData, jarKey: e.target.value })}
                                    >
                                        <option value="">Tự động</option>
                                        <option value="NEC">NEC</option>
                                        <option value="FFA">FFA</option>
                                        <option value="LTSS">LTSS</option>
                                        <option value="EDU">EDU</option>
                                        <option value="PLAY">PLAY</option>
                                        <option value="GIVE">GIVE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 btn btn-primary"
                                >
                                    {editingExpense ? 'Cập nhật' : 'Thêm'} giao dịch
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingExpense(null)
                                        setFormData({ description: '', amount: '', category: '', jarKey: '', type: '' })
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

