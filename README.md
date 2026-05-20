# NutriCheck

Dự án frontend `NutriCheck` dùng để kiểm tra dinh dưỡng và ghi nhật ký ăn uống.

## Tính năng

- Public:
  - Tìm kiếm thực phẩm trong danh sách.
  - Xem chi tiết dinh dưỡng từng món.
  - Thêm món ăn vào nhật ký trong ngày.
  - Tính tổng calo/ngày và tỉ lệ macro (Protein/Carb/Fat).
- Admin:
  - Thêm, sửa, xóa thực phẩm.
  - Gán nhóm dinh dưỡng cho mỗi món.

## Cấu trúc thư mục

- `index.html` — Trang người dùng (public)
- `admin.html` — Trang quản trị dữ liệu món ăn
- `css/style.css` — Style chính
- `js/api.js` — Tập trung gọi Mock API hoặc dữ liệu giả
- `js/main.js` — Logic trang chính với nhật ký và tổng hợp dinh dưỡng
- `js/admin.js` — Logic trang quản trị
- `js/utils.js` — Các hàm tiện ích
- `img/` — Chứa ảnh giao diện nếu cần

## MockAPI resources

- `foods`
- `diary_entries`

## Cách chạy

1. Mở `index.html` bằng trình duyệt.
2. Mở `admin.html` để quản lý danh sách món ăn.

## Ghi chú

- `js/api.js` hiện đang sử dụng dữ liệu giả nếu không cấu hình `API_BASE`.
- Nếu bạn có MockAPI, hãy sửa `API_BASE` trong `js/api.js`.
