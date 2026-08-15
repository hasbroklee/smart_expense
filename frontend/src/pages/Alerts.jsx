import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline'

export default function Alerts() {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAlerts()
    }, [])

    const fetchAlerts = async () => {
        try {
            const response = await api.get('/alerts')
            setAlerts(response.data.data)
        } catch (error) {
            toast.error('Lấy danh sách cảnh báo thất bại')
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id) => {
        try {
            await api.put(`/alerts/${id}/read`, {})
            toast.success('Đã đánh dấu cảnh báo là đã đọc')
            fetchAlerts()
        } catch (error) {
            toast.error('Không thể đánh dấu cảnh báo là đã đọc')
        }
    }

    const markAllAsRead = async () => {
        try {
            await api.put('/alerts/read-all', {})
            toast.success('Đã đánh dấu tất cả cảnh báo là đã đọc')
            fetchAlerts()
        } catch (error) {
            toast.error('Không thể đánh dấu tất cả cảnh báo là đã đọc')
        }
    }

    const deleteAlert = async (id) => {
        try {
            await api.delete(`/alerts/${id}`)
            toast.success('Đã xoá cảnh báo')
            fetchAlerts()
        } catch (error) {
            toast.error('Không thể xoá cảnh báo')
        }
    }

    const getLevelIcon = (level) => {
        switch (level) {
            case 'critical':
                return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            case 'warning':
                return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            default:
                return <InformationCircleIcon className="w-6 h-6 text-blue-600" />
        }
    }

    const getLevelColor = (level) => {
        switch (level) {
            case 'critical':
                return 'bg-red-50 border-red-200'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200'
            case 'info':
                return 'bg-blue-50 border-blue-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    const unreadCount = alerts.filter(a => !a.isRead).length

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cảnh báo</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} cảnh báo chưa đọc`
                            : 'Bạn đã xem hết tất cả cảnh báo.'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="btn btn-secondary"
                    >
                        Đánh dấu đã đọc tất cả
                    </button>
                )}
            </div>

            {alerts.length > 0 ? (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`card border-l-4 ${getLevelColor(alert.level)} ${!alert.isRead ? 'shadow-md' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="mt-1">{getLevelIcon(alert.level)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                            {!alert.isRead && (
                                                <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                                                    Mới
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 mb-2">{alert.message}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>{format(new Date(alert.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                                            {alert.metadata?.jarKey && (
                                                <span className="px-2 py-1 bg-gray-200 rounded">
                                                    {alert.metadata.jarKey}
                                                </span>
                                            )}
                                            {alert.metadata?.amount && (
                                                <span>{alert.metadata.amount.toLocaleString()} VND</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {!alert.isRead && (
                                        <button
                                            onClick={() => markAsRead(alert._id)}
                                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                            title="Đánh dấu đã đọc"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteAlert(alert._id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                        title="Xoá"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-12">
                    <InformationCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Không có cảnh báo nào</p>
                    <p className="text-gray-400 text-sm mt-2">Bạn đã xem hết tất cả cảnh báo.</p>
                </div>
            )}
        </div>
    )
}

