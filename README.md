# Quản lý món ăn trên nền tảng đám mây
- Họ tên: Đặng J Tường
- MSSV: 237009
- Học phần: Điện toán đám mây
- Công nghệ: React, Node.js/Express, MongoDB Atlas, Docker, Render

## Cấu trúc thư mục
- `backend/`: Mã nguồn API Express & Mongoose
- `frontend/`: Giao diện ứng dụng React

## Thông tin cơ sở dữ liệu (MongoDB Atlas)
- **Database:** `237009_DangJTuong`
- **Collection:** `foods`
- **Các trường dữ liệu:** `foodId`, `name`, `category`, `cuisine`, `ingredients`, `price`, `quantity`, `description`, `imageUrl`
- **Dữ liệu mẫu:** Đã khởi tạo 3 bản ghi (F01 - Phở Bò, F02 - Bún Bò Huế, F03 - Cơm Tấm)

## Thông tin cơ sở dữ liệu (MongoDB Atlas)
- Database: 237009_DangJTuong
- Collection: foods
- Cac truong: foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl
- Du lieu mau: Da tao 3 ban ghi (F01, F02, F03)

## Backend API (Node.js & Express)
- Port: `5000`
- Endpoints:
  - `GET /health`: Kiểm tra trạng thái máy chủ và kết nối database
  - `GET /api/foods`: Lấy danh sách toàn bộ món ăn
  - `GET /api/foods?search={keyword}`: Tìm kiếm không dấu/có dấu theo tên, loại món, vùng miền
  - `GET /api/foods/:id`: Xem chi tiết một món ăn
  - `POST /api/foods`: Thêm món ăn mới (chống trùng foodId, validate dữ liệu)
  - `PUT /api/foods/:id`: Cập nhật thông tin món ăn
  - `DELETE /api/foods/:id`: Xóa món ăn khỏi hệ thống

## Frontend (React + Vite)
- Khởi chạy dev: `npm run dev`
- Cổng mặc định: `5173`
- Tính năng:
  - Hiển thị danh sách món ăn kèm phân loại, đơn giá, số lượng tồn kho
  - Xem chi tiết từng món ăn dạng modal popup
  - Thêm mới món ăn (kiểm tra form, chống trùng foodId)
  - Cập nhật thông tin món ăn
  - Xóa món ăn với hộp thoại xác nhận
  - Tìm kiếm thời gian thực theo từ khóa có dấu/không dấu
  - Hiển thị đầy đủ thông báo phản hồi (thành công/lỗi)
- Biến môi trường: `VITE_API_URL`
