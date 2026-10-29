# Kết nối biểu mẫu Eurowindow với Outlook và Google Sheets

Website gửi yêu cầu đến API Route `/api/contact`. API này kiểm tra dữ liệu, origin, honeypot và giới hạn gửi trước khi gọi Google Apps Script. Apps Script xác thực secret dùng chung, áp dụng giới hạn bổ sung, chống xử lý trùng, gửi email bằng `MailApp` đến `hoangnm3@eurowindow.biz` và lưu thông tin vào Google Sheets.

Mã Apps Script nằm tại `google-apps-script/Code.gs`. Website không kết nối SMTP Outlook và không đưa secret vào trình duyệt.

## 1. Tạo Google Sheet

1. Tạo một Google Spreadsheet mới trong tài khoản Google sẽ sở hữu Apps Script.
2. Sao chép Spreadsheet ID từ URL: phần nằm giữa `/d/` và `/edit`.
3. Script sẽ tạo tab `Website Leads` và hàng tiêu đề khi nhận yêu cầu đầu tiên.

Các cột gồm mã khách hàng, thời gian, họ tên, điện thoại, email, địa chỉ công trình, nhu cầu/sản phẩm, loại công trình, vị trí lắp đặt, nội dung, trang gửi, trạng thái xử lý và mã yêu cầu. Trạng thái ban đầu là `Mới`.

## 2. Tạo và cấp quyền cho Apps Script

1. Mở [script.google.com](https://script.google.com), tạo project độc lập và dán nội dung `google-apps-script/Code.gs` vào `Code.gs`.
2. Trong **Project Settings → Script Properties**, thêm:
   - `SPREADSHEET_ID`: ID của Spreadsheet.
   - `SHARED_SECRET`: chuỗi ngẫu nhiên dài tối thiểu 32 byte.
3. Tạo secret trong PowerShell bằng `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Dùng cùng giá trị ở Apps Script và Vercel; không gửi secret qua email hoặc đưa vào Git.
4. Chọn hàm `authorizeServices` trong Apps Script và bấm **Run**. Duyệt quyền truy cập Google Sheets và gửi email. Hàm này chỉ kiểm tra quyền, không gửi thư.
5. Mở **Deploy → New deployment → Web app**:
   - **Execute as:** Me.
   - **Who has access:** Anyone.
   - Bấm Deploy và chấp thuận quyền.
6. Sao chép URL Web App kết thúc bằng `/exec`. Nếu Google Workspace không cho chọn quyền truy cập `Anyone`, quản trị viên Workspace cần bật quyền này cho Apps Script Web Apps.

## 3. Cấu hình Vercel

Trong **Project → Settings → Environment Variables**, thêm hai biến server-side cho Production (và Preview nếu cần thử nghiệm):

- `GOOGLE_APPS_SCRIPT_URL`: URL `/exec` vừa triển khai.
- `GOOGLE_APPS_SCRIPT_SECRET`: cùng giá trị `SHARED_SECRET` đã lưu trong Script Properties.

Sau khi lưu biến, redeploy project `eurowindow-website`. Không đặt hai biến này với tiền tố `NEXT_PUBLIC_`.

GitHub Pages chỉ là bản tĩnh; các biểu mẫu ở đó gửi qua API Production của Vercel. API cho phép origin `https://nethoang732.github.io` để xử lý trường hợp này.

## 4. Gửi thử và theo dõi

Gửi biểu mẫu thử từ website. Khi thành công, trang xác nhận đã gửi, Google Sheets có dòng trạng thái `Mới`, và Outlook nhận email HTML. Nếu Vercel trả lỗi cấu hình, kiểm tra hai biến môi trường; nếu Apps Script trả lỗi, kiểm tra quyền triển khai, `SPREADSHEET_ID`, `SHARED_SECRET` và quota `MailApp`.

Form hiện tại thu thập địa chỉ công trình thay cho email người gửi. Vì giữ nguyên giao diện theo yêu cầu, bản ghi và email thông báo vẫn có trường Email nhưng ghi `Chưa cung cấp trong biểu mẫu` khi form không có email. Email sẽ được lưu/gửi nếu một biểu mẫu đang hoạt động có trường email.

## Bảo vệ dữ liệu

- API chỉ chấp nhận same-origin và origin GitHub Pages đã khai báo; có giới hạn 5 yêu cầu mỗi IP trong 10 phút trên từng instance.
- Apps Script kiểm tra secret, áp dụng giới hạn bổ sung bằng CacheService, tuần tự hóa ghi bằng LockService và kiểm tra mã yêu cầu trong Sheet trước khi xử lý lại.
- Nếu Apps Script chưa được triển khai hoặc secrets chưa cấu hình, API trả lỗi kết nối có thể hiển thị cho người dùng; website không báo thành công giả.
