# Cấu hình Supabase lưu thông tin khách hàng

Website ghi lead vào Supabase trước. API chỉ báo tiếp nhận thành công sau khi Supabase xác nhận đã tạo hoặc đã có lead trùng theo khóa gửi lại. Email Outlook là bước thông báo riêng; nếu email lỗi, dữ liệu vẫn được lưu và trạng thái thông báo được ghi trong bảng.

## 1. Tạo project Supabase

1. Đăng nhập [Supabase](https://supabase.com/dashboard) và tạo project cho Eurowindow.
2. Chờ database khởi tạo xong, mở **Project Settings → API**.
3. Sao chép **Project URL**. Đây là giá trị `SUPABASE_URL`.
4. Trong tab **Publishable and secret API keys**, tạo/sao chép khóa **Secret** bắt đầu bằng `sb_secret_`. Đây là giá trị `SUPABASE_SERVICE_ROLE_KEY`. Nếu project chưa có khóa mới, dùng khóa JWT **service_role** ở phần Legacy API keys; API hỗ trợ cả hai kiểu.
5. Không dùng khóa `anon`/`publishable` cho API này. Không thêm tiền tố `NEXT_PUBLIC_`, không gửi khóa Secret/service role qua chat, email hoặc trình duyệt. Khóa `sb_secret_` chỉ được gửi bằng header `apikey`; API không đặt nó vào `Authorization: Bearer` vì đây không phải JWT.

## 2. Tạo bảng và bật bảo vệ dữ liệu

1. Trong Supabase, mở **SQL Editor → New query**.
2. Mở file [`supabase/migrations/202610300001_create_customer_leads.sql`](../supabase/migrations/202610300001_create_customer_leads.sql), sao chép toàn bộ và dán vào SQL Editor.
3. Bấm **Run**. Migration tạo `customer_leads`, bảng giới hạn gửi, chỉ mục tra cứu, RLS và RPC ghi dữ liệu chỉ dành cho service role.
4. Trong **Table Editor → customer_leads → Policies**, xác nhận RLS đang bật và không có policy đọc/ghi công khai. API không dùng anon key và không cung cấp API đọc lead.

`customer_leads` lưu mã khách hàng, họ tên, điện thoại, email, địa chỉ công trình, sản phẩm quan tâm, nhu cầu, loại công trình, vị trí lắp đặt, nội dung yêu cầu, trang gửi, thời điểm gửi, trạng thái tư vấn và trạng thái email. Mặc định trạng thái lead là `new`. Các trạng thái hỗ trợ quản trị sau này: `contacted`, `consulting`, `quoted`, `won`, `closed`.

## 3. Cấu hình máy local

Sao chép `.env.example` thành `.env.local`, sau đó điền:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<deployment-id>/exec
GOOGLE_APPS_SCRIPT_SECRET=<shared-secret-da-cau-hinh-trong-apps-script>
```

Hai biến Google Apps Script cần thiết để gửi email Outlook qua tích hợp đã có. Nếu chưa cấu hình, lead vẫn được lưu trong Supabase với `notification_status = unconfigured`; biểu mẫu vẫn báo đã tiếp nhận vì dữ liệu đã được ghi.

Khởi động lại Next.js sau khi thay `.env.local`. Không đưa `.env.local` vào Git.

## 4. Cấu hình trên Vercel

1. Mở Vercel → project **eurowindow-website** → **Settings → Environment Variables**.
2. Thêm `SUPABASE_URL` với Project URL.
3. Thêm `SUPABASE_SERVICE_ROLE_KEY` với service role key và chọn kiểu **Secret**.
4. Chọn môi trường **Production**, **Preview** và **Development** mà bạn cần.
5. Giữ các biến `GOOGLE_APPS_SCRIPT_URL` và `GOOGLE_APPS_SCRIPT_SECRET` hiện có để nhận email qua Outlook.
6. Lưu biến rồi tạo deployment mới để Vercel nạp biến môi trường.

Không đặt biến Supabase nào bắt đầu bằng `NEXT_PUBLIC_`.

## 5. Kiểm tra sau khi cấu hình

Gửi thử một biểu mẫu từ website. Kiểm tra:

- API trả `success: true` và có `customerCode`.
- Supabase **Table Editor → customer_leads** có bản ghi tương ứng.
- `notification_status` chuyển thành `sent` nếu Apps Script xác nhận email; nếu không, xem `failed`/`unconfigured` và `notification_error_code`.
- Email thông báo được gửi đến `hoangnm3@eurowindow.biz` theo cấu hình người nhận trong Google Apps Script.

Gửi lại cùng nội dung trong cùng cửa sổ 10 phút sẽ dùng khóa idempotency và không tạo lead/email trùng. Giới hạn gửi là 5 yêu cầu mỗi IP trong 10 phút, được kiểm tra trong database và bổ sung bằng giới hạn tại runtime.

## Lưu ý vận hành

- API hiện chỉ tạo lead và cập nhật trạng thái thông báo email; không có endpoint công khai để đọc, sửa hoặc xóa dữ liệu khách hàng.
- Bảng rate-limit chỉ giữ hash IP, không lưu địa chỉ IP thô; các mục cũ hơn một ngày được dọn trong lần nhận yêu cầu tiếp theo.
- Email được thử gửi ngay sau khi lưu. Nếu email lỗi, lead còn nguyên trong Supabase để nhóm xử lý; có thể lọc theo `notification_status`.
