# Đặc tả yêu cầu: Thẻ sản phẩm nổi bật

## Mục tiêu

Khắc phục khu vực “Các dòng cửa nổi bật” trên trang chủ để mọi thẻ sản phẩm đều hiển thị đầy đủ nội dung.

## Hiện trạng

Ảnh người dùng cung cấp cho thấy băng chuyền có các vị trí thẻ trống. Lần sửa trước đã bỏ hiệu ứng `reveal` khỏi thẻ, nhưng khi kéo rồi thả, nội dung vẫn biến mất.

Phân tích thao tác kéo cho thấy vị trí con trỏ được cuộn vòng trong phạm vi track, nhưng tọa độ snap sau khi thả chưa được giới hạn. Lực quán tính và làm tròn có thể tạo đích nằm ngoài nhóm bản sao; animation khi đó đưa track vào vùng không có thẻ.

## Phạm vi

- Sửa cách hiển thị thẻ trong băng chuyền “Các dòng cửa nổi bật”.
- Giữ track trong vùng có bản sao thẻ ở mọi thời điểm kéo, snap và tự chạy.
- Giữ nguyên danh sách, ảnh, tiêu đề, mô tả, liên kết, nút tạm dừng/tiếp tục và thao tác kéo hiện có.
- Không thay đổi các khu vực sản phẩm khác.

## Tiêu chí chấp nhận

1. Cả năm thẻ sản phẩm nổi bật đều hiển thị ảnh và phần chữ; không có thẻ bị ẩn do trạng thái `reveal`.
2. Kéo theo cả hai hướng rồi thả không làm track trượt vào vùng trống; thẻ vẫn hiển thị trong lúc snap và sau khi snap.
3. Tự chạy và vòng lặp tiếp tục hoạt động trong phạm vi các bản sao của track.
4. Bản sao dùng cho vòng lặp tiếp tục được ẩn khỏi công nghệ hỗ trợ và không nhận focus bàn phím.
5. Nội dung, thứ tự và đích liên kết của các thẻ không thay đổi.

## Ngoài phạm vi

- Thay đổi thiết kế hoặc nội dung của thẻ.
- Thay băng chuyền bằng lưới tĩnh.
- Sửa các ảnh sản phẩm 404 không thuộc khu vực này.
