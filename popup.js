/**
 * Auto Translator Extension - Popup Script
 * Copyright © 2024 Hoài Nghĩa - Cafe Nhớ
 * 
 * This file handles the popup interface functionality including
 * settings management and user interactions.
 * 
 * Author: Hoài Nghĩa - Cafe Nhớ
 * Email: hoainghia02@gmail.com
 * Telegram: @hoainghia86
 * GitHub: https://github.com/hoainghia22
 * Website: https://cafenho.net
 * 
 * Licensed under MIT License
 */

document.addEventListener('DOMContentLoaded', function() {
  const apiSelect = document.getElementById('api-select');
  const langSelect = document.getElementById('target-lang');
  const saveBtn = document.getElementById('save-btn');
  const status = document.getElementById('status');
  const autoTranslateCheckbox = document.getElementById('auto-translate');

  // Load saved settings
  chrome.storage.sync.get(['api', 'targetLang', 'autoTranslate'], function(result) {
    if (result.api) apiSelect.value = result.api;
    if (result.targetLang) langSelect.value = result.targetLang;
    if (result.autoTranslate) autoTranslateCheckbox.checked = result.autoTranslate;
  });

  // Show status with animation
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type} show`;
    
    setTimeout(() => {
      status.classList.remove('show');
      setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
      }, 300);
    }, 3000);
  }

  saveBtn.addEventListener('click', function() {
    const api = apiSelect.value;
    const targetLang = langSelect.value;
    const autoTranslate = autoTranslateCheckbox.checked;
    
    // Disable button during save
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Đang lưu...';
    
    // Validate API key exists before saving
    chrome.storage.sync.get(['geminiKey', 'openaiKey'], function(keys) {
      if (api === 'gemini' && !keys.geminiKey) {
        showStatus('❌ Vui lòng cấu hình Gemini API key trong Options trước!', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Lưu Cấu hình';
        return;
      }
      if (api === 'openai' && !keys.openaiKey) {
        showStatus('❌ Vui lòng cấu hình OpenAI API key trong Options trước!', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Lưu Cấu hình';
        return;
      }
      
      chrome.storage.sync.set({ api, targetLang, autoTranslate }, function() {
        showStatus('✅ Đã lưu thành công!', 'success');
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Lưu Cấu hình';
      });
    });
  });

  // Add hover effects for better UX
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    select.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });

  // Add click animation to save button
  saveBtn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  saveBtn.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
  });
});
