import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { hienThiDanhMuc } from '../utils/displayText'

const typeOptions = [
    { value: 'EXPENSE', label: 'Chi tiêu' },
    { value: 'INCOME', label: 'Thu nhập' }
]

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [usageStats, setUsageStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        type: 'EXPENSE',
        jarKey: 'NEC',
        color: '#64748b',
        icon: 'tag',
        keywords: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [categoriesRes, usageRes] = await Promise.all([
                api.get('/categories'),
                api.get('/categories/stats/usage')
            ])
            setCategories(categoriesRes.data.data || [])
            setUsageStats(usageRes.data.data || [])
        } catch (error) {
            toast.error('Không thể tải danh mục')
        } finally {
            setLoading(false)
        }
    }

    const initializeDefaults = async () => {
        try {
            await api.post('/categories/initialize')
            toast.success('Đã khởi tạo danh mục mặc định')
            fetchData()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Khởi tạo danh mục thất bại')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/categories', {
                ...formData,
                jarKey: formData.type === 'EXPENSE' ? formData.jarKey : null,
                keywords: formData.keywords
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
            })
            toast.success('Đã thêm danh mục mới')
            setShowModal(false)
            setFormData({
                name: '',
                type: 'EXPENSE',
                jarKey: 'NEC',
                color: '#64748b',
                icon: 'tag',
                keywords: ''
            })
            fetchData()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Tạo danh mục thất bại')
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
    }

    const expenseCategories = categories.filter(item => item.type === 'EXPENSE')
    const incomeCategories = categories.filter(item => item.type === 'INCOME')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Danh mục</h1>
                    <p className="text-gray-600 mt-1">Quản lý danh mục chi tiêu và thu nhập trên tài khoản của bạn.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={initializeDefaults} className="btn btn-secondary flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Khởi tạo mặc định
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm danh mục
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="card xl:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách danh mục</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Chi tiêu</h3>
                            <div className="space-y-3">
                                {expenseCategories.map(category => (
                                    <div key={category._id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{hienThiDanhMuc(category.name)}</p>
                                                    <p className="text-sm text-gray-500">{category.jarKey || 'Không gắn hũ'} • {category.icon}</p>
                                                </div>
                                            </div>
                                            {category.isSystem && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Mặc định</span>}
                                        </div>
                                        {category.keywords?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {category.keywords.map(keyword => (
                                                    <span key={keyword} className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700">{keyword}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Thu nhập</h3>
                            <div className="space-y-3">
                                {incomeCategories.map(category => (
                                    <div key={category._id} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{hienThiDanhMuc(category.name)}</p>
                                                <p className="text-sm text-gray-500">{category.icon}</p>
                                            </div>
                                        </div>
                                        {category.keywords?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {category.keywords.map(keyword => (
                                                    <span key={keyword} className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">{keyword}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tần suất sử dụng</h2>
                    <div className="space-y-3">
                        {usageStats.slice(0, 8).map(item => (
                            <div key={`${item.type}-${item.category}`} className="rounded-lg bg-gray-50 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{hienThiDanhMuc(item.category)}</p>
                                        <p className="text-xs text-gray-500">{item.type === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{item.totalAmount.toLocaleString()} VND</p>
                                        <p className="text-xs text-gray-500">{item.count} giao dịch</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {usageStats.length === 0 && <p className="text-gray-500">Chưa có dữ liệu sử dụng danh mục.</p>}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thêm danh mục mới</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="input" placeholder="Tên danh mục" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    {typeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                                <select className="input" value={formData.jarKey} onChange={(e) => setFormData({ ...formData, jarKey: e.target.value })} disabled={formData.type === 'INCOME'}>
                                    <option value="NEC">NEC</option>
                                    <option value="FFA">FFA</option>
                                    <option value="LTSS">LTSS</option>
                                    <option value="EDU">EDU</option>
                                    <option value="PLAY">PLAY</option>
                                    <option value="GIVE">GIVE</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="input" placeholder="#64748b" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                                <input className="input" placeholder="icon name" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} />
                            </div>
                            <textarea className="input min-h-24" placeholder="Keywords, cách nhau bởi dấu phẩy" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}></textarea>
                            <div className="flex gap-3">
                                <button type="submit" className="btn btn-primary flex-1">Lưu danh mục</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Huỷ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
