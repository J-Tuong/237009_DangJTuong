# BÀI BÁO CÁO THỰC HÀNH - ĐIỆN TOÁN ĐÁM MÂY
**Hệ thống Quản lý Món ăn (Food Management System)**

---

## 1. Thông tin sinh viên
* **Họ và tên:** Đặng J Tường
* **Mã số sinh viên (MSSV):** 237009
* **GitHub repository:** `237009_DANGJTUONG`
* **MongoDB database:** `237009_DangJTuong`
* **MongoDB collection:** `foods`
* **Docker Hub backend image:** `jtuongdang/backend:latest`
  * Liên kết: https://hub.docker.com/r/jtuongdang/backend
* **Docker Hub frontend image:** `jtuongdang/frontend:latest`
  * Liên kết: https://hub.docker.com/r/jtuongdang/frontend
* **Tên dịch vụ Render Backend:** `api-237009` (URL: https://backend-latest-gnxp.onrender.com)
* **Tên dịch vụ Render Frontend:** `web-237009` (URL: https://web-237009.onrender.com)

---

## 2. Đường dẫn kiểm tra dịch vụ trực tuyến
* **Giao diện người dùng (Frontend):** https://web-237009.onrender.com
* **Endpoint kiểm tra Backend & Database (Health Check):** https://backend-latest-gnxp.onrender.com/health
* **Endpoint API danh sách món ăn (JSON):** https://backend-latest-gnxp.onrender.com/api/foods

---

## 3. Chi tiết các nội dung đã hoàn thành

* **Câu 1 - 3 (Database & RESTful API):**
  * Thiết lập cơ sở dữ liệu MongoDB Atlas `237009_DangJTuong`, collection `foods`.
  * Xây dựng đầy đủ các API CRUD:
    * `GET /api/foods`: Lấy danh sách thực đơn.
    * `GET /api/foods/:id`: Lấy chi tiết món ăn theo mã/ID.
    * `POST /api/foods`: Thêm mới món ăn vào cơ sở dữ liệu.
    * `PUT /api/foods/:id`: Cập nhật thông tin món ăn.
    * `DELETE /api/foods/:id`: Xóa món ăn khỏi hệ thống.
    * `GET /health`: Kiểm tra trạng thái máy chủ và kết nối database.

* **Câu 4 (Giao diện Frontend):**
  * Xây dựng bằng ReactJS và Vite, hiển thị đầy đủ thông tin món ăn, bảng phân loại, giá niêm yết và tồn kho.
  * Hỗ trợ tìm kiếm theo từ khóa có dấu và không dấu trong thời gian thực.
  * Hộp thoại thêm mới, chỉnh sửa và xác nhận xóa món ăn.

* **Câu 5 & 6 (Đóng gói Docker):**
  * Đóng gói Backend thành Docker Image chạy trên môi trường Node.js (`node:20-alpine`), mở cổng 5000.
  * Đóng gói Frontend bằng kỹ thuật Multi-stage build (Node 20 build mã nguồn và phục vụ qua Nginx Alpine tại cổng 80).
  * Build chuẩn kiến trúc `linux/amd64` và phát hành công khai trên Docker Hub:
    * Backend: https://hub.docker.com/r/jtuongdang/backend
    * Frontend: https://hub.docker.com/r/jtuongdang/frontend

* **Câu 7 & 8 (Triển khai trên Render):**
  * Backend triển khai dưới tên `api-237009`, kết nối MongoDB Atlas qua biến môi trường bảo mật.
  * Frontend triển khai dưới tên `web-237009`, trỏ trực tiếp đến API Backend trên đám mây.
