📸 Online Photo Collage Tool
Author: Nguyễn Anh Tuấn 

⚙️ Mô tả
Vì nhiều người trong chúng ta muốn đăng ảnh ghép (photo collages) lên mạng xã hội, nên việc có một công cụ trực tuyến để kết hợp ảnh đơn giản mà không cần mở phần mềm chỉnh sửa ảnh là rất hữu ích. Công cụ ghép ảnh này sẽ cho phép người dùng tải ảnh lên và ghép chúng lại theo một hàng ngang hoặc cột dọc một cách gọn gàng.


🧩 Tính năng
✅ Tải nhiều hình ảnh lên không cần tài khoản
✅ Chọn kiểu ghép: Ngang hoặc Dọc
✅ Tuỳ chỉnh viền ảnh: độ dày, màu sắc
✅ Nút Make Collage để xử lý ảnh
✅ Hiển thị trạng thái đang xử lý
✅ Tải về ảnh kết quả sau khi xử lý


Thành phần	Công nghệ	Vai trò
Frontend UI	React.js / Vue.js	Giao diện người dùng.
Backend API	Flask / Express.js	Xử lý API và quản lý tác vụ.
Task Queue	Celery + Redis	Chạy tác vụ xử lý ảnh bất đồng bộ.
Storage (tuỳ chọn)	File system / Amazon S3	Lưu trữ ảnh tạm thời hoặc lâu dài.

🛠️ Các kỹ năng rèn luyện
📌 Backend & DevOps
Xây dựng REST API với Flask/Express
Upload và lưu trữ ảnh tạm thời
Giao tiếp với Celery Task Queue
Chạy ứng dụng bằng Docker
Xoá ảnh định kỳ bằng cron job/Celery
🧮 Xử lý ảnh
Resize ảnh giữ đúng tỉ lệ
Ghép ảnh theo chiều ngang hoặc dọc
Thêm viền màu cho ảnh
Lưu ảnh kết quả và trả về frontend
💡 Frontend
Upload và preview ảnh
Gửi ảnh và tuỳ chọn lên API
Theo dõi tiến trình xử lý ảnh qua task_id
Hiển thị ảnh kết quả và tải xuống
