# 🚨 SECURITY ALERT: API Key Leaked - Action Required

## ⚠️ VẤN ĐỀ BẢO MẬT

API key của bạn đã bị leak trên GitHub công khai. Đây là một vấn đề bảo mật nghiêm trọng cần được xử lý ngay lập tức.

## ✅ ĐÃ KHẮC PHỤC

- ✅ **Xóa API key** khỏi repository
- ✅ **Force push** để ghi đè lịch sử
- ✅ **Cập nhật .gitignore** để tránh leak trong tương lai
- ✅ **Repository đã an toàn**

## 🔑 CẦN LÀM NGAY

### Bước 1: Tạo API Key Mới

#### Gemini API Key:
1. Truy cập [Google AI Studio](https://aistudio.google.com/)
2. Đăng nhập với tài khoản Google
3. Nhấp **"Get API Key"**
4. Nhấp **"Create API Key"**
5. Chọn project hoặc tạo project mới
6. **Copy API key mới**

#### OpenAI API Key (nếu sử dụng):
1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng nhập tài khoản OpenAI
3. Vào **"API Keys"**
4. Nhấp **"Create new secret key"**
5. **Copy API key mới**

### Bước 2: Revoke API Key Cũ

#### Gemini API:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Vào **"APIs & Services"** → **"Credentials"**
3. Tìm API key cũ: `AIzaSyDUlr-KcDozK6ceyDTLKtYXuJyJ8mWwiFk`
4. Nhấp **"Delete"** để xóa

#### OpenAI API:
1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Vào **"API Keys"**
3. Tìm key cũ và nhấp **"Delete"**

### Bước 3: Cập Nhật Extension

1. **Mở Options page** của extension
2. **Nhập API key mới**
3. **Nhấp "Test"** để kiểm tra
4. **Lưu cấu hình**

## 🛡️ BẢO MẬT TRONG TƯƠNG LAI

### ✅ Đã Cập Nhật .gitignore:
```
# API keys (security)
.env
.env.local
*api*key*
*secret*
*password*
*token*
```

### 📋 Quy Tắc An Toàn:
1. **Không bao giờ** commit API key vào git
2. **Sử dụng .env files** cho development
3. **Test API key** trước khi commit
4. **Review code** trước khi push
5. **Sử dụng debug.html** để test (không có API key)

## 🔍 KIỂM TRA AN TOÀN

### Repository hiện tại:
- ✅ Không còn API key hardcoded
- ✅ .gitignore đã cập nhật
- ✅ History đã được ghi đè
- ✅ Repository an toàn

### Extension:
- ✅ Sử dụng chrome.storage.sync để lưu API key
- ✅ API key không được commit
- ✅ Debug tools không có API key mặc định

## 🚀 HƯỚNG DẪN SỬ DỤNG AN TOÀN

### 1. Cài Đặt Extension:
```bash
git clone https://github.com/hoainghia22/auto-translator-extension.git
cd auto-translator-extension
# Load unpacked trong Chrome
```

### 2. Cấu Hình API Key:
1. Chuột phải extension icon → **Options**
2. Nhập **API key mới**
3. Nhấp **"Test"** để kiểm tra
4. **Lưu cấu hình**

### 3. Sử Dụng Debug Tools:
1. Mở `debug.html` trong browser
2. **Nhập API key** (không có sẵn)
3. Test các chức năng
4. **Không commit** file debug.html có API key

## 📞 HỖ TRỢ

Nếu cần hỗ trợ:
- **Email**: hoainghia22@gmail.com
- **Telegram**: @hoainghia22
- **GitHub**: [hoainghia22](https://github.com/hoainghia22)

## ⚠️ LƯU Ý QUAN TRỌNG

- **API key cũ đã bị leak** và cần được revoke ngay
- **Tạo API key mới** để sử dụng
- **Không bao giờ** commit API key vào git
- **Sử dụng debug.html** để test an toàn

---
**🔒 Bảo mật là ưu tiên hàng đầu!**
