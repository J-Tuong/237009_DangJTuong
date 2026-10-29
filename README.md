# BÁO CÁO BÀI THI THỰC HÀNH TỔNG HỢP
**Học phần:** Điện toán đám mây  
**Đề tài:** Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng đám mây  

---

## I. THÔNG TIN SINH VIÊN & BẢNG TỔNG HỢP NỘP BÀI

### 1. Thông tin sinh viên
* **Họ và tên:** Đặng J Tường
* **Mã số sinh viên (MSSV):** 237009
* **Lớp / Khóa học:** Điện toán đám mây

### 2. Bảng thông tin nộp bài (Theo biểu mẫu đánh giá)

| Trường thông tin | Nội dung cung cấp | Đường dẫn kiểm tra (URL) |
| :--- | :--- | :--- |
| **Link_GitHub** | URL repository GitHub chứa mã nguồn | https://github.com/J-Tuong/237009_DANGJTUONG |
| **Link_Docker_Backend** | URL Docker image backend trên Docker Hub | https://hub.docker.com/r/jtuongdang/backend |
| **Link_Docker_Frontend** | URL Docker image frontend trên Docker Hub | https://hub.docker.com/r/jtuongdang/frontend |
| **Link_Render_App** | URL ứng dụng frontend đã triển khai | https://web-237009.onrender.com |
| **Link_Render_API** | URL backend API đã triển khai | https://api-237009.onrender.com |
| **Link_Data_MongoDB** | Database & Collection MongoDB Atlas | Database: `237009_DangJTuong` <br> Collection: `foods` |

* **Endpoint kiểm tra trạng thái Backend (Health Check):** https://api-237009.onrender.com/health
* **Endpoint API dữ liệu món ăn:** https://api-237009.onrender.com/api/foods

---

## II. BÁO CÁO CHI TIẾT THỰC HIỆN THEO NỘI DUNG ĐỀ THI

### Câu 1: Tạo repository và quản lý mã nguồn bằng GitHub
* Khởi tạo repository công khai đặt tên theo quy chuẩn: `237009_DANGJTUONG`.
* Thiết lập cấu trúc phân tách rõ ràng thành hai module độc lập:
  * `/backend`: Mã nguồn Node.js, Express API, cấu hình Dockerfile và tệp phụ thuộc `package.json`.
  * `/frontend`: Mã nguồn giao diện React (Vite), cấu hình Nginx và Dockerfile multi-stage.
* Tạo tệp `.gitignore` loại trừ thư mục `node_modules/`, `dist/`, các tệp cấu hình bảo mật cục bộ `.env`. Không đưa chuỗi kết nối chứa mật khẩu lên Git.

---

### Câu 2: Tạo cơ sở dữ liệu MongoDB Atlas
* Khởi tạo cụm Database trên đám mây MongoDB Atlas.
* **Tên Database:** `237009_DangJTuong`.
* **Tên Collection:** `foods`.
* Thiết kế mô hình dữ liệu (Schema) đáp ứng đầy đủ các trường yêu cầu:
  * `foodId`: Mã món ăn (duy nhất, ví dụ `F01`, `F02`).
  * `name`: Tên món ăn.
  * `category`: Loại món ăn (Món nước, Món khô, Món khai vị...).
  * `cuisine`: Vùng miền ẩm thực (Miền Bắc, Miền Trung, Miền Nam).
  * `ingredients`: Danh sách mảng nguyên liệu cấu thành.
  * `price`: Giá bán niêm yết (VNĐ).
  * `quantity`: Số lượng tồn kho phục vụ.
  * `description`: Mô tả chi tiết món ăn.
  * `imageUrl`: Đường dẫn ảnh minh họa món ăn.
* Nạp sẵn tối thiểu 3 bản ghi dữ liệu mẫu đại diện cho các vùng miền (`Phở Bò Tái Nạm`, `Bún Bò Huế`, `Cơm Tấm Sườn Bì Chả`).
* Thiết lập Network Access mở quyền IP toàn cầu (`0.0.0.0/0`) và Database User `s237009_db_user` với quyền hạn bảo mật.

---

### Câu 3: Xây dựng backend API (Node.js & Express)
* Sử dụng Node.js v20 LTS và Express.js, cấu hình cổng dịch vụ linh hoạt qua `process.env.PORT || 5000`.
* Kết nối cơ sở dữ liệu MongoDB Atlas qua biến môi trường bảo mật `MONGODB_URI`.
* Xây dựng đầy đủ hệ thống Endpoints RESTful API:
  * `GET /health`: Endpoint giám sát tình trạng máy chủ (`status: OK`) và xác thực trạng thái kết nối Database (`database: Connected`).
  * `GET /api/foods`: Truy vấn danh sách toàn bộ món ăn.
  * `GET /api/foods?search={keyword}`: Tìm kiếm món ăn theo từ khóa trên các trường tên món ăn, danh mục hoặc vùng miền ẩm thực.
  * `GET /api/foods/:id`: Lấy chi tiết thông tin món ăn theo ID.
  * `POST /api/foods`: Thêm món ăn mới (có xác thực dữ liệu đầu vào, ràng buộc không cho phép trùng `foodId`).
  * `PUT /api/foods/:id`: Cập nhật thông tin chi tiết món ăn.
  * `DELETE /api/foods/:id`: Xóa món ăn khỏi cơ sở dữ liệu.
* Xử lý ngoại lệ, trả về mã trạng thái HTTP chuẩn (200, 201, 400, 404, 500) và định dạng phản hồi chuẩn JSON.

---

### Câu 4: Xây dựng frontend bằng React
* Phát triển giao diện người dùng dựa trên nền tảng React 18 và Vite:
  * Màn hình danh sách thực đơn hiển thị bảng thông tin chi tiết: Tên món, loại món, vùng miền, giá tiền, số lượng tồn kho.
  * Thanh tìm kiếm tức thời theo từ khóa (hỗ trợ cả tiếng Việt có dấu và không dấu).
  * Chức năng xem chi tiết thông tin món ăn dưới dạng Modal.
  * Chức năng thêm mới và cập nhật món ăn với biểu mẫu kiểm tra tính hợp lệ.
  * Hộp thoại xác nhận trước khi thực hiện xóa món ăn.
  * Hiển thị trạng thái đang tải (Loading state) và thông báo kết quả thao tác.
* Tích hợp biến môi trường `VITE_API_URL` trỏ linh hoạt về backend server trên đám mây.

---

### Câu 5: Đóng gói backend bằng Docker và đẩy lên Docker Hub
* Viết `Dockerfile` cho Backend sử dụng image gốc `node:20-alpine` siêu nhẹ.
* Biên dịch chuẩn hóa kiến trúc đám mây `linux/amd64` phù hợp hạ tầng container.
* Phát hành image lên Docker Hub: `jtuongdang/backend:latest`.
* Đường dẫn công khai: https://hub.docker.com/r/jtuongdang/backend.

---

### Câu 6: Đóng gói frontend bằng Docker và đẩy lên Docker Hub
* Viết `Dockerfile` cho Frontend sử dụng kỹ thuật Multi-stage build:
  * **Stage 1 (Build):** Dùng `node:20-alpine` biên dịch mã nguồn React/Vite ra thư mục tĩnh `/app/dist`.
  * **Stage 2 (Runtime):** Dùng `nginx:alpine` phục vụ file tĩnh tại cổng 80, cấu hình `nginx.conf` hỗ trợ Client-side routing.
* Biên dịch chuẩn hóa nền tảng `linux/amd64`.
* Phát hành image lên Docker Hub: `jtuongdang/frontend:latest`.
* Đường dẫn công khai: https://hub.docker.com/r/jtuongdang/frontend.

---

### Câu 7: Triển khai frontend trên Render
* Tạo Web Service trên Render với tên định danh `web-237009`.
* Sử dụng phương thức triển khai trực tiếp từ image registry: `jtuongdang/frontend:latest`.
* Cấu hình chuyển hướng API chính xác tới backend cloud `https://api-237009.onrender.com`.
* Triển khai dịch vụ thành công ở trạng thái `Live`.
* **URL ứng dụng web công khai:** https://web-237009.onrender.com.

---

### Câu 8: Triển khai backend API trên Render
* Tạo Web Service trên Render với tên định danh chuẩn `api-237009`.
* Nguồn triển khai: Image `jtuongdang/backend:latest`.
* Thiết lập các biến môi trường:
  * `PORT`: `5000`
  * `MONGODB_URI`: Chuỗi kết nối bảo mật tới cơ sở dữ liệu MongoDB Atlas `237009_DangJTuong`.
* Cấu hình CORS cho phép origin từ `web-237009.onrender.com` truy cập tài nguyên API.
* **URL Backend API công khai:** https://api-237009.onrender.com.
* Xác thực kiểm tra:
  * `GET /health` $\rightarrow$ Trả về `{"status":"OK","database":"Connected"}`.
  * `GET /api/foods` $\rightarrow$ Trả về mảng JSON dữ liệu các món ăn.

---

### Câu 9: Kiểm tra tổng thể và hoàn thiện bài nộp
1. Kiểm tra tích hợp liên thông: Frontend hiển thị đầy đủ dữ liệu món ăn được tải trực tiếp từ MongoDB Atlas thông qua Backend API trên Render.
2. Kiểm tra các luồng nghiệp vụ: Tìm kiếm, thêm món mới, cập nhật và xóa hoạt động chính xác trên môi trường trực tuyến.
3. Toàn bộ mã nguồn, cấu hình Dockerfile và tài liệu báo cáo được lưu trữ đầy đủ tại GitHub Repository `237009_DANGJTUONG`.
4. Các đường dẫn dịch vụ và Docker Image được công khai, đảm bảo khả năng truy cập để chấm điểm.

---

## III. LỊCH SỬ COMMIT THEO TIẾN ĐỘ ĐỀ BÀI (TỐI THIỂU 9 COMMITS)

1. `Commit 1 - Cau 1`: Khoi tao repository GitHub 237009_DANGJTUONG, cau truc du an va file .gitignore
2. `Commit 2 - Cau 2`: Thiet lap cau hinh ket noi co so du lieu MongoDB Atlas 237009_DangJTuong va collection foods
3. `Commit 3 - Cau 3`: Xay dung he thong RESTful API Node.js/Express, CRUD foods va endpoint /health
4. `Commit 4 - Cau 4`: Hoan thien giao dien React Vite, chuc nang tim kiem, them, sua, xoa mon an
5. `Commit 5 - Cau 5`: Dong goi Dockerfile Backend node:20-alpine va day image jtuongdang/backend len Docker Hub
6. `Commit 6 - Cau 6`: Dong goi Multi-stage Dockerfile Frontend Nginx va day image jtuongdang/frontend len Docker Hub
7. `Commit 7 - Cau 7`: Trien khai dich vu web-237009 len Render tu Docker Hub thanh cong
8. `Commit 8 - Cau 8`: Trien khai dich vu api-237009 len Render, ket noi MongoDB Atlas va cau hinh CORS
9. `Commit 9 - Cau 9`: Kiem tra toan dien he thong Cloud, hoan thien README bao cao theo de thi
