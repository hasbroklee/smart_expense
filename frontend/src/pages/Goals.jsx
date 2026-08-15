import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { PlusIcon } from '@heroicons/react/24/outline'

const nhanTrangThai = {
    ACTIVE: 'Đang thực hiện',
    COMPLETED: 'Đã hoàn thành',
    PAUSED: 'Tạm dừng'
}

export default function Goals() {
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        jarKey: 'LTSS',
        targetAmount: '',
        currentAmount: '',
        targetDate: '',
        note: ''
    })

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            const response = await api.get('/goals')
            setGoals(response.data.data || [])
        } catch (error) {
            toast.error('Không thể tải mục tiêu tiết kiệm')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/goals', {
                ...formData,
                targetAmount: Number(formData.targetAmount || 0),
                currentAmount: Number(formData.currentAmount || 0)
            })
            toast.success('Đã tạo mục tiêu tiết kiệm')
            setShowModal(false)
            setFormData({ name: '', jarKey: 'LTSS', targetAmount: '', currentAmount: '', targetDate: '', note: '' })
            fetchGoals()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Tạo mục tiêu thất bại')
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mục tiêu tiết kiệm</h1>
                    <p className="text-gray-600 mt-1">Theo dõi các mục tiêu dài hạn như quỹ dự phòng, mua thiết bị, hoặc học tập.</p>
                </div>
                <button className="btn btn-primary flex items-center" onClick={() => setShowModal(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm mục tiêu
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map(goal => {
                    const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
                    return (
                        <div key={goal._id} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{goal.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{goal.jarKey} • {nhanTrangThai[goal.status] || goal.status}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-gray-200 mb-3">
                                <div className="h-3 rounded-full bg-primary-600" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Đã có: {goal.currentAmount.toLocaleString()} VND</span>
                                <span>Mục tiêu: {goal.targetAmount.toLocaleString()} VND</span>
                            </div>
                            {goal.note && <p className="mt-4 text-sm text-gray-600">{goal.note}</p>}
                        </div>
                    )
                })}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tạo mục tiêu mới</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="input" placeholder="Tên mục tiêu" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="input" value={formData.jarKey} onChange={(e) => setFormData({ ...formData, jarKey: e.target.value })}>
                                    <option value="FFA">FFA</option>
                                    <option value="LTSS">LTSS</option>
                                    <option value="EDU">EDU</option>
                                    <option value="PLAY">PLAY</option>
                                    <option value="GIVE">GIVE</option>
                                    <option value="NEC">NEC</option>
                                </select>
                                <input className="input" type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="input" type="number" placeholder="Mục tiêu" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} required />
                                <input className="input" type="number" placeholder="Hiện có" value={formData.currentAmount} onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })} />
                            </div>
                            <textarea className="input min-h-24" placeholder="Ghi chú" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })}></textarea>
                            <div className="flex gap-3">
                                <button type="submit" className="btn btn-primary flex-1">Lưu mục tiêu</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Huỷ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
