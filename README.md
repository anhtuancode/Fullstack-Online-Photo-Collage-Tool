# 📸 Online Photo Collage Tool

> Tác giả: **Nguyễn Anh Tuấn**
> 
> 🛠️ Dự án: Online Photo Collage Tool

---

## 🚀 Giới thiệu

Nhiều người muốn ghép ảnh nhanh để đăng lên mạng xã hội nhưng không muốn mở phần mềm phức tạp. Dự án này là một công cụ web giúp người dùng tải ảnh lên và ghép chúng lại thành một bức ảnh duy nhất — theo **hàng ngang** hoặc **cột dọc**, với tuỳ chọn viền ảnh rõ ràng.

---

## 🧩 Tính năng cơ bản

- ✅ Tải nhiều hình ảnh lên không cần tài khoản
- ✅ Chọn kiểu ghép: Ngang hoặc Dọc
- ✅ Tuỳ chỉnh viền ảnh: độ dày, màu sắc
- ✅ Nút `Make Collage` để xử lý ảnh
- ✅ Hiển thị trạng thái đang xử lý
- ✅ Tải về ảnh kết quả sau khi xử lý

---

## ⚙️ Kiến trúc hệ thống

Dự án gồm 4 phần chính:

| Thành phần             | Công nghệ                | Vai trò                                  |
|------------------------|--------------------------|-------------------------------------------|
| Frontend UI            | React.js                 | Giao diện người dùng                      |
| Backend API            | Express.js               | Xử lý API và quản lý tác vụ               |
| Task Queue             | Celery + Redis           | Chạy tác vụ xử lý ảnh bất đồng bộ         |
| Storage (tuỳ chọn)     | Cloudinary / Amazon S3   | Lưu trữ ảnh tạm thời hoặc lâu dài         |

---

## 🛠️ Các kỹ năng rèn luyện

### 📌 Backend & DevOps
- Xây dựng REST API với Express
- Upload và lưu trữ ảnh tạm thời
- Giao tiếp với **Celery Task Queue**
- Chạy ứng dụng bằng **Docker**
- Xoá ảnh định kỳ bằng **cron job/Celery**

### 🧮 Xử lý ảnh
- Resize ảnh giữ đúng tỉ lệ
- Ghép ảnh theo chiều ngang hoặc dọc
- Thêm viền màu cho ảnh
- Lưu ảnh kết quả và trả về frontend

### 💡 Frontend
- Upload và preview ảnh
- Gửi ảnh và tuỳ chọn lên API
- Theo dõi tiến trình xử lý ảnh qua `task_id`
- Hiển thị ảnh kết quả và tải xuống

---

## 🧪 Hướng dẫn cài đặt & chạy dự án

Dự án gồm 2 phần chính: `backend` và `frontend`. Ngoài ra cần Redis để quản lý hàng đợi tác vụ (task queue) và Celery để xử lý ảnh.

---

### 1. Clone dự án & cài đặt yêu cầu

Yêu cầu:
- Node.js >= 16
- Redis
- Docker (nếu chưa cài Redis)

git clone https://github.com/anhtuancode/Fullstack-Online-Photo-Collage-Tool.git

---

### 2. Chạy Redis bằng Docker (nếu chưa cài Redis)

```
docker run -d -p 6379:6379 --name redis redis
```

Hoặc nếu bạn đã cài Redis bằng hệ thống, chỉ cần chạy:

```bash
redis-server
```

---

### 3. Khởi động backend (Express.js)

```bash
cd backend
npm install
npm run dev
```

- Server sẽ chạy ở `http://localhost:3000`
- Kết nối Redis để gửi task xử lý ảnh

```

### 4. Khởi động frontend (Reactjs)

```bash
npm run dev
```

- Server sẽ chạy ở `http://localhost:5173`

```

Thực hiện các bước:
1. Tải lên nhiều hình ảnh
2. Chọn kiểu ghép ảnh: **Ngang** hoặc **Dọc**
3. Tuỳ chỉnh viền: màu sắc, độ dày
4. Nhấn `Make Collage`
5. Chờ xử lý và tải về ảnh kết quả

---


✅ Sau khi hoàn tất, bạn đã có thể sử dụng một công cụ ghép ảnh online chuyên nghiệp, dễ dùng và tiện lợi để chia sẻ lên mạng xã hội!

