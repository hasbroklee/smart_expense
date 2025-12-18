# Biểu đồ Use Case - AI Service

## Mô tả
Biểu đồ Use Case mô tả các chức năng và tương tác của hệ thống AI Service trong Smart Personal Expense Management System.

## Các Actor

### 1. Backend Service (Node.js)
- **Mô tả**: Hệ thống backend gọi API AI service để phân loại giao dịch
- **Tương tác**: Gửi HTTP requests đến FastAPI endpoints

### 2. Data Scientist / Admin
- **Mô tả**: Người quản trị hoặc nhà khoa học dữ liệu quản lý và huấn luyện model
- **Tương tác**: Chạy các script training, testing, quản lý dữ liệu

### 3. System
- **Mô tả**: Hệ thống tự động load models khi khởi động
- **Tương tác**: Tự động hóa các tác vụ hệ thống

## Use Cases

### API Layer (FastAPI)

#### UC1: Classify Single Expense
- **Actor**: Backend Service
- **Mô tả**: Phân loại một giao dịch đơn lẻ
- **Input**: 
  - `description`: Mô tả giao dịch (bắt buộc)
  - `userId`: ID người dùng (bắt buộc)
  - `amount`: Số tiền (tùy chọn, sẽ tự động extract từ text)
- **Output**:
  - `predictedCategory`: Danh mục dự đoán
  - `predictedJarKey`: Hũ tài chính (NEC, FFA, LTSS, EDU, PLAY, GIVE)
  - `predictedType`: Loại giao dịch (INCOME/EXPENSE)
  - `confidence`: Độ tin cậy (0-1)
  - `amount`: Số tiền (nếu extract được)
- **Endpoint**: `POST /classify-expense`

#### UC2: Classify Batch Expenses
- **Actor**: Backend Service
- **Mô tả**: Phân loại nhiều giao dịch cùng lúc
- **Input**: Mảng các expense requests
- **Output**: Mảng kết quả phân loại
- **Endpoint**: `POST /classify-batch`

#### UC3: Health Check
- **Actor**: Backend Service
- **Mô tả**: Kiểm tra trạng thái và khả năng sẵn sàng của service
- **Output**: 
  - `status`: "healthy" hoặc "degraded"
  - `models_loaded`: true/false
- **Endpoint**: `GET /health`

#### UC4: Load Models on Startup
- **Actor**: System
- **Mô tả**: Tự động load TF-IDF vectorizer và classifier khi API khởi động
- **Trigger**: FastAPI startup event

### Core Modules

#### UC5: Train Classification Model
- **Actor**: Data Scientist / Admin
- **Mô tả**: Huấn luyện model từ dữ liệu MongoDB
- **Script**: `train_model.py`
- **Quy trình**:
  1. Export expenses từ MongoDB
  2. Clean và prepare data
  3. Split train/test
  4. Fit TF-IDF vectorizer
  5. Train Naive Bayes classifier
  6. Evaluate model
  7. Save models và metadata

#### UC6: Test Model Interactively
- **Actor**: Data Scientist / Admin
- **Mô tả**: Test model tương tác bằng cách nhập mô tả giao dịch
- **Script**: `test_model.py` hoặc `demo_test.py`
- **Input**: Mô tả giao dịch (có thể kèm số tiền)
- **Output**: Category, jar key, confidence, extracted amount

#### UC7: Extract Amount from Text
- **Mô tả**: Tự động trích xuất số tiền từ mô tả văn bản
- **Hỗ trợ định dạng**:
  - "150000 đồng"
  - "$150"
  - "150k" → 150,000
  - "1.5 triệu"
- **Module**: `text_preprocessing.AmountExtractor`

#### UC8: Preprocess Text (TF-IDF)
- **Mô tả**: Tiền xử lý văn bản và vector hóa bằng TF-IDF
- **Các bước**:
  1. Lowercase
  2. Remove punctuation và digits
  3. Remove stopwords (tiếng Việt + tiếng Anh)
  4. TF-IDF vectorization
- **Module**: `text_preprocessing.TFIDFVectorizer`

#### UC9: Predict Category & Jar
- **Mô tả**: Dự đoán danh mục và ánh xạ sang hũ tài chính
- **Model**: Multinomial Naive Bayes
- **Output**: 
  - Category (Food, Transport, Education, etc.)
  - Jar Key (NEC, FFA, LTSS, EDU, PLAY, GIVE)
  - Confidence score
- **Module**: `classification.ExpenseClassifier`

#### UC10: Infer Transaction Type (INCOME/EXPENSE)
- **Mô tả**: Xác định loại giao dịch là thu nhập hay chi tiêu
- **Logic**:
  - Kiểm tra category có trong danh sách INCOME categories
  - Tìm keywords thu nhập trong mô tả
  - Mặc định: EXPENSE
- **Module**: `classification.ExpenseClassifier._infer_type()`

#### UC11: Detect Anomalies
- **Mô tả**: Phát hiện giao dịch bất thường
- **Tiêu chí**: 
  - Amount > threshold × mean spending trong jar
  - So sánh với lịch sử 30 ngày
- **Module**: `anomaly_detection.AnomalyDetector`

#### UC12: Check Budget Limits
- **Mô tả**: Kiểm tra giao dịch có vượt ngân sách hũ không
- **Input**: userId, jarKey, amount
- **Output**: Cảnh báo nếu vượt limit
- **Module**: `anomaly_detection.AnomalyDetector`

### Data Management

#### UC13: Export Expenses from MongoDB
- **Mô tả**: Xuất dữ liệu expenses từ MongoDB để training
- **Module**: `data_labeling.DataLabelingModule.export_expenses()`

#### UC14: Clean & Prepare Data
- **Mô tả**: Làm sạch và chuẩn bị dữ liệu training
- **Module**: `data_labeling.DataLabelingModule.clean_data()`

#### UC15: Split Train/Test Data
- **Mô tả**: Chia dữ liệu thành tập train và test
- **Tỷ lệ**: 80% train, 20% test (mặc định)
- **Module**: `data_labeling.DataLabelingModule.split_train_test()`

#### UC16: Save Trained Models
- **Mô tả**: Lưu model đã huấn luyện ra disk
- **Files**:
  - `models/tfidf_vectorizer.pkl`
  - `models/classifier_nb.pkl`
  - `models/classifier_nb_metadata.json`
- **Module**: `classification.ExpenseClassifier.save()`

#### UC17: Load Trained Models
- **Mô tả**: Load model từ disk vào memory
- **Module**: `classification.ExpenseClassifier.load()`

## Sơ đồ tương tác

```
Backend Service
    │
    ├─→ UC1: Classify Single Expense
    │       ├─→ UC8: Preprocess Text
    │       ├─→ UC7: Extract Amount
    │       ├─→ UC9: Predict Category & Jar
    │       └─→ UC10: Infer Transaction Type
    │
    ├─→ UC2: Classify Batch Expenses
    │       └─→ (tương tự UC1 cho từng item)
    │
    └─→ UC3: Health Check

Data Scientist / Admin
    │
    ├─→ UC5: Train Model
    │       ├─→ UC13: Export Expenses
    │       ├─→ UC14: Clean Data
    │       ├─→ UC15: Split Train/Test
    │       ├─→ UC8: Preprocess Text
    │       ├─→ UC9: Train Classifier
    │       └─→ UC16: Save Models
    │
    └─→ UC6: Test Model
            ├─→ UC17: Load Models
            ├─→ UC8: Preprocess Text
            ├─→ UC7: Extract Amount
            └─→ UC9: Predict

System
    └─→ UC4: Load Models on Startup
            └─→ UC17: Load Models
```

## Công cụ xem biểu đồ

### PlantUML
1. Cài đặt PlantUML extension trong VS Code
2. Mở file `USE_CASE_DIAGRAM.puml`
3. Preview bằng PlantUML extension

### Online Viewer
- [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
- Copy nội dung file `.puml` và paste vào editor

### Export hình ảnh
```bash
# Cài đặt PlantUML (Java required)
# Windows: choco install plantuml
# hoặc download từ http://plantuml.com/download

# Generate PNG
plantuml USE_CASE_DIAGRAM.puml

# Generate SVG
plantuml -tsvg USE_CASE_DIAGRAM.puml
```

## Tài liệu tham khảo
- `api/main.py` - FastAPI endpoints
- `modules/classification.py` - Classifier module
- `modules/text_preprocessing.py` - Text preprocessing & amount extraction
- `modules/data_labeling.py` - Data management
- `modules/anomaly_detection.py` - Anomaly detection
- `train_model.py` - Training script
- `test_model.py` - Testing script

