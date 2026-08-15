export const nhanDanhMuc = {
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
}

export function hienThiDanhMuc(giaTri) {
    if (!giaTri) return 'Không có danh mục'
    return nhanDanhMuc[giaTri] || giaTri
}

export const nhanMucDoCanhBao = {
    normal: 'Bình thường',
    info: 'Thông tin',
    warning: 'Cảnh báo',
    critical: 'Nghiêm trọng'
}
