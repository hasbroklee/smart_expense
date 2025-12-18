# TÀI LIỆU PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
## Hệ thống Quản lý Chi tiêu Cá nhân Thông minh (Smart Personal Expense Management System)

---

## PHẦN 1: GIAI ĐOẠN KHẢO SÁT

### 1.1. Xác định Phạm vi Dự án

#### 1.1.1. Xây mới hay Nâng cấp
- **Loại dự án**: **Xây mới hoàn toàn**
- **Lý do**: 
  - Hệ thống quản lý chi tiêu cá nhân với tích hợp AI chưa tồn tại
  - Cần xây dựng từ đầu với kiến trúc hiện đại (React, Node.js, Python AI)
  - Tích hợp Machine Learning cho phân loại tự động giao dịch
  - Áp dụng mô hình tài chính 6 Jars (NEC, FFA, LTSS, EDU, PLAY, GIVE)

#### 1.1.2. Mục tiêu Dự án
- **Mục tiêu chính**:
  1. Tự động hóa phân loại chi tiêu bằng AI (TF-IDF + Naive Bayes)
  2. Quản lý thu chi theo mô hình 6 Jars
  3. Phát hiện giao dịch bất thường và cảnh báo vượt ngân sách
  4. Cung cấp dashboard thống kê trực quan
  5. Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh)

- **Mục tiêu phụ**:
  1. Trích xuất số tiền tự động từ mô tả văn bản
  2. Phân biệt tự động thu nhập (INCOME) và chi tiêu (EXPENSE)
  3. Hệ thống cảnh báo real-time
  4. Giao diện responsive, thân thiện người dùng

### 1.2. Thời gian Thực hiện

#### 1.2.1. Phân chia Giai đoạn

| Giai đoạn | Nội dung | Thời gian dự kiến | Trạng thái |
|-----------|----------|-------------------|------------|
| **Giai đoạn 1** | Khảo sát và Phân tích | 2 tuần | ✅ Hoàn thành |
| **Giai đoạn 2** | Thiết kế Hệ thống | 2 tuần | ✅ Hoàn thành |
| **Giai đoạn 3** | Phát triển AI Service | 3 tuần | ✅ Hoàn thành |
| **Giai đoạn 4** | Phát triển Backend API | 3 tuần | ✅ Hoàn thành |
| **Giai đoạn 5** | Phát triển Frontend | 3 tuần | ✅ Hoàn thành |
| **Giai đoạn 6** | Tích hợp và Testing | 2 tuần | ✅ Hoàn thành |
| **Giai đoạn 7** | Triển khai và Vận hành | 1 tuần | 🔄 Đang triển khai |

**Tổng thời gian**: **16 tuần** (~4 tháng)

#### 1.2.2. Timeline Chi tiết
- **Tuần 1-2**: Khảo sát nhu cầu, nghiên cứu công nghệ, lập kế hoạch
- **Tuần 3-4**: Thiết kế database, API, UI/UX, kiến trúc hệ thống
- **Tuần 5-7**: Xây dựng AI service (data labeling, preprocessing, classification, anomaly detection)
- **Tuần 8-10**: Xây dựng Backend (models, routes, services, authentication)
- **Tuần 11-13**: Xây dựng Frontend (pages, components, charts, authentication)
- **Tuần 14-15**: Tích hợp, testing, sửa lỗi
- **Tuần 16**: Deploy, documentation, training

### 1.3. Chi phí Dự kiến

#### 1.3.1. Chi phí Phát triển

| Hạng mục | Chi phí (VND) | Ghi chú |
|----------|---------------|---------|
| **Nhân lực** | | |
| - AI/ML Engineer (3 tháng) | 45,000,000 | Phát triển AI service |
| - Backend Developer (3 tháng) | 45,000,000 | Node.js/Express API |
| - Frontend Developer (3 tháng) | 45,000,000 | React/Vite UI |
| - Full-stack Developer (1 tháng) | 20,000,000 | Tích hợp và testing |
| **Tổng nhân lực** | **155,000,000** | |
| **Hạ tầng** | | |
| - MongoDB Atlas (M10) | 2,000,000/tháng | 3 tháng = 6,000,000 |
| - Cloud Server (VPS) | 1,500,000/tháng | 3 tháng = 4,500,000 |
| - Domain & SSL | 500,000 | Một lần |
| **Tổng hạ tầng** | **11,000,000** | |
| **Công cụ & Dịch vụ** | | |
| - IDE Licenses | 2,000,000 | VS Code Pro (nếu cần) |
| - Testing Tools | 1,000,000 | Postman, testing frameworks |
| - Design Tools | 1,500,000 | Figma, Adobe (nếu cần) |
| **Tổng công cụ** | **4,500,000** | |
| **Dự phòng (10%)** | **17,050,000** | |
| **TỔNG CHI PHÍ** | **187,550,000** | ~$7,500 USD |

#### 1.3.2. Chi phí Vận hành Hàng tháng (Sau khi hoàn thành)

| Hạng mục | Chi phí/tháng (VND) |
|----------|---------------------|
| MongoDB Atlas (M10) | 2,000,000 |
| Cloud Server (VPS) | 1,500,000 |
| CDN & Bandwidth | 500,000 |
| Monitoring & Backup | 300,000 |
| **TỔNG** | **4,300,000/tháng** |

### 1.4. Nguồn Nhân lực

#### 1.4.1. Đội ngũ Phát triển

| Vị trí | Số lượng | Kỹ năng yêu cầu | Trách nhiệm |
|--------|----------|-----------------|-------------|
| **AI/ML Engineer** | 1 | Python, scikit-learn, FastAPI, NLP | - Phát triển AI classification service<br>- Training và tối ưu model<br>- Text preprocessing & feature engineering |
| **Backend Developer** | 1 | Node.js, Express, MongoDB, JWT | - Xây dựng RESTful API<br>- Authentication & Authorization<br>- Tích hợp AI service |
| **Frontend Developer** | 1 | React, Vite, Tailwind CSS, Recharts | - Xây dựng UI/UX<br>- Data visualization<br>- State management |
| **Full-stack Developer** | 1 | Full-stack, DevOps | - Tích hợp các module<br>- Testing & QA<br>- Deployment |

#### 1.4.2. Đội ngũ Hỗ trợ (Tùy chọn)

| Vị trí | Số lượng | Trách nhiệm |
|--------|----------|-------------|
| **UI/UX Designer** | 0.5 (part-time) | Thiết kế giao diện, user experience |
| **QA Tester** | 0.5 (part-time) | Testing, bug tracking |
| **DevOps Engineer** | 0.5 (part-time) | CI/CD, monitoring, deployment |

### 1.5. Cơ sở Vật chất

#### 1.5.1. Phần cứng Phát triển

| Thiết bị | Số lượng | Yêu cầu tối thiểu |
|----------|----------|-------------------|
| **Máy tính Phát triển** | 4 | - CPU: Intel i5/AMD Ryzen 5 trở lên<br>- RAM: 16GB trở lên<br>- SSD: 256GB trở lên<br>- OS: Windows 10/11, macOS, hoặc Linux |
| **Máy chủ Test** | 1 | - CPU: 4 vCPU<br>- RAM: 8GB<br>- Storage: 100GB SSD |
| **Mạng Internet** | 4 | - Băng thông: 50Mbps trở lên<br>- Ổn định, độ trễ thấp |

#### 1.5.2. Phần mềm & Công cụ

| Công cụ | Mục đích | Chi phí |
|---------|----------|---------|
| **VS Code** | IDE chính | Miễn phí |
| **Git** | Version control | Miễn phí |
| **Node.js** | Runtime backend/frontend | Miễn phí |
| **Python 3.10+** | AI service | Miễn phí |
| **MongoDB Compass** | Database GUI | Miễn phí |
| **Postman** | API testing | Miễn phí (có bản Pro) |
| **Docker** (tùy chọn) | Containerization | Miễn phí |

### 1.6. Khó khăn và Rủi ro

#### 1.6.1. Khó khăn Kỹ thuật

| Khó khăn | Mô tả | Giải pháp |
|----------|-------|-----------|
| **Tích hợp AI với Backend** | Giao tiếp giữa Python FastAPI và Node.js | Sử dụng HTTP REST API, xử lý async/await, error handling |
| **Xử lý Text Tiếng Việt** | Tiếng Việt có dấu, từ ghép phức tạp | Sử dụng TF-IDF với stopwords tiếng Việt, normalize text |
| **Trích xuất Số tiền** | Nhiều định dạng (150k, 1.5 triệu, $150) | Regex patterns, xử lý đặc biệt cho suffix 'k' |
| **MongoDB Atlas TLS** | Lỗi SSL handshake trên Windows | Thêm `tlsAllowInvalidCertificates: true` (dev), upgrade Node.js |
| **Performance AI Service** | Model loading chậm khi startup | Lazy loading, caching, warm-up models |
| **Real-time Alerts** | Cảnh báo ngay khi có giao dịch bất thường | Background jobs, event-driven architecture |

#### 1.6.2. Rủi ro Dự án

| Rủi ro | Mức độ | Tác động | Biện pháp Giảm thiểu |
|--------|--------|---------|---------------------|
| **Thiếu dữ liệu Training** | Trung bình | Model accuracy thấp | Sử dụng demo data, khuyến khích người dùng nhập dữ liệu |
| **Thay đổi Yêu cầu** | Thấp | Delay timeline | Agile methodology, sprint planning |
| **Vấn đề Bảo mật** | Cao | Lộ thông tin người dùng | JWT authentication, password hashing, HTTPS, input validation |
| **Khả năng Mở rộng** | Trung bình | Hệ thống chậm khi nhiều user | Load balancing, caching, database indexing |
| **Chi phí Vượt ngân sách** | Trung bình | Thiếu kinh phí | Theo dõi chi phí định kỳ, tối ưu hạ tầng |

### 1.7. Trách nhiệm Chủ đầu tư và Đối tác

#### 1.7.1. Trách nhiệm Chủ đầu tư

1. **Cung cấp Tài chính**
   - Thanh toán chi phí phát triển theo tiến độ
   - Cung cấp ngân sách vận hành hàng tháng
   - Dự phòng 10-15% cho rủi ro

2. **Cung cấp Yêu cầu Nghiệp vụ**
   - Mô tả rõ ràng các chức năng cần thiết
   - Phản hồi kịp thời trong quá trình phát triển
   - Chấp nhận và nghiệm thu sản phẩm

3. **Cung cấp Dữ liệu Mẫu** (nếu có)
   - Dữ liệu giao dịch mẫu để training AI
   - Use cases thực tế
   - Feedback từ người dùng thử nghiệm

4. **Hỗ trợ Triển khai**
   - Cung cấp domain (nếu cần)
   - Hỗ trợ marketing, quảng bá sản phẩm
   - Training người dùng cuối

#### 1.7.2. Trách nhiệm Đội ngũ Phát triển (Đối tác)

1. **Phát triển Hệ thống**
   - Thiết kế và xây dựng theo đúng yêu cầu
   - Đảm bảo chất lượng code, testing
   - Tuân thủ timeline đã thỏa thuận

2. **Bảo trì và Hỗ trợ**
   - Sửa lỗi trong thời gian bảo hành (3-6 tháng)
   - Cập nhật tính năng theo yêu cầu
   - Hỗ trợ kỹ thuật cho người dùng

3. **Tài liệu Hóa**
   - Tài liệu kỹ thuật (API docs, database schema)
   - Tài liệu người dùng (user manual)
   - Hướng dẫn triển khai và vận hành

4. **Training**
   - Training cho admin/quản trị viên
   - Hướng dẫn sử dụng cho end-users
   - Knowledge transfer

---

## PHẦN 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 2.1. Tìm hiểu Hoạt động của Tổ chức

#### 2.1.1. Thành phần Tham gia Tổ chức

**Hệ thống Quản lý Chi tiêu Cá nhân** là một hệ thống độc lập, phục vụ người dùng cá nhân. Các thành phần tham gia:

| Thành phần | Vai trò | Mô tả |
|------------|---------|-------|
| **Người dùng (End User)** | Người sử dụng chính | - Đăng ký, đăng nhập<br>- Nhập giao dịch (thu/chi)<br>- Xem thống kê, dashboard<br>- Quản lý hũ tài chính<br>- Xem cảnh báo |
| **Hệ thống AI** | Phân loại tự động | - Phân loại giao dịch<br>- Trích xuất số tiền<br>- Phát hiện bất thường |
| **Hệ thống Backend** | Xử lý nghiệp vụ | - Quản lý dữ liệu<br>- Xác thực người dùng<br>- Tích hợp AI<br>- Tạo cảnh báo |
| **Hệ thống Frontend** | Giao diện người dùng | - Hiển thị thông tin<br>- Tương tác với người dùng<br>- Visualization |

#### 2.1.2. Nhiệm vụ của Tổ chức Thành viên

**A. Người dùng (End User)**
- Quản lý tài chính cá nhân
- Theo dõi thu chi hàng ngày
- Phân bổ ngân sách theo mô hình 6 Jars
- Nhận cảnh báo về giao dịch bất thường

**B. Hệ thống AI Service**
- Xử lý và phân loại mô tả giao dịch
- Trích xuất số tiền từ văn bản
- Phân biệt thu nhập và chi tiêu
- Phát hiện giao dịch bất thường

**C. Hệ thống Backend**
- Quản lý dữ liệu người dùng và giao dịch
- Xác thực và phân quyền
- Tích hợp với AI service
- Tạo và quản lý cảnh báo
- Tính toán thống kê

**D. Hệ thống Frontend**
- Cung cấp giao diện web responsive
- Hiển thị dashboard và biểu đồ
- Xử lý tương tác người dùng
- Quản lý state và routing

#### 2.1.3. Mô tả và Liệt kê Quá trình Các chức năng Chính

**1. Quản lý Người dùng (User Management)**

```
Quy trình:
1. Người dùng đăng ký tài khoản
   → Nhập: username, email, password, fullName
   → Backend: Hash password, lưu vào MongoDB
   → Trả về: JWT token
2. Người dùng đăng nhập
   → Nhập: email/username, password
   → Backend: Verify password, tạo JWT
   → Trả về: JWT token, user info
3. Người dùng xem/cập nhật profile
   → GET/PUT /api/auth/me
   → Cập nhật: fullName, preferences
```

**2. Quản lý Giao dịch (Transaction Management)**

```
Quy trình Tạo Giao dịch:
1. Người dùng nhập mô tả giao dịch
   → Input: description, amount (optional), type (optional)
2. Frontend gửi request đến Backend
   → POST /api/expenses
3. Backend gọi AI Service
   → POST /classify-expense
   → AI trả về: predictedCategory, predictedJarKey, predictedType, confidence, amount
4. Backend kiểm tra Anomaly
   → So sánh với lịch sử, ngân sách
   → Tạo Alert nếu cần
5. Backend lưu vào MongoDB
   → Expense document với đầy đủ thông tin
6. Trả về kết quả cho Frontend
   → Hiển thị thông tin giao dịch đã tạo
```

**3. Phân loại Tự động bằng AI (AI Classification)**

```
Quy trình AI Classification:
1. Nhận mô tả giao dịch
   → Input: description, userId, amount (optional)
2. Text Preprocessing
   → Lowercase, remove punctuation/digits
   → Remove stopwords (VN + EN)
   → TF-IDF vectorization
3. Classification
   → Multinomial Naive Bayes model
   → Predict category
4. Amount Extraction
   → Regex patterns
   → Parse: "150k" → 150000, "$150" → 150, etc.
5. Type Inference
   → Check INCOME categories/keywords
   → Default: EXPENSE
6. Map Category to Jar
   → Category → Jar Key (NEC, FFA, LTSS, EDU, PLAY, GIVE)
7. Trả về kết quả
   → predictedCategory, predictedJarKey, predictedType, confidence, amount
```

**4. Phát hiện Bất thường (Anomaly Detection)**

```
Quy trình Anomaly Detection:
1. Khi có giao dịch mới
   → Input: userId, jarKey, amount, date
2. Lấy lịch sử giao dịch
   → Query MongoDB: 30 ngày gần nhất, cùng jarKey
3. Tính toán thống kê
   → Mean, median, standard deviation
4. So sánh với ngưỡng
   → amount > threshold × mean → ANOMALY
5. Kiểm tra ngân sách
   → So sánh với monthlyLimit của jar
   → Vượt ngân sách → ALERT
6. Tạo Alert (nếu cần)
   → Lưu vào MongoDB
   → Type: ANOMALY hoặc JAR_LIMIT
```

**5. Quản lý Hũ Tài chính (6 Jars Management)**

```
Quy trình Quản lý Hũ:
1. Khởi tạo Hũ mặc định
   → POST /api/jars/initialize
   → Tạo 6 jars: NEC, FFA, LTSS, EDU, PLAY, GIVE
2. Cấu hình Hũ
   → PUT /api/jars/:jarKey
   → Set: monthlyLimit, percentage, color, icon
3. Xem Thống kê Hũ
   → GET /api/jars/:jarKey/stats
   → Tính: totalSpent, remaining, percentageUsed
4. Hiển thị Dashboard
   → Pie chart phân bổ theo hũ
   → Bar chart thu chi theo ngày
```

**6. Hệ thống Cảnh báo (Alert System)**

```
Quy trình Alert:
1. Tạo Alert
   → Khi phát hiện anomaly
   → Khi vượt ngân sách
   → Type: ANOMALY, JAR_LIMIT, BUDGET_LIMIT
2. Lưu vào MongoDB
   → Alert document với metadata
3. Người dùng xem Alert
   → GET /api/alerts
   → GET /api/alerts/unread
4. Đánh dấu đã đọc
   → PUT /api/alerts/:id/read
   → PUT /api/alerts/read-all
```

**7. Thống kê và Báo cáo (Statistics & Reporting)**

```
Quy trình Thống kê:
1. Người dùng xem Dashboard
   → GET /api/expenses/stats/summary
2. Tính toán thống kê
   → totalIncome, totalExpense, net
   → expenseByJar, expenseByCategory
   → daily statistics (thu - chi theo ngày)
3. Hiển thị Visualization
   → Pie chart: Phân bổ theo hũ
   → Bar chart: Thu - chi theo ngày
   → Recent transactions list
```

### 2.2. Phân tích Các Giải pháp Kỹ thuật

#### 2.2.1. Kiến trúc Hệ thống

**Mô hình: 3-Tier Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND TIER                        │
│  React + Vite + Tailwind CSS + Recharts                 │
│  - User Interface                                       │
│  - Client-side routing                                  │
│  - State management (Context API)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼────────────────────────────────────┐
│                   BACKEND TIER                          │
│  Node.js + Express + MongoDB + Mongoose                 │
│  - Business Logic                                       │
│  - Authentication (JWT)                                  │
│  - Data Validation                                      │
│  - API Gateway                                          │
└──────┬──────────────────────────────┬───────────────────┘
       │                              │
       │ HTTP/REST API                │ HTTP/REST API
┌──────▼──────────┐        ┌─────────▼──────────────┐
│   AI SERVICE    │        │    DATABASE TIER        │
│  Python + FastAPI│        │  MongoDB Atlas/Local    │
│  - ML Models    │        │  - User Data            │
│  - Classification│        │  - Expenses             │
│  - Anomaly Det. │        │  - Alerts               │
└─────────────────┘        │  - Jar Configs          │
                           └─────────────────────────┘
```

#### 2.2.2. Giải pháp Công nghệ

**A. Frontend Stack**

| Công nghệ | Phiên bản | Mục đích | Lý do chọn |
|-----------|-----------|----------|------------|
| **React** | 18.x | UI Framework | - Component-based, reusable<br>- Large ecosystem<br>- Good performance |
| **Vite** | 5.x | Build Tool | - Fast HMR (Hot Module Replacement)<br>- Quick build times<br>- Modern ES modules |
| **Tailwind CSS** | 3.x | CSS Framework | - Utility-first, rapid UI development<br>- Responsive design<br>- Customizable |
| **React Router DOM** | 6.x | Routing | - Client-side routing<br>- Protected routes<br>- Navigation |
| **Recharts** | 2.x | Charts | - React-native charting<br>- Responsive charts<br>- Easy to use |
| **Axios** | 1.x | HTTP Client | - Promise-based<br>- Interceptors for JWT<br>- Error handling |
| **React Hot Toast** | 2.x | Notifications | - Beautiful toast messages<br>- Easy integration |

**B. Backend Stack**

| Công nghệ | Phiên bản | Mục đích | Lý do chọn |
|-----------|-----------|----------|------------|
| **Node.js** | 18+ | Runtime | - JavaScript everywhere<br>- Non-blocking I/O<br>- Large ecosystem |
| **Express** | 4.x | Web Framework | - Minimal, flexible<br>- Middleware support<br>- RESTful APIs |
| **MongoDB** | 6.x | Database | - NoSQL, flexible schema<br>- Document-based<br>- Scalable |
| **Mongoose** | 7.x | ODM | - Schema validation<br>- Middleware hooks<br>- Easy queries |
| **JWT (jsonwebtoken)** | 9.x | Authentication | - Stateless auth<br>- Secure token-based<br>- Scalable |
| **bcryptjs** | 2.x | Password Hashing | - Secure password storage<br>- Salt rounds |

**C. AI Service Stack**

| Công nghệ | Phiên bản | Mục đích | Lý do chọn |
|-----------|-----------|----------|------------|
| **Python** | 3.10+ | Language | - Rich ML libraries<br>- Easy text processing |
| **FastAPI** | 0.100+ | Web Framework | - Fast, async<br>- Auto API docs<br>- Type hints |
| **scikit-learn** | 1.3+ | ML Library | - TF-IDF vectorization<br>- Naive Bayes classifier<br>- Model evaluation |
| **pymongo** | 4.x | MongoDB Driver | - Connect to MongoDB<br>- Data export for training |
| **joblib** | 1.3+ | Model Serialization | - Save/load ML models<br>- Efficient |

#### 2.2.3. Giải pháp Tích hợp

**A. Frontend ↔ Backend**
- **Protocol**: HTTP/REST API
- **Data Format**: JSON
- **Authentication**: JWT token trong `Authorization: Bearer <token>` header
- **Error Handling**: Standardized error responses
- **CORS**: Enabled cho cross-origin requests

**B. Backend ↔ AI Service**
- **Protocol**: HTTP/REST API
- **Endpoint**: `POST /classify-expense`
- **Async/Await**: Xử lý bất đồng bộ
- **Error Handling**: Fallback nếu AI service không available
- **Timeout**: 5-10 giây để tránh blocking

**C. Backend ↔ MongoDB**
- **Connection**: Mongoose ODM
- **Connection Pooling**: Tự động quản lý
- **Indexes**: Tối ưu queries (userId, jarKey, date)
- **Transactions**: Cho các operations phức tạp

#### 2.2.4. Giải pháp Bảo mật

| Bảo mật | Giải pháp | Mô tả |
|---------|-----------|-------|
| **Authentication** | JWT | Token-based, stateless, expires sau 7 ngày |
| **Password Hashing** | bcrypt | Salt rounds = 10, one-way hash |
| **HTTPS** | SSL/TLS | Encrypt data in transit |
| **Input Validation** | Mongoose schema, Pydantic | Validate data trước khi lưu |
| **CORS** | Express middleware | Chỉ cho phép domain được phép |
| **Rate Limiting** | (Có thể thêm) | Giới hạn số request/giờ |

#### 2.2.5. Giải pháp Hiệu năng

| Tối ưu | Giải pháp | Mô tả |
|--------|-----------|-------|
| **Database Indexing** | MongoDB indexes | Index trên userId, jarKey, date, type |
| **Model Caching** | AI Service | Load models một lần, reuse |
| **Lazy Loading** | Frontend | Load components khi cần |
| **Pagination** | API | Limit số records trả về |
| **Connection Pooling** | Mongoose | Tái sử dụng connections |

### 2.3. Mô hình Dữ liệu

#### 2.3.1. Mô hình Quản trị Dữ liệu

**A. Database: MongoDB (NoSQL Document Database)**

**Lý do chọn MongoDB:**
- Schema linh hoạt, dễ mở rộng
- Document-based, phù hợp với dữ liệu nested (AI results, metadata)
- Hỗ trợ indexing tốt
- Scalable, có thể sharding

**B. Collections (Tables tương đương)**

1. **users** - Thông tin người dùng
2. **expenses** - Giao dịch (thu/chi)
3. **jarconfigs** - Cấu hình hũ tài chính
4. **alerts** - Cảnh báo

#### 2.3.2. Schema Chi tiết

**A. User Schema**

```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  preferences: {
    currency: String (VND/USD/EUR),
    language: String (vi/en),
    monthlyBudget: Number
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

**B. Expense Schema**

```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  description: String,
  amount: Number,
  type: String (EXPENSE/INCOME, indexed),
  category: String (required if type=EXPENSE),
  jarKey: String (NEC/FFA/LTSS/EDU/PLAY/GIVE, indexed),
  date: Date (indexed),
  ai: {
    predictedCategory: String,
    predictedJarKey: String,
    predictedType: String,
    confidence: Number (0-1),
    extractedAmount: Number,
    classifiedAt: Date
  },
  anomaly: {
    isAnomaly: Boolean,
    reasons: [String],
    level: String (normal/info/warning/critical),
    message: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**C. JarConfig Schema**

```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  jarKey: String (NEC/FFA/LTSS/EDU/PLAY/GIVE, indexed),
  jarName: String,
  description: String,
  monthlyLimit: Number,
  percentage: Number (0-100),
  color: String (hex),
  icon: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
// Compound index: {userId: 1, jarKey: 1} (unique)
```

**D. Alert Schema**

```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  expenseId: ObjectId (ref: Expense),
  type: String (ANOMALY/JAR_LIMIT/BUDGET_LIMIT/SYSTEM/INFO, indexed),
  level: String (normal/info/warning/critical, indexed),
  title: String,
  message: String,
  metadata: {
    jarKey: String,
    amount: Number,
    limit: Number,
    currentTotal: Number,
    overage: Number
  },
  isRead: Boolean (indexed),
  readAt: Date,
  createdAt: Date (indexed)
}
// Compound index: {userId: 1, isRead: 1, createdAt: -1}
```

#### 2.3.3. Relationships

```
User (1) ──< (N) Expense
User (1) ──< (N) JarConfig
User (1) ──< (N) Alert
Expense (1) ──< (0..1) Alert (via expenseId)
```

#### 2.3.4. Indexes

| Collection | Index | Mục đích |
|------------|-------|----------|
| **users** | `username: 1` (unique) | Fast login lookup |
| **users** | `email: 1` (unique) | Fast login lookup |
| **expenses** | `userId: 1, date: -1` | Fast user expenses query |
| **expenses** | `userId: 1, jarKey: 1` | Fast jar statistics |
| **expenses** | `userId: 1, type: 1` | Fast income/expense filter |
| **jarconfigs** | `userId: 1, jarKey: 1` (unique) | One jar per user |
| **alerts** | `userId: 1, isRead: 1, createdAt: -1` | Fast unread alerts |

### 2.4. Mô hình Nghiệp vụ và Hệ thống

#### 2.4.1. Mô hình Nghiệp vụ (Business Model)

**A. Mô hình 6 Jars (6 Jars Financial Model)**

```
Tổng Thu nhập = 100%

┌─────────────────────────────────────────┐
│  NEC (Necessities) - 55%                │
│  Nhu cầu thiết yếu: ăn uống, nhà ở,    │
│  đi lại, y tế                           │
├─────────────────────────────────────────┤
│  FFA (Financial Freedom Account) - 10%  │
│  Tự do tài chính: đầu tư, tiết kiệm    │
├─────────────────────────────────────────┤
│  LTSS (Long Term Savings) - 10%        │
│  Tiết kiệm dài hạn: mua nhà, xe,       │
│  nghỉ hưu                               │
├─────────────────────────────────────────┤
│  EDU (Education) - 10%                  │
│  Giáo dục: học tập, phát triển bản thân│
├─────────────────────────────────────────┤
│  PLAY (Play) - 10%                      │
│  Giải trí: du lịch, sở thích, vui chơi  │
├─────────────────────────────────────────┤
│  GIVE (Give) - 5%                       │
│  Cho đi: từ thiện, quà tặng, giúp đỡ    │
└─────────────────────────────────────────┘
```

**B. Quy trình Nghiệp vụ Chính**

```
1. Người dùng nhận Thu nhập
   → Nhập: description, amount, type=INCOME
   → AI phân loại (nếu cần)
   → Lưu vào database

2. Người dùng Chi tiêu
   → Nhập: description, amount (optional)
   → AI tự động:
     - Phân loại category
     - Gán jarKey (NEC/FFA/LTSS/EDU/PLAY/GIVE)
     - Trích xuất amount (nếu chưa có)
     - Phân biệt INCOME/EXPENSE
   → Kiểm tra Anomaly
   → Kiểm tra ngân sách hũ
   → Tạo Alert nếu cần
   → Lưu vào database

3. Người dùng xem Thống kê
   → Dashboard hiển thị:
     - Tổng thu, tổng chi, số dư
     - Phân bổ theo hũ (Pie chart)
     - Thu - chi theo ngày (Bar chart)
     - Giao dịch gần đây
   → Có thể filter theo tháng, năm

4. Hệ thống Cảnh báo
   → Khi phát hiện giao dịch bất thường
   → Khi vượt ngân sách hũ
   → Hiển thị trong Alerts page
   → Người dùng đánh dấu đã đọc
```

#### 2.4.2. Mô hình Hệ thống (System Model)

**A. Use Case Diagram** (Đã có trong `ai-service/USE_CASE_DIAGRAM.md`)

**B. Sequence Diagram - Tạo Giao dịch**

```
User          Frontend         Backend          AI Service      MongoDB
 │                │                │                │              │
 │─Nhập giao dịch─>│                │                │              │
 │                │─POST /expenses─>│                │              │
 │                │                │─POST /classify─>│            │
 │                │                │                │─Process text─>│
 │                │                │                │─Predict──────>│
 │                │                │<─Result────────│              │
 │                │                │─Check Anomaly──>│              │
 │                │                │─Query History──>│              │
 │                │                │<─History────────│              │
 │                │                │─Create Alert───>│              │
 │                │                │─Save Expense──>│              │
 │                │                │<─Saved──────────│              │
 │                │<─Response──────│                │              │
 │<─Hiển thị───────│                │                │              │
```

**C. Component Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
├─────────────────────────────────────────────────────────┤
│  Pages:                                                  │
│  - Login, Register                                       │
│  - Dashboard (Stats, Charts)                             │
│  - Expenses (CRUD)                                        │
│  - Jars (6 Jars Management)                              │
│  - Alerts (Notifications)                                │
│                                                          │
│  Components:                                             │
│  - Layout (Sidebar, Navigation)                          │
│  - Charts (PieChart, BarChart)                          │
│                                                          │
│  Services:                                               │
│  - api.js (Axios client)                                 │
│  - AuthContext (State management)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                 │
│  - /api/auth (Register, Login, Profile)                 │
│  - /api/expenses (CRUD, Stats)                           │
│  - /api/jars (Config, Stats)                             │
│  - /api/alerts (List, Read, Delete)                     │
│                                                          │
│  Services:                                               │
│  - aiService.js (Call AI API)                            │
│  - anomalyService.js (Detect anomalies)                 │
│                                                          │
│  Middleware:                                             │
│  - auth.js (JWT verification)                            │
│                                                          │
│  Models:                                                 │
│  - User, Expense, JarConfig, Alert                       │
└──────┬──────────────────────────────┬────────────────────┘
       │                              │
       │ HTTP/REST                    │ Mongoose
┌──────▼──────────┐        ┌─────────▼──────────────┐
│   AI SERVICE    │        │      MONGODB            │
│  (Python/FastAPI)│        │  - users                │
│                 │        │  - expenses             │
│  Modules:       │        │  - jarconfigs          │
│  - classification│        │  - alerts               │
│  - preprocessing │        │                         │
│  - anomaly_det. │        │                         │
│                 │        │                         │
│  API:           │        │                         │
│  - /classify    │        │                         │
│  - /health      │        │                         │
└─────────────────┘        └─────────────────────────┘
```

#### 2.4.3. Đo lường Rủi ro từ Mô hình Hoạt động

**A. Rủi ro Nghiệp vụ**

| Rủi ro | Mô tả | Tác động | Giải pháp |
|--------|-------|----------|-----------|
| **Dữ liệu Không chính xác** | Người dùng nhập sai | Thống kê sai | Validation, AI gợi ý, cho phép sửa |
| **Vượt Ngân sách** | Chi tiêu quá mức | Tài chính cá nhân | Cảnh báo real-time, giới hạn hũ |
| **Mất Dữ liệu** | Database lỗi | Mất lịch sử giao dịch | Backup định kỳ, replication |

**B. Rủi ro Kỹ thuật**

| Rủi ro | Mô tả | Tác động | Giải pháp |
|--------|-------|----------|-----------|
| **AI Service Down** | FastAPI không hoạt động | Không phân loại được | Fallback: cho phép nhập thủ công |
| **Database Slow** | Query chậm | UX kém | Indexing, pagination, caching |
| **Security Breach** | Lộ thông tin | Rủi ro bảo mật | JWT, HTTPS, input validation |
| **Scalability** | Nhiều user cùng lúc | Hệ thống chậm | Load balancing, horizontal scaling |

### 2.5. Thiết kế Chi tiết

#### 2.5.1. Thiết kế Cơ sở Dữ liệu

**A. ERD (Entity Relationship Diagram)**

```
┌─────────────┐
│    USER     │
│─────────────│
│ _id (PK)    │
│ username    │
│ email       │
│ password    │
│ fullName    │
│ preferences │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────┐         ┌──────────────┐
│   EXPENSE   │         │  JARCONFIG   │
│─────────────│         │──────────────│
│ _id (PK)    │         │ _id (PK)     │
│ userId (FK) │         │ userId (FK)  │
│ description │         │ jarKey       │
│ amount      │         │ monthlyLimit │
│ type        │         │ percentage   │
│ category    │         └──────────────┘
│ jarKey      │
│ date        │
│ ai {...}    │
│ anomaly {...}│
└──────┬──────┘
       │ 1
       │
       │ 0..1
┌──────▼──────┐
│   ALERT    │
│─────────────│
│ _id (PK)   │
│ userId (FK)│
│ expenseId  │
│ type       │
│ level      │
│ title      │
│ message    │
│ isRead     │
└────────────┘
```

**B. Database Indexes Strategy**

```javascript
// Users collection
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Expenses collection
db.expenses.createIndex({ userId: 1, date: -1 });
db.expenses.createIndex({ userId: 1, jarKey: 1 });
db.expenses.createIndex({ userId: 1, type: 1 });
db.expenses.createIndex({ userId: 1, createdAt: -1 });

// JarConfigs collection
db.jarconfigs.createIndex({ userId: 1, jarKey: 1 }, { unique: true });

// Alerts collection
db.alerts.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.alerts.createIndex({ userId: 1, type: 1, createdAt: -1 });
```

#### 2.5.2. Thiết kế Các Chức năng

**A. API Endpoints Design**

**Authentication APIs:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `PUT /api/auth/me` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

**Expense APIs:**
- `POST /api/expenses` - Tạo giao dịch (với AI classification)
- `GET /api/expenses` - Lấy danh sách (có filter, pagination)
- `GET /api/expenses/:id` - Lấy chi tiết
- `PUT /api/expenses/:id` - Cập nhật
- `DELETE /api/expenses/:id` - Xóa
- `GET /api/expenses/stats/summary` - Thống kê tổng hợp

**Jar APIs:**
- `GET /api/jars` - Lấy tất cả hũ của user
- `POST /api/jars/initialize` - Khởi tạo 6 hũ mặc định
- `PUT /api/jars/:jarKey` - Cập nhật cấu hình hũ
- `GET /api/jars/:jarKey/stats` - Thống kê hũ

**Alert APIs:**
- `GET /api/alerts` - Lấy tất cả alerts
- `GET /api/alerts/unread` - Lấy alerts chưa đọc
- `PUT /api/alerts/:id/read` - Đánh dấu đã đọc
- `PUT /api/alerts/read-all` - Đánh dấu tất cả đã đọc
- `DELETE /api/alerts/:id` - Xóa alert

**B. Business Logic Design**

**1. Expense Creation Flow:**
```
Input: {description, amount?, type?, category?, jarKey?}
↓
1. Validate input
2. If type not provided → Call AI to infer
3. If category/jarKey not provided → Call AI to classify
4. If amount not provided → Extract from description (AI)
5. Check anomaly (if type=EXPENSE)
6. Check budget limit (if type=EXPENSE)
7. Create alert if needed
8. Save to database
9. Return result
```

**2. Anomaly Detection Logic:**
```
Input: {userId, jarKey, amount, date}
↓
1. Query expenses: last 30 days, same jarKey, same user
2. Calculate: mean, median, stdDev
3. If amount > threshold × mean → ANOMALY
4. Check if amount > 3×stdDev → ANOMALY
5. Return: {isAnomaly, reasons, level, message}
```

**3. Budget Check Logic:**
```
Input: {userId, jarKey, amount}
↓
1. Get jarConfig: monthlyLimit
2. Get current month total: sum(expenses where jarKey, month=current)
3. If (currentTotal + amount) > monthlyLimit → ALERT
4. Calculate: overage = (currentTotal + amount) - monthlyLimit
5. Create alert: type=JAR_LIMIT, level=warning/critical
```

#### 2.5.3. Thiết kế Giao diện

**A. UI/UX Design Principles**

1. **Đơn giản, dễ sử dụng**: Giao diện trực quan, ít bước thao tác
2. **Responsive**: Hoạt động tốt trên mobile, tablet, desktop
3. **Thống nhất**: Màu sắc, font chữ, spacing nhất quán
4. **Phản hồi nhanh**: Loading states, error handling rõ ràng

**B. Page Layouts**

**1. Login/Register Pages:**
- Form đơn giản: username/email, password
- Validation real-time
- Error messages rõ ràng
- Link chuyển đổi giữa Login/Register

**2. Dashboard:**
- **Left Column:**
  - Pie Chart: Phân bổ theo hũ
  - Bar Chart: Thu - chi theo ngày trong tháng
- **Right Column:**
  - Recent Transactions (5 giao dịch gần nhất)
  - Quick Stats: Tổng thu, tổng chi, số dư
- **Top:**
  - Header với user info, logout
  - Navigation tabs

**3. Expenses Page:**
- **Top:**
  - Form tạo giao dịch mới
  - Filter: type, jarKey, date range
- **Table:**
  - Columns: Date, Description, Amount, Type, Category, Jar, Actions
  - Pagination
  - Sort by date (newest first)

**4. Jars Page:**
- **6 Jar Cards:**
  - Jar name với abbreviation (NEC, FFA, ...)
  - Progress bar: % used / monthlyLimit
  - Total spent, remaining
  - Color-coded
- **Edit button** để cấu hình monthlyLimit

**5. Alerts Page:**
- **List of Alerts:**
  - Unread alerts highlighted
  - Type badge (ANOMALY, JAR_LIMIT, ...)
  - Level indicator (info, warning, critical)
  - Timestamp
  - Mark as read button

**C. Color Scheme**

```javascript
// Jar Colors
NEC: '#e74c3c' (Red)
FFA: '#3498db' (Blue)
LTSS: '#2ecc71' (Green)
EDU: '#9b59b6' (Purple)
PLAY: '#f39c12' (Orange)
GIVE: '#e67e22' (Dark Orange)

// UI Colors
Primary: '#3498db'
Success: '#2ecc71'
Warning: '#f39c12'
Danger: '#e74c3c'
Background: '#f8f9fa'
Text: '#2c3e50'
```

#### 2.5.4. Thiết kế An toàn Hệ thống

**A. Authentication & Authorization**

1. **JWT Token:**
   - Secret key: `JWT_SECRET` (env variable)
   - Expires: 7 days
   - Payload: `{userId, username, email}`
   - Stored: Frontend localStorage

2. **Password Security:**
   - Min length: 6 characters
   - Hashed với bcrypt (salt rounds: 10)
   - Never return password trong API response

3. **Protected Routes:**
   - Middleware `authenticate` kiểm tra JWT
   - Frontend: Protected routes với `AuthContext`
   - Redirect to login nếu chưa authenticated

**B. Input Validation**

1. **Backend:**
   - Mongoose schema validation
   - Express validator middleware
   - Sanitize input (trim, lowercase email)

2. **Frontend:**
   - Form validation trước khi submit
   - Type checking (number, string, date)

**C. Data Protection**

1. **HTTPS:** Encrypt data in transit
2. **Environment Variables:** Sensitive data (JWT_SECRET, MONGODB_URI) trong `.env`
3. **CORS:** Chỉ cho phép domain được phép
4. **Rate Limiting:** (Có thể thêm) Giới hạn requests/giờ

#### 2.5.5. Thiết kế Phân công và Mô tả Nghiệp vụ

**A. Phân công Công việc**

| Module | Người phụ trách | Trách nhiệm |
|--------|-----------------|-------------|
| **AI Service** | AI/ML Engineer | - Phát triển classification model<br>- Text preprocessing<br>- Anomaly detection<br>- API endpoints |
| **Backend API** | Backend Developer | - RESTful APIs<br>- Authentication<br>- Business logic<br>- Database models |
| **Frontend UI** | Frontend Developer | - React components<br>- Pages & routing<br>- Charts & visualization<br>- State management |
| **Integration** | Full-stack Developer | - Tích hợp các module<br>- Testing<br>- Deployment |

**B. Mô tả Nghiệp vụ Chi tiết**

**1. Nghiệp vụ: Tạo Giao dịch**

**Actor:** Người dùng

**Preconditions:**
- Người dùng đã đăng nhập
- AI service đang hoạt động (hoặc có thể fallback)

**Main Flow:**
1. Người dùng vào trang Expenses
2. Nhập mô tả giao dịch (bắt buộc)
3. (Tùy chọn) Nhập số tiền, loại giao dịch, category, jarKey
4. Click "Thêm giao dịch"
5. Frontend gửi POST /api/expenses
6. Backend gọi AI service để phân loại (nếu thiếu thông tin)
7. Backend kiểm tra anomaly và budget
8. Backend lưu vào database
9. Frontend hiển thị thông báo thành công
10. Cập nhật danh sách giao dịch

**Alternative Flows:**
- **A1:** AI service không available
  - Backend cho phép nhập thủ công category, jarKey
- **A2:** Phát hiện anomaly
  - Tạo alert, hiển thị cảnh báo cho user
- **A3:** Vượt ngân sách
  - Tạo alert, hiển thị cảnh báo

**Postconditions:**
- Giao dịch được lưu vào database
- Alert được tạo (nếu cần)
- Dashboard được cập nhật

---

**2. Nghiệp vụ: Xem Thống kê**

**Actor:** Người dùng

**Preconditions:**
- Người dùng đã đăng nhập
- Có ít nhất một giao dịch trong database

**Main Flow:**
1. Người dùng vào Dashboard
2. Frontend gọi GET /api/expenses/stats/summary
3. Backend tính toán:
   - totalIncome, totalExpense, net
   - expenseByJar, expenseByCategory
   - daily statistics
4. Backend trả về JSON
5. Frontend hiển thị:
   - Pie chart: Phân bổ theo hũ
   - Bar chart: Thu - chi theo ngày
   - Recent transactions

**Postconditions:**
- Dashboard hiển thị thống kê chính xác

---

**3. Nghiệp vụ: Quản lý Hũ Tài chính**

**Actor:** Người dùng

**Preconditions:**
- Người dùng đã đăng nhập

**Main Flow:**
1. Người dùng vào trang Jars
2. Nếu chưa có hũ → Click "Khởi tạo 6 Hũ"
3. Backend tạo 6 jarConfigs mặc định
4. Người dùng xem danh sách 6 hũ
5. Click "Cấu hình" trên một hũ
6. Nhập monthlyLimit
7. Backend cập nhật jarConfig
8. Frontend hiển thị progress bar với limit mới

**Postconditions:**
- 6 hũ được khởi tạo (nếu chưa có)
- monthlyLimit được cập nhật

---

## KẾT LUẬN

Tài liệu này đã trình bày đầy đủ:

1. **Giai đoạn Khảo sát:**
   - Xác định phạm vi, thời gian, chi phí, nhân lực, cơ sở vật chất
   - Phân tích khó khăn, rủi ro, trách nhiệm

2. **Giai đoạn Phân tích và Thiết kế:**
   - Tìm hiểu hoạt động tổ chức, thành phần tham gia
   - Phân tích giải pháp kỹ thuật
   - Thiết kế mô hình dữ liệu
   - Mô hình nghiệp vụ và hệ thống
   - Thiết kế chi tiết: database, chức năng, giao diện, bảo mật, phân công

Hệ thống đã được thiết kế với kiến trúc hiện đại, có khả năng mở rộng và bảo mật tốt, sẵn sàng cho giai đoạn phát triển và triển khai.

---

**Tài liệu này được tạo bởi:** Đội ngũ Phát triển Hệ thống Quản lý Chi tiêu Cá nhân Thông minh  
**Ngày:** 2024  
**Phiên bản:** 1.0

