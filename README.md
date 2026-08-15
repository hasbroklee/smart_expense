# Smart Expense

Hệ thống quản lý chi tiêu cá nhân full-stack, kết hợp AI phân loại giao dịch, phát hiện chi tiêu bất thường và mô hình tài chính 6 hũ.

## Tổng quan

Project gồm 3 phần chính:

- `ai-service`: dịch vụ AI viết bằng Python/FastAPI, dùng để phân loại giao dịch từ mô tả văn bản
- `backend`: API Node.js/Express kết nối MongoDB, xử lý xác thực, giao dịch, hũ, cảnh báo, mục tiêu và định kỳ
- `frontend`: giao diện React/Vite hiển thị dashboard, giao dịch, 6 hũ, cảnh báo, mục tiêu và giao dịch định kỳ

## Tính năng chính

- Phân loại giao dịch bằng AI từ mô tả nhập tay
- Tự trích xuất số tiền từ câu mô tả
- Quản lý thu nhập và chi tiêu
- Quản lý 6 hũ tài chính: `NEC`, `FFA`, `LTSS`, `EDU`, `PLAY`, `GIVE`
- Phát hiện giao dịch bất thường và tạo cảnh báo
- Dashboard thống kê tổng quan
- Quản lý danh mục giao dịch
- Quản lý mục tiêu tiết kiệm
- Quản lý giao dịch định kỳ
- Giao diện tiếng Việt, chạy local thuận tiện bằng file `.bat`

## Cấu trúc thư mục

```text
smart_expense/
├── ai-service/
│   ├── api/
│   ├── modules/
│   ├── models/
│   ├── run_api.py
│   └── requirements.txt
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── start-ai-service.bat
├── start-backend.bat
├── start-frontend.bat
├── start-all.bat
└── README.md
```

## Công nghệ sử dụng

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Recharts
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT

### AI Service

- Python
- FastAPI
- TF-IDF + Naive Bayes

## Yêu cầu môi trường

- Windows để dùng trực tiếp các file `.bat`
- Node.js runtime khả dụng trên máy
- Python 3.x
- MongoDB Atlas hoặc MongoDB local

Lưu ý: project hiện đã được tối ưu để chạy local bằng các script `.bat` trong repo.

## Cấu hình môi trường

Tạo file `backend/.env` với nội dung mẫu:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db_name>?appName=Cluster0
PORT=3000
NODE_ENV=development
AI_API_URL=http://localhost:8000
JWT_SECRET=your-jwt-secret
```

Nếu bạn chỉ chạy local, frontend hiện gọi API qua proxy `/api`, backend mặc định ở `http://localhost:3000`, AI service ở `http://localhost:8000`.

## Cách chạy project

### Cách nhanh nhất

Chạy file:

```bat
start-all.bat
```

Script này sẽ mở 3 cửa sổ riêng:

- AI service
- Backend
- Frontend

Sau khi khởi động xong:

- Frontend: [http://127.0.0.1:5173/index.html](http://127.0.0.1:5173/index.html)
- Backend health: [http://127.0.0.1:3000/health](http://127.0.0.1:3000/health)
- AI docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Chạy từng phần riêng

#### 1. AI service

```bat
start-ai-service.bat
```

Hoặc thủ công:

```bash
cd ai-service
python run_api.py
```

#### 2. Backend

```bat
start-backend.bat
```

Hoặc thủ công:

```bash
cd backend
npm install
node server.js
```

#### 3. Frontend

```bat
start-frontend.bat
```

Hoặc thủ công:

```bash
cd frontend
npm install
npm run dev
```

## Các màn hình chính

- `/` hoặc `#/`: Tổng quan
- `#/expenses`: Giao dịch
- `#/jars`: 6 hũ tài chính
- `#/alerts`: Cảnh báo
- `#/categories`: Danh mục
- `#/goals`: Mục tiêu tiết kiệm
- `#/recurring`: Giao dịch định kỳ

Frontend đang dùng `HashRouter`, vì vậy khi chạy local đường dẫn sẽ theo dạng `#/route`.

## Giải thích nghiệp vụ

### 1. 6 hũ tài chính

- `NEC`: Nhu cầu thiết yếu
- `FFA`: Tự do tài chính
- `LTSS`: Tiết kiệm dài hạn
- `EDU`: Giáo dục
- `PLAY`: Giải trí
- `GIVE`: Cho đi

Mỗi giao dịch chi tiêu sẽ gắn vào một hũ để theo dõi hạn mức và cấu trúc tài chính cá nhân.

### 2. Mục tiêu tiết kiệm

Phần `Mục tiêu` dùng để theo dõi các đích tiết kiệm như:

- mua laptop
- quỹ dự phòng
- du lịch

Mỗi mục tiêu có:

- tên mục tiêu
- số tiền mục tiêu
- số tiền hiện có
- hũ liên quan
- ngày đích nếu cần

### 3. Giao dịch định kỳ

Phần `Định kỳ` dùng để lưu các khoản lặp lại như:

- lương hàng tháng
- tiền internet
- tiền thuê nhà
- học phí

Mỗi bản ghi có:

- tiêu đề
- mô tả
- số tiền
- loại giao dịch
- danh mục
- tần suất
- ngày chạy tiếp theo

## Seed dữ liệu demo

Backend có script seed dữ liệu mẫu:

```bash
cd backend
node scripts/seedDemo.js
```

Hoặc:

```bash
npm run seed:demo
```

Script hiện tạo 3 tài khoản mẫu:

- `demo@expenseai.local` / `demo_user` / `123456`
- `office.user@expenseai.local` / `office_user` / `123456`
- `freelancer.user@expenseai.local` / `freelancer_user` / `123456`

Mỗi tài khoản có lịch sử giao dịch mẫu để:

- hiển thị dashboard
- có dữ liệu cảnh báo bất thường
- hỗ trợ AI backend học thêm mẫu mô tả giao dịch

## API chính của backend

Một số nhóm API chính:

- `/api/auth`: đăng ký, đăng nhập, hồ sơ
- `/api/expenses`: giao dịch
- `/api/jars`: 6 hũ
- `/api/alerts`: cảnh báo
- `/api/categories`: danh mục
- `/api/goals`: mục tiêu tiết kiệm
- `/api/recurring`: giao dịch định kỳ

Root API:

- [http://localhost:3000/](http://localhost:3000/)

Health check:

- [http://localhost:3000/health](http://localhost:3000/health)

## Luồng AI

Khi tạo giao dịch từ mô tả văn bản:

1. Frontend gửi mô tả lên backend
2. Backend gọi AI service tại `AI_API_URL`
3. AI service dự đoán:
   - loại giao dịch
   - danh mục
   - hũ phù hợp
   - số tiền nếu có trong mô tả
4. Backend lưu kết quả AI vào trường `ai`
5. Backend tiếp tục kiểm tra bất thường và tạo cảnh báo nếu cần

## Kiểm thử nhanh

### Kiểm tra AI service

- Mở [http://localhost:8000/docs](http://localhost:8000/docs)
- Hoặc [http://localhost:8000/health](http://localhost:8000/health)

### Kiểm tra backend

- Mở [http://localhost:3000/health](http://localhost:3000/health)
- Mở [http://localhost:3000/](http://localhost:3000/)

### Kiểm tra frontend

- Mở [http://127.0.0.1:5173/index.html](http://127.0.0.1:5173/index.html)
- Đăng nhập bằng một tài khoản seed

## Xử lý lỗi thường gặp

### Không kết nối được MongoDB

Kiểm tra lại:

- `MONGODB_URI` trong `backend/.env`
- IP/network có cho phép truy cập MongoDB Atlas hay không
- user/password của MongoDB có đúng hay không

### Backend báo không gọi được AI service

Kiểm tra:

- AI service đã chạy ở cổng `8000`
- `AI_API_URL` trong `backend/.env`
- endpoint [http://localhost:8000/health](http://localhost:8000/health)

### Frontend vào route bị lỗi

Project hiện dùng `HashRouter`, nên hãy truy cập theo dạng:

- `http://127.0.0.1:5173/#/goals`
- `http://127.0.0.1:5173/#/recurring`

### Chạy file `.bat` nhưng không lên service

Kiểm tra:

- Node runtime có tồn tại đúng đường dẫn mà file `.bat` đang trỏ tới
- Python runtime có tồn tại đúng đường dẫn mà file `.bat` đang trỏ tới
- port `3000`, `5173`, `8000` có đang bị ứng dụng khác chiếm hay không

## Gợi ý phát triển tiếp

- thêm đồng bộ giao dịch định kỳ tự động bằng cron job
- thêm export Excel/PDF
- thêm biểu đồ theo tuần/tháng/năm
- thêm mô hình AI mạnh hơn cho tiếng Việt
- thêm phân quyền quản trị hoặc chia sẻ tài khoản gia đình

## Ghi chú bảo mật

- Không commit file `.env` thật lên git
- Không để lộ `JWT_SECRET` production
- Không hard-code tài khoản MongoDB production trong mã nguồn

## Tác giả

Project phục vụ bài toán quản lý chi tiêu cá nhân có tích hợp AI và mô hình 6 hũ, đồng thời đã được tinh chỉnh để chạy local thuận tiện trên máy Windows.
