# Auto Translator Extension

Extension Chrome để dịch văn bản được bôi đen từ tiếng Việt sang ngôn ngữ đích sử dụng API Gemini hoặc OpenAI.

## Cài đặt

1. Tải xuống hoặc clone repository này.
2. Mở Chrome và đi đến `chrome://extensions/`.
3. Bật "Developer mode" ở góc trên bên phải.
4. Nhấp "Load unpacked" và chọn thư mục chứa extension này.

## Cấu hình

1. Nhấp vào icon extension để mở popup.
2. Chọn API (Gemini hoặc OpenAI), ngôn ngữ đích, và bật/tắt "Tự động dịch khi gõ".
3. Nhấp vào "Lưu Cấu hình".

4. Nhấp chuột phải trên icon extension > Options để nhập API keys:
   - Gemini API Key: Lấy từ Google AI Studio.
   - OpenAI API Key: Lấy từ OpenAI platform.

## Sử dụng

### Dịch thủ công:
1. Bôi đen văn bản cần dịch (tiếng Việt).
2. Nhấn phím tắt mặc định `Ctrl+Shift+Y` (hoặc `Cmd+Shift+Y` trên Mac) để dịch, hoặc phím tắt tùy chỉnh (xem bên dưới).
3. Văn bản sẽ được thay thế bằng bản dịch.

#### Tùy chỉnh phím tắt:
- Mở `chrome://extensions/shortcuts`
- Tìm "Auto Translator Extension"
- Thay đổi phím tắt cho "translate-selection" theo ý muốn.

**Lưu ý:** Phím tắt mặc định đã được thay đổi từ `Ctrl+Shift+T` thành `Ctrl+Shift+Y` để tránh xung đột với chức năng "Mở lại cửa sổ đã đóng" của Chrome.

### Tự động dịch:
- Nếu bật option "Tự động dịch khi gõ", khi bạn gõ vào bất kỳ input text hoặc textarea nào và rời khỏi (blur), văn bản sẽ tự động dịch sang ngôn ngữ đích.

## Tính năng

- 🌐 **Hỗ trợ đa ngôn ngữ**: English, Français, Español, Deutsch, 中文, 日本語, 한국어
- 🤖 **Hai API mạnh mẽ**: Gemini AI và OpenAI GPT
- ⌨️ **Phím tắt tùy chỉnh**: Dịch nhanh với phím tắt
- ✨ **Tự động dịch**: Dịch tự động khi gõ trong input fields
- 🎨 **Giao diện hiện đại**: Thiết kế đẹp mắt với animations
- 📱 **Responsive**: Tối ưu cho mọi thiết bị
- 🔒 **Bảo mật**: API keys được mã hóa và lưu trữ an toàn

## Lưu ý

- Đảm bảo API keys hợp lệ và có đủ credits.
- Extension chỉ hoạt động trên trang web cho phép content scripts.
- Nếu gặp lỗi, kiểm tra console của trang web hoặc extension.

## Bản quyền

Copyright © 2024 **Hoài Nghĩa - Cafe Nhớ**. Tất cả quyền được bảo lưu.

### Giấy phép

Extension này được phân phối dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

### Thông tin liên hệ

- **Tác giả**: Hoài Nghĩa - Cafe Nhớ
- **Email**: hoainghia02@gmail.com
- **Telegram**: [@hoainghia86](https://t.me/hoainghia86)
- **GitHub**: [hoainghia](https://github.com/hoainghia22)
- **Website**: [Cafe Nhớ](https://cafenho.net)

### Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request trên GitHub repository.

### Lời cảm ơn


