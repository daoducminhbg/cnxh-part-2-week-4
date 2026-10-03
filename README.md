# KỲ HỌP NGHỊ TRƯỜNG - XỬ LÝ HỒ SƠ & TRƯNG CẦU Ý DÂN
## Ứng Dụng Tương Tác Thời Gian Thực (Real-time Interactive Web App) • Vòng 2 CNXHKH

Dự án được thiết kế chuyên biệt cho buổi thuyết trình/mô phỏng **Vòng 2 môn Chủ nghĩa Xã hội Khoa học** theo chủ đề: **"Bản chất nền Dân chủ XHCN - Quyền lực thuộc về nhân dân"**, kết hợp hài hòa giữa **Dân chủ đại diện** (3 đại biểu trên bục điều hành) và **Dân chủ trực tiếp** (60 sinh viên dưới lớp quét mã QR biểu quyết chính sách tức thì).

---

### 🏛️ 1. KIẾN TRÚC 3 MÀN HÌNH ĐỒNG BỘ THỜI GIAN THỰC (MULTI-VIEW)

| Tuyến giao diện | Đường dẫn URL | Đối tượng sử dụng | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Màn Chiếu Sân Khấu** | `/projector` | Máy chiếu hội trường | Hiển thị hồ sơ nghị trường kính mờ Glassmorphism, lưới phương án A-B, bảng quyền trợ giúp, mã QR biểu quyết phóng to, animation cột sóng % nhảy số và hiệu ứng chúc mừng pháo hoa Confetti. |
| **Cử Tri Mobile** | `/vote` | 60 Sinh viên dưới lớp | Tối ưu siêu nhẹ cho mạng 4G/Wifi trường học, không cần đăng nhập. Tự động rung (haptic), hiện nút bấm A/B to bản khi mở Trưng cầu ý dân, khóa chống spam 2 lần. |
| **Bàn Điều Khiển Chủ Tọa** | `/admin` | Leader (Đào Đức Minh) | Chuyển đổi linh hoạt giữa 3 Hồ sơ, kích hoạt quyền trợ giúp, mở cổng Trưng cầu ý dân (15s, 30s, 45s), công bố kết quả biểu quyết, chốt đáp án chính thức và soundboard âm thanh. |

---

### 🎨 2. TỔNG QUAN THIẾT KẾ (THEME & AESTHETICS)
- **Phong cách:** Neo-Socialist Academic Cyberpunk (Kết hợp giữa uy nghiêm nghị trường và công nghệ trình chiếu tương tác hiện đại).
- **Màu sắc:** Đỏ thẫm quốc gia (`#7F1D1D`, `#991B1B`), Vàng ánh kim quốc huy (`#F59E0B`, `#FBBF24`), Nền đá granite hội trường (`#070A10`, `#0B0F19`).
- **Textures:** Hoa văn sóng chứng chỉ/tiền tệ Guilloché, texture đá cẩm thạch tối màu, hình họa ngôi sao mặt trời Trống đồng Đông Sơn 14 cánh xoay chậm.
- **Biểu tượng:** 100% SVG Icons từ thư viện `lucide-react`. **Tuyệt đối không dùng emoji.**
- **Âm thanh:** Tích hợp bộ tổng hợp âm thanh đa tần **Web Audio API Procedural Synthesizer** (tiếng gõ búa khai mạc gỗ, tiếng tíc tắc đếm ngược hồi hộp, chuông hết giờ, tiếng kèn chiến thắng Victory Fanfare, tiếng vỗ tay tán thành) **chạy offline 100% không lo lỗi mạng hay 404**.

---

### 🚀 3. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN

#### Bước 1: Khởi động máy chủ phát triển
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:3000`

#### Bước 2: Thao tác chạy thử nghiệm trên máy tính
1. Mở tab 1: `http://localhost:3000/projector` (Màn chiếu chính)
2. Mở tab 2: `http://localhost:3000/admin` (Bảng điều khiển của bạn)
3. Mở tab 3: `http://localhost:3000/vote` (Giả lập 1 cử tri trên điện thoại)
4. Thử bấm **"MỞ CỔNG TRƯNG CẦU (30S)"** trên trang Admin:
   - Ngay lập tức trên Màn chiếu (`/projector`) sẽ bung mã QR khổng lồ kèm đồng hồ đếm ngược.
   - Trên tab Cử tri (`/vote`) sẽ rung nhẹ và hiện nút A, B để bấm vote.
   - Khi vote xong, số liệu sẽ nhảy thời gian thực lên cả 3 màn hình!

#### Bước 3: Cho 60 sinh viên quét mã trên lớp học
- Khi chiếu trên lớp, đảm bảo laptop của bạn kết nối chung mạng Wi-Fi của lớp/trường hoặc phát Wi-Fi từ điện thoại.
- Lấy địa chỉ IP mạng nội bộ của laptop (Ví dụ: `http://192.168.1.15:3000`):
  ```bash
  # Chạy mở rộng mạng LAN:
  npm run dev -- -H 0.0.0.0
  ```
- Hoặc deploy 1 click lên **Vercel** / **Cloudflare Pages** để có đường link tên miền online HTTPS vĩnh viễn (Cử tri quét camera iPhone/Android tự động mở ngay).

---

### ⚡ 4. TÙY CHỌN KẾT NỐI SUPABASE REALTIME (TÙY CHỌN NÂNG CAO)
Mặc định ứng dụng đã tích hợp sẵn cơ chế **Dual-Engine Realtime**:
- **Chế độ 1 (Offline / Local):** Tự động dùng `BroadcastChannel` và `API State Polling` trên mạng nội bộ.
- **Chế độ 2 (Production Supabase):** Nếu bạn muốn độ trễ < 50ms qua Cloud khi có hàng trăm thiết bị cùng lúc:
  1. Tạo project miễn phí tại [supabase.com](https://supabase.com).
  2. Điền thông tin vào file `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```
  3. Chạy file SQL `supabase_schema.sql` trong SQL Editor của Supabase để bật tính năng Realtime Broadcast.

---

### 📚 5. DỮ LIỆU 3 TÌNH HUỐNG CHUẨN CHƯƠNG 4 CNXHKH
1. **Hồ sơ số 01:** *"Kinh tế tư nhân & Bản chất kinh tế của nền Dân chủ Xã hội Chủ nghĩa"*
   - Căn cứ: Văn kiện Đại hội XIII & Hiến pháp 2013 (Điều 51).
   - Đáp án đúng: Phương án B (Kinh tế tư nhân là động lực quan trọng của nền KTTT định hướng XHCN).
2. **Hồ sơ số 02:** *"Thực thi quyền lực & Quy chế Dân chủ ở cơ sở"*
   - Căn cứ: Luật Thực hiện Dân chủ ở cơ sở 2022.
   - Đáp án đúng: Phương án B (Phương châm "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng").
3. **Hồ sơ số 03:** *"Trách nhiệm công dân & Phát huy Dân chủ trực tiếp"*
   - Căn cứ: Giáo trình Chủ nghĩa Xã hội Khoa học - Bộ GD&ĐT.
   - Đáp án đúng: Phương án B (Thực thi hình thức dân chủ trực tiếp, rèn luyện văn hóa dân chủ của công dân trẻ).
