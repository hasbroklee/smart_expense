import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline'

const nhanTanSuat = {
    DAILY: 'Hàng ngày',
    WEEKLY: 'Hàng tuần',
    MONTHLY: 'Hàng tháng'
}

const nhanLoai = {
    EXPENSE: 'Chi tiêu',
    INCOME: 'Thu nhập'
}

export default function Recurring() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        type: 'EXPENSE',
        category: '',
        jarKey: 'NEC',
        frequency: 'MONTHLY',
        nextRunAt: ''
    })

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const response = await api.get('/recurring')
            setItems(response.data.data || [])
        } catch (error) {
            toast.error('Không thể tải giao dịch định kỳ')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/recurring', {
                ...formData,
                amount: Number(formData.amount || 0)
            })
            toast.success('Đã thêm giao dịch định kỳ')
            setShowModal(false)
            setFormData({ title: '', description: '', amount: '', type: 'EXPENSE', category: '', jarKey: 'NEC', frequency: 'MONTHLY', nextRunAt: '' })
            fetchItems()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Không thể tạo giao dịch định kỳ')
        }
    }

    const runDueItems = async () => {
        try {
            const response = await api.post('/recurring/run-due')
            toast.success(`Đã xử lý ${response.data.data.processed} giao dịch đến hạn`)
            fetchItems()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Không thể chạy giao dịch đến hạn')
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Giao dịch định kỳ</h1>
                    <p className="text-gray-600 mt-1">Tự động hoá các khoản thu chi lặp lại như lương, internet, điện nước.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary flex items-center" onClick={runDueItems}>
                        <ArrowPathIcon className="w-5 h-5 mr-2" />
                        Chạy giao dịch đến hạn
                    </button>
                    <button className="btn btn-primary flex items-center" onClick={() => setShowModal(true)}>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Thêm định kỳ
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item._id} className="rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <p className="text-sm text-gray-500 mt-1">{nhanTanSuat[item.frequency] || item.frequency} • lần tới: {format(new Date(item.nextRunAt), 'dd/MM/yyyy')}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{item.amount.toLocaleString()} VND</p>
                                <p className={`text-sm ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>{nhanLoai[item.type] || item.type}</p>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <p className="text-gray-500">Chưa có giao dịch định kỳ nào.</p>}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thêm giao dịch định kỳ</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="input" placeholder="Tiêu đề" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            <input className="input" placeholder="Mô tả" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input className="input" type="number" placeholder="Số tiền" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                                <select className="input" value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}>
                                    <option value="DAILY">Hàng ngày</option>
                                    <option value="WEEKLY">Hàng tuần</option>
                                    <option value="MONTHLY">Hàng tháng</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="EXPENSE">Chi tiêu</option>
                                    <option value="INCOME">Thu nhập</option>
                                </select>
                                <input className="input" type="date" value={formData.nextRunAt} onChange={(e) => setFormData({ ...formData, nextRunAt: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="input" placeholder="Danh mục" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                <select className="input" value={formData.jarKey} onChange={(e) => setFormData({ ...formData, jarKey: e.target.value })} disabled={formData.type === 'INCOME'}>
                                    <option value="NEC">NEC</option>
                                    <option value="FFA">FFA</option>
                                    <option value="LTSS">LTSS</option>
                                    <option value="EDU">EDU</option>
                                    <option value="PLAY">PLAY</option>
                                    <option value="GIVE">GIVE</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn btn-primary flex-1">Lưu định kỳ</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Huỷ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
