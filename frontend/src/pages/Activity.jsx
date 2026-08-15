import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Activity() {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchActivity()
    }, [])

    const fetchActivity = async () => {
        try {
            const response = await api.get('/activity?limit=30')
            setActivities(response.data.data || [])
        } catch (error) {
            toast.error('Không thể tải activity log')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Hoạt động hệ thống</h1>
                <p className="text-gray-600 mt-1">Lịch sử thao tác gần đây được lưu trong `auditlogs` với TTL 90 ngày.</p>
            </div>

            <div className="card">
                {activities.length > 0 ? (
                    <div className="space-y-3">
                        {activities.map(item => (
                            <div key={item._id} className="rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.action}</p>
                                        <p className="text-sm text-gray-500">{item.entityType} • {item.entityId || 'n/a'}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                                </div>
                                {item.metadata && Object.keys(item.metadata).length > 0 && (
                                    <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">{JSON.stringify(item.metadata, null, 2)}</pre>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa có activity log nào.</p>
                )}
            </div>
        </div>
    )
}
