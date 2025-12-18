# TỔNG QUAN HỆ THỐNG QUẢN LÝ CHI TIÊU CÁ NHÂN THÔNG MINH
## Smart Personal Expense Management System

---

## 1. GIỚI THIỆU

### 1.1. Tổng quan Hệ thống

**Hệ thống Quản lý Chi tiêu Cá nhân Thông minh** (Smart Personal Expense Management System) là một giải pháp toàn diện được xây dựng để giúp người dùng quản lý tài chính cá nhân một cách hiệu quả và thông minh. Hệ thống tích hợp công nghệ **Trí tuệ Nhân tạo (AI)** và **Machine Learning** để tự động phân loại giao dịch, phát hiện các giao dịch bất thường, và hỗ trợ người dùng trong việc quản lý ngân sách theo mô hình tài chính **6 Jars** (6 Hũ Tài chính).

### 1.2. Mục đích và Phạm vi

**Mục đích:**
- Tự động hóa quá trình phân loại và quản lý giao dịch tài chính cá nhân
- Cung cấp công cụ hỗ trợ quyết định tài chính thông minh
- Giúp người dùng theo dõi và kiểm soát chi tiêu hiệu quả
- Phát hiện sớm các giao dịch bất thường và cảnh báo vượt ngân sách

**Phạm vi ứng dụng:**
- Quản lý thu nhập và chi tiêu cá nhân
- Phân loại tự động giao dịch theo danh mục
- Quản lý ngân sách theo mô hình 6 Jars
- Thống kê và báo cáo tài chính
- Cảnh báo và thông báo real-time

### 1.3. Đối tượng Sử dụng

- **Người dùng cá nhân**: Cá nhân muốn quản lý tài chính cá nhân một cách có hệ thống
- **Gia đình**: Quản lý chi tiêu gia đình, phân bổ ngân sách
- **Sinh viên**: Theo dõi chi tiêu hàng ngày, học cách quản lý tài chính
- **Người làm việc tự do**: Quản lý thu nhập và chi tiêu không đều

### 1.4. Kiến trúc Tổng thể

Hệ thống được xây dựng theo kiến trúc **3-Tier** hiện đại:

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + Vite)          │
│  - User Interface & Visualization       │
│  - Client-side Routing                   │
│  - State Management                      │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│      BACKEND (Node.js + Express)         │
│  - Business Logic                        │
│  - Authentication (JWT)                 │
│  - API Gateway                           │
└──────┬──────────────────┬───────────────┘
       │                  │
       │ HTTP/REST        │ Mongoose ODM
┌──────▼──────────┐  ┌────▼──────────────┐
│  AI SERVICE     │  │   MONGODB         │
│ (Python/FastAPI)│  │  - Users          │
│ - ML Models     │  │  - Expenses       │
│ - Classification│  │  - Alerts         │
│ - Anomaly Det. │  │  - JarConfigs     │
└─────────────────┘  └───────────────────┘
```

### 1.5. Công nghệ Sử dụng

**Frontend:**
- React 18.x - UI Framework
- Vite 5.x - Build Tool
- Tailwind CSS 3.x - Styling
- Recharts 2.x - Data Visualization
- React Router DOM 6.x - Routing

**Backend:**
- Node.js 18+ - Runtime
- Express 4.x - Web Framework
- MongoDB 6.x - Database
- Mongoose 7.x - ODM
- JWT - Authentication

**AI Service:**
- Python 3.10+ - Language
- FastAPI 0.100+ - Web Framework
- scikit-learn 1.3+ - Machine Learning
- TF-IDF + Naive Bayes - Classification

---

## 2. ĐẶT VẤN ĐỀ BÀI TOÁN

### 2.1. Vấn đề Thực tế

Trong cuộc sống hiện đại, việc quản lý tài chính cá nhân trở nên ngày càng phức tạp và quan trọng. Người dùng thường gặp các vấn đề sau:

#### 2.1.1. Quản lý Chi tiêu Thủ công

- **Vấn đề**: Người dùng phải tự ghi chép và phân loại từng giao dịch một cách thủ công, tốn nhiều thời gian và dễ sai sót.
- **Hậu quả**: 
  - Mất nhiều thời gian cho việc nhập liệu
  - Dữ liệu không chính xác do nhầm lẫn
  - Khó theo dõi lịch sử giao dịch dài hạn

#### 2.1.2. Thiếu Công cụ Phân tích Thông minh

- **Vấn đề**: Các ứng dụng quản lý chi tiêu truyền thống chỉ lưu trữ dữ liệu mà không có khả năng phân tích và đưa ra gợi ý thông minh.
- **Hậu quả**:
  - Không thể tự động phân loại giao dịch
  - Không phát hiện được các giao dịch bất thường
  - Thiếu cảnh báo khi vượt ngân sách

#### 2.1.3. Khó Khăn trong Việc Phân bổ Ngân sách

- **Vấn đề**: Người dùng không biết cách phân bổ thu nhập một cách hợp lý, dẫn đến chi tiêu không kiểm soát.
- **Hậu quả**:
  - Chi tiêu quá mức vào các khoản không cần thiết
  - Không có kế hoạch tiết kiệm
  - Thiếu cân bằng giữa các nhu cầu khác nhau

#### 2.1.4. Thiếu Cảnh báo và Nhắc nhở

- **Vấn đề**: Không có hệ thống cảnh báo khi có giao dịch bất thường hoặc vượt ngân sách.
- **Hậu quả**:
  - Phát hiện muộn các vấn đề tài chính
  - Không kịp điều chỉnh chi tiêu
  - Rủi ro tài chính cao

### 2.2. Nhu cầu Giải quyết

Từ các vấn đề trên, hệ thống cần giải quyết các nhu cầu sau:

1. **Tự động hóa Phân loại Giao dịch**
   - Tự động nhận diện và phân loại giao dịch từ mô tả văn bản
   - Hỗ trợ cả tiếng Việt và tiếng Anh
   - Trích xuất số tiền tự động từ mô tả

2. **Quản lý Ngân sách Thông minh**
   - Áp dụng mô hình 6 Jars để phân bổ ngân sách
   - Theo dõi chi tiêu theo từng hũ
   - Cảnh báo khi vượt ngân sách

3. **Phát hiện Bất thường**
   - Tự động phát hiện giao dịch bất thường dựa trên lịch sử
   - Cảnh báo real-time khi có giao dịch đáng nghi

4. **Thống kê và Báo cáo**
   - Dashboard trực quan với biểu đồ
   - Thống kê theo thời gian, danh mục, hũ
   - Xuất báo cáo chi tiết

5. **Trải nghiệm Người dùng Tốt**
   - Giao diện đẹp, dễ sử dụng
   - Responsive trên mọi thiết bị
   - Tốc độ phản hồi nhanh

### 2.3. Mục tiêu Nghiên cứu

Dự án này nhằm mục tiêu:

1. **Nghiên cứu và Áp dụng AI/ML**
   - Áp dụng TF-IDF và Naive Bayes để phân loại văn bản tiếng Việt
   - Xây dựng hệ thống phát hiện bất thường dựa trên thống kê
   - Tối ưu hóa độ chính xác của model

2. **Xây dựng Hệ thống Toàn diện**
   - Kiến trúc hiện đại, có khả năng mở rộng
   - Tích hợp nhiều công nghệ (React, Node.js, Python)
   - Đảm bảo hiệu năng và bảo mật

3. **Cải thiện Trải nghiệm Người dùng**
   - Giao diện trực quan, dễ sử dụng
   - Tự động hóa tối đa các thao tác
   - Phản hồi nhanh, real-time

### 2.4. Ý nghĩa Thực tiễn

Hệ thống này có ý nghĩa thực tiễn:

- **Đối với Người dùng**: 
  - Tiết kiệm thời gian quản lý tài chính
  - Cải thiện khả năng kiểm soát chi tiêu
  - Hỗ trợ đưa ra quyết định tài chính tốt hơn

- **Đối với Nghiên cứu**:
  - Ứng dụng AI/ML vào bài toán thực tế
  - Nghiên cứu xử lý ngôn ngữ tự nhiên tiếng Việt
  - Mô hình hóa và giải quyết bài toán quản lý tài chính

- **Đối với Xã hội**:
  - Nâng cao ý thức quản lý tài chính cá nhân
  - Giảm thiểu rủi ro tài chính
  - Hỗ trợ giáo dục tài chính

---

## 3. PHÂN TÍCH CÁC TÍNH NĂNG VÀ GIẢI PHÁP

### 3.1. Tính năng Chính

#### 3.1.1. Quản lý Người dùng và Xác thực

**Tính năng:**
- Đăng ký tài khoản mới
- Đăng nhập/Đăng xuất
- Quản lý thông tin cá nhân
- Đổi mật khẩu
- Xác thực bằng JWT token

**Giải pháp:**
- **Backend**: Express với middleware xác thực JWT
- **Password Security**: Hash bằng bcrypt với salt rounds = 10
- **Token Management**: JWT với thời gian hết hạn 7 ngày
- **Frontend**: Context API để quản lý trạng thái đăng nhập

**API Endpoints:**
```
POST /api/auth/register    - Đăng ký
POST /api/auth/login       - Đăng nhập
GET  /api/auth/me          - Lấy thông tin user
PUT  /api/auth/me          - Cập nhật profile
PUT  /api/auth/change-password - Đổi mật khẩu
```

#### 3.1.2. Quản lý Giao dịch (Thu/Chi)

**Tính năng:**
- Tạo giao dịch mới (thu nhập hoặc chi tiêu)
- Xem danh sách giao dịch với filter và pagination
- Cập nhật và xóa giao dịch
- Tự động phân loại bằng AI
- Trích xuất số tiền từ mô tả

**Giải pháp:**
- **AI Classification**: TF-IDF + Naive Bayes để phân loại category
- **Amount Extraction**: Regex patterns để trích xuất số tiền từ text
- **Type Inference**: Logic để phân biệt INCOME/EXPENSE
- **Database**: MongoDB với indexes tối ưu

**Quy trình Tạo Giao dịch:**
```
1. User nhập mô tả → Frontend
2. Frontend gửi POST /api/expenses → Backend
3. Backend gọi AI Service → Phân loại tự động
4. AI trả về: category, jarKey, type, amount, confidence
5. Backend kiểm tra Anomaly & Budget
6. Backend lưu vào MongoDB
7. Trả về kết quả cho Frontend
```

**API Endpoints:**
```
POST   /api/expenses              - Tạo giao dịch
GET    /api/expenses              - Lấy danh sách (có filter)
GET    /api/expenses/:id          - Lấy chi tiết
PUT    /api/expenses/:id          - Cập nhật
DELETE /api/expenses/:id          - Xóa
GET    /api/expenses/stats/summary - Thống kê
```

#### 3.1.3. Phân loại Tự động bằng AI

**Tính năng:**
- Phân loại giao dịch theo category (Food, Transport, Education, etc.)
- Ánh xạ category sang jarKey (NEC, FFA, LTSS, EDU, PLAY, GIVE)
- Phân biệt tự động thu nhập (INCOME) và chi tiêu (EXPENSE)
- Trích xuất số tiền từ mô tả văn bản
- Độ tin cậy (confidence score) của dự đoán

**Giải pháp Kỹ thuật:**

**A. Text Preprocessing:**
```python
1. Lowercase conversion
2. Remove punctuation và digits
3. Remove stopwords (tiếng Việt + tiếng Anh)
4. TF-IDF vectorization
```

**B. Classification Model:**
- **Algorithm**: Multinomial Naive Bayes
- **Features**: TF-IDF vectors (max_features=5000)
- **Training**: Train trên dữ liệu có label từ MongoDB
- **Evaluation**: Accuracy, Precision, Recall, F1-Score

**C. Amount Extraction:**
- Hỗ trợ các định dạng:
  - "150000 đồng" → 150000
  - "$150" → 150
  - "150k" → 150000
  - "1.5 triệu" → 1500000

**D. Type Inference:**
- Kiểm tra category có trong danh sách INCOME categories
- Tìm keywords thu nhập trong mô tả
- Mặc định: EXPENSE

**AI Service API:**
```
POST /classify-expense
Request: {
  "description": "Mua đồ ăn 150000 đồng",
  "userId": "user123",
  "amount": null  // optional
}
Response: {
  "predictedCategory": "Food",
  "predictedJarKey": "NEC",
  "predictedType": "EXPENSE",
  "confidence": 0.8523,
  "amount": 150000.0
}
```

#### 3.1.4. Quản lý 6 Hũ Tài chính (6 Jars Model)

**Tính năng:**
- Khởi tạo 6 hũ mặc định cho mỗi user
- Cấu hình monthlyLimit cho từng hũ
- Theo dõi chi tiêu theo từng hũ
- Hiển thị progress bar và thống kê

**Mô hình 6 Jars:**
```
NEC (Necessities) - 55%: Nhu cầu thiết yếu
FFA (Financial Freedom Account) - 10%: Tự do tài chính
LTSS (Long Term Savings) - 10%: Tiết kiệm dài hạn
EDU (Education) - 10%: Giáo dục
PLAY (Play) - 10%: Giải trí
GIVE (Give) - 5%: Cho đi
```

**Giải pháp:**
- **Database**: JarConfig collection với compound index (userId, jarKey)
- **Frontend**: Pie chart hiển thị phân bổ theo hũ
- **Backend**: Tính toán thống kê real-time

**API Endpoints:**
```
GET  /api/jars                    - Lấy tất cả hũ
POST /api/jars/initialize         - Khởi tạo 6 hũ mặc định
PUT  /api/jars/:jarKey            - Cập nhật cấu hình
GET  /api/jars/:jarKey/stats      - Thống kê hũ
```

#### 3.1.5. Phát hiện Bất thường (Anomaly Detection)

**Tính năng:**
- Phát hiện giao dịch bất thường dựa trên lịch sử
- So sánh với ngưỡng thống kê (mean, stdDev)
- Phát hiện khi vượt ngân sách hũ
- Tạo alert tự động

**Giải pháp:**

**A. Anomaly Detection Logic:**
```python
1. Lấy lịch sử 30 ngày gần nhất, cùng jarKey
2. Tính toán: mean, median, standard deviation
3. Nếu amount > threshold × mean → ANOMALY
4. Nếu amount > 3 × stdDev → ANOMALY
```

**B. Budget Check:**
```javascript
1. Lấy monthlyLimit của jar
2. Tính tổng chi tiêu tháng hiện tại
3. Nếu (currentTotal + amount) > monthlyLimit → ALERT
4. Tạo alert với type=JAR_LIMIT
```

**C. Alert Types:**
- `ANOMALY`: Giao dịch bất thường
- `JAR_LIMIT`: Vượt ngân sách hũ
- `BUDGET_LIMIT`: Vượt ngân sách tổng
- `SYSTEM`: Thông báo hệ thống
- `INFO`: Thông tin chung

#### 3.1.6. Hệ thống Cảnh báo (Alert System)

**Tính năng:**
- Hiển thị danh sách alerts
- Đánh dấu đã đọc/chưa đọc
- Filter theo type và level
- Xóa alerts

**Giải pháp:**
- **Database**: Alert collection với indexes tối ưu
- **Frontend**: Badge hiển thị số alerts chưa đọc
- **Real-time**: Có thể tích hợp WebSocket (tương lai)

**API Endpoints:**
```
GET    /api/alerts                - Lấy tất cả alerts
GET    /api/alerts/unread         - Lấy alerts chưa đọc
PUT    /api/alerts/:id/read       - Đánh dấu đã đọc
PUT    /api/alerts/read-all       - Đánh dấu tất cả đã đọc
DELETE /api/alerts/:id            - Xóa alert
```

#### 3.1.7. Dashboard và Thống kê

**Tính năng:**
- Tổng quan tài chính (tổng thu, tổng chi, số dư)
- Biểu đồ phân bổ theo hũ (Pie Chart)
- Biểu đồ thu - chi theo ngày (Bar Chart)
- Danh sách giao dịch gần đây
- Thống kê theo danh mục

**Giải pháp:**
- **Visualization**: Recharts library
- **Data Aggregation**: MongoDB aggregation pipeline
- **Real-time Updates**: Refresh khi có giao dịch mới

**Dashboard Components:**
```
┌─────────────────────────────────────┐
│         DASHBOARD                    │
├─────────────────┬───────────────────┤
│  LEFT COLUMN    │  RIGHT COLUMN     │
│                 │                   │
│  - Pie Chart    │  - Recent         │
│    (6 Jars)     │    Transactions   │
│                 │                   │
│  - Bar Chart    │  - Quick Stats    │
│    (Daily)      │    (Income/Expense)│
└─────────────────┴───────────────────┘
```

### 3.2. Giải pháp Kỹ thuật Chi tiết

#### 3.2.1. Kiến trúc Hệ thống

**Mô hình 3-Tier:**

1. **Presentation Tier (Frontend)**
   - React SPA với Vite
   - Client-side routing
   - State management với Context API
   - Responsive design với Tailwind CSS

2. **Application Tier (Backend)**
   - Node.js/Express RESTful API
   - Business logic và validation
   - Authentication & Authorization
   - Integration với AI Service

3. **Data Tier**
   - MongoDB cho persistent data
   - ML Models (pickle files) cho AI
   - File system cho static assets

#### 3.2.2. Xử lý Ngôn ngữ Tự nhiên Tiếng Việt

**Thách thức:**
- Tiếng Việt có dấu, từ ghép phức tạp
- Không có sẵn stopwords list đầy đủ
- Cần xử lý đặc biệt cho số tiền (150k, 1.5 triệu)

**Giải pháp:**
- **Stopwords**: Tự xây dựng list stopwords tiếng Việt
- **Normalization**: Lowercase, remove accents (nếu cần)
- **Tokenization**: Split theo khoảng trắng và dấu câu
- **Amount Extraction**: Regex patterns đặc biệt cho tiếng Việt

#### 3.2.3. Machine Learning Pipeline

**Training Pipeline:**
```
1. Data Collection: Export từ MongoDB
2. Data Cleaning: Remove duplicates, handle missing values
3. Data Labeling: Sử dụng category và jarKey có sẵn
4. Train/Test Split: 80/20
5. Feature Engineering: TF-IDF vectorization
6. Model Training: Multinomial Naive Bayes
7. Evaluation: Accuracy, Precision, Recall, F1
8. Model Saving: joblib dump
```

**Inference Pipeline:**
```
1. Text Input → Preprocessing
2. TF-IDF Transform → Vector
3. Model Predict → Category
4. Map Category → JarKey
5. Extract Amount → Number
6. Infer Type → INCOME/EXPENSE
7. Return Result
```

#### 3.2.4. Bảo mật và Hiệu năng

**Bảo mật:**
- JWT authentication với secret key
- Password hashing với bcrypt
- HTTPS cho production
- Input validation và sanitization
- CORS configuration

**Hiệu năng:**
- Database indexing cho queries nhanh
- Model caching trong AI service
- Pagination cho large datasets
- Lazy loading trong frontend
- Connection pooling cho MongoDB

### 3.3. So sánh với Giải pháp Hiện có

| Tính năng | Hệ thống này | Giải pháp truyền thống |
|-----------|--------------|------------------------|
| **Phân loại tự động** | ✅ AI/ML | ❌ Thủ công |
| **Trích xuất số tiền** | ✅ Tự động | ❌ Nhập thủ công |
| **Phát hiện bất thường** | ✅ Có | ❌ Không có |
| **6 Jars Model** | ✅ Tích hợp sẵn | ❌ Không có |
| **Cảnh báo real-time** | ✅ Có | ⚠️ Hạn chế |
| **Hỗ trợ tiếng Việt** | ✅ Tốt | ⚠️ Hạn chế |
| **Open Source** | ✅ Có thể | ❌ Thường không |

---

## 4. YÊU CẦU CƠ SỞ HẠ TẦNG

### 4.1. Yêu cầu Phần cứng

#### 4.1.1. Máy chủ Phát triển (Development)

| Thành phần | Yêu cầu Tối thiểu | Khuyến nghị |
|------------|-------------------|-------------|
| **CPU** | Intel i5 / AMD Ryzen 5 (4 cores) | Intel i7 / AMD Ryzen 7 (8 cores) |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 100 GB SSD | 256 GB SSD |
| **Network** | 50 Mbps | 100 Mbps |
| **OS** | Windows 10/11, macOS, Linux | Linux (Ubuntu 20.04+) |

#### 4.1.2. Máy chủ Sản xuất (Production)

**Cho 1000+ người dùng đồng thời:**

| Component | Specification | Số lượng |
|-----------|--------------|---------|
| **Load Balancer** | 2 vCPU, 2GB RAM | 1 |
| **Backend Servers** | 2 vCPU, 4GB RAM | 2-3 |
| **AI Service Servers** | 2 vCPU, 4GB RAM | 2 |
| **MongoDB** | 4 vCPU, 8GB RAM, SSD | 1 (Primary) + 2 (Secondary) |
| **Frontend/CDN** | 1 vCPU, 1GB RAM | 1-2 |

**Tổng tài nguyên:**
- **CPU**: 18-22 vCPU
- **RAM**: 30-40 GB
- **Storage**: 200 GB SSD
- **Network**: 100 Mbps+

### 4.2. Yêu cầu Phần mềm

#### 4.2.1. Runtime và Framework

| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|----------|
| **Node.js** | 18.x trở lên | Backend runtime |
| **Python** | 3.10+ | AI service runtime |
| **npm** | 9.x+ | Node.js package manager |
| **pip** | 23.x+ | Python package manager |

#### 4.2.2. Database và Storage

| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|----------|
| **MongoDB** | 6.x+ | Primary database |
| **MongoDB Atlas** | (Cloud) | Managed MongoDB (khuyến nghị) |

#### 4.2.3. Công cụ Phát triển

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| **Git** | 2.30+ | Version control |
| **VS Code** | Latest | IDE (khuyến nghị) |
| **Postman** | Latest | API testing |
| **Docker** | 20.x+ | Containerization (tùy chọn) |

### 4.3. Yêu cầu Mạng và Bảo mật

#### 4.3.1. Mạng

**Ports cần mở:**
- **80/443**: HTTP/HTTPS (Frontend, Load Balancer)
- **3000**: Backend API (internal)
- **8000**: AI Service (internal)
- **27017**: MongoDB (internal only, không expose ra ngoài)

**Firewall Rules:**
- Chặn tất cả ports từ Internet, trừ 80/443
- Chỉ cho phép internal communication giữa các services
- Whitelist IP cho MongoDB Atlas (nếu dùng cloud)

#### 4.3.2. Bảo mật

**SSL/TLS:**
- Certificate cho HTTPS (Let's Encrypt hoặc commercial)
- TLS 1.2+ cho MongoDB connections
- Secure headers (HSTS, CSP)

**Authentication:**
- JWT với secret key mạnh (32+ characters)
- Token expiration: 7 days
- Refresh token mechanism (tương lai)

**Network Security:**
- VPN cho admin access
- Rate limiting để chống DDoS
- WAF (Web Application Firewall) nếu cần

### 4.4. Yêu cầu Hạ tầng Cloud (Khuyến nghị)

#### 4.4.1. MongoDB Atlas

**Tier khuyến nghị:**
- **Development**: M0 (Free) hoặc M2
- **Production (1000+ users)**: M10 hoặc M20
  - 2GB+ RAM
  - 10GB+ Storage
  - 3-node replica set
  - Automated backups

**Configuration:**
- Network Access: Whitelist IPs
- Database Access: Username/Password với strong password
- Encryption: At-rest và in-transit

#### 4.4.2. Cloud Server (VPS/EC2)

**Khuyến nghị:**
- **Provider**: AWS EC2, Google Cloud Compute, DigitalOcean, Vultr
- **Instance Type**: 
  - Development: t3.medium (2 vCPU, 4GB RAM)
  - Production: t3.large (2 vCPU, 8GB RAM) × 2-3 instances
- **OS**: Ubuntu 22.04 LTS
- **Storage**: SSD 50GB+

#### 4.4.3. CDN và Static Hosting

**Options:**
- **CloudFront** (AWS) hoặc **Cloud CDN** (GCP)
- **Vercel** hoặc **Netlify** cho Frontend static hosting
- **S3** (AWS) hoặc **Cloud Storage** (GCP) cho file storage

### 4.5. Yêu cầu Monitoring và Backup

#### 4.5.1. Monitoring

**Metrics cần theo dõi:**
- CPU, RAM, Disk usage
- API response time
- Database query performance
- Error rates (4xx, 5xx)
- Active users, requests per second

**Tools khuyến nghị:**
- **Prometheus + Grafana**: Metrics và visualization
- **Sentry**: Error tracking
- **Uptime Robot**: Uptime monitoring
- **MongoDB Atlas Monitoring**: Database metrics

#### 4.5.2. Backup và Disaster Recovery

**Backup Strategy:**
- **Database**: Daily automated backups (MongoDB Atlas)
- **ML Models**: Version control trong Git
- **Code**: Git repository với remote backup
- **Retention**: 30 days cho database, indefinite cho code

**Disaster Recovery:**
- **RTO (Recovery Time Objective)**: < 4 hours
- **RPO (Recovery Point Objective)**: < 24 hours
- **Backup Testing**: Monthly restore tests

### 4.6. Yêu cầu Scalability

#### 4.6.1. Horizontal Scaling

**Backend:**
- Stateless design (JWT tokens)
- Load balancer phân phối requests
- Session không lưu trên server

**AI Service:**
- Model files có thể share giữa instances
- Stateless API endpoints
- Có thể scale độc lập với Backend

**Database:**
- MongoDB replica set cho read scaling
- Sharding cho very large datasets (tương lai)

#### 4.6.2. Caching Strategy

**Redis (tùy chọn):**
- Cache API responses
- Session storage
- Rate limiting counters
- Real-time statistics

**Application-level:**
- Model caching trong AI service
- Static asset caching
- Browser caching cho frontend

### 4.7. Chi phí Hạ tầng Ước tính

#### 4.7.1. Development Environment

| Hạng mục | Chi phí/tháng (VND) |
|----------|---------------------|
| MongoDB Atlas M0 (Free) | 0 |
| VPS Development | 500,000 |
| Domain & SSL | 100,000 (một lần) |
| **TỔNG** | **500,000** |

#### 4.7.2. Production Environment (1000+ users)

| Hạng mục | Chi phí/tháng (VND) |
|----------|---------------------|
| MongoDB Atlas M10 | 2,000,000 |
| Cloud Servers (3×) | 4,500,000 |
| CDN & Bandwidth | 500,000 |
| Monitoring & Tools | 300,000 |
| Backup Storage | 200,000 |
| **TỔNG** | **7,500,000** |

### 4.8. Checklist Triển khai

**Pre-deployment:**
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented

**Deployment:**
- [ ] Code deployed to production
- [ ] Services started and healthy
- [ ] Database migrations completed
- [ ] AI models loaded successfully
- [ ] Smoke tests passed

**Post-deployment:**
- [ ] Monitoring dashboards verified
- [ ] Backup jobs running
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Documentation updated

---

## KẾT LUẬN

Hệ thống **Quản lý Chi tiêu Cá nhân Thông minh** được thiết kế với kiến trúc hiện đại, tích hợp AI/ML để tự động hóa quá trình quản lý tài chính. Với các tính năng như phân loại tự động, phát hiện bất thường, và quản lý ngân sách theo mô hình 6 Jars, hệ thống mang lại giá trị thực tế cho người dùng.

Hạ tầng được thiết kế với khả năng mở rộng và đảm bảo hiệu năng, phù hợp cho cả môi trường phát triển và sản xuất với quy mô lớn.

---

**Tài liệu này được tạo bởi:** Đội ngũ Phát triển Hệ thống Quản lý Chi tiêu Cá nhân Thông minh  
**Ngày:** 2024  
**Phiên bản:** 1.0

