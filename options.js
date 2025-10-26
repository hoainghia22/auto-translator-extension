/**
 * Auto Translator Extension - Options Script
 * Copyright © 2024 Hoài Nghĩa - Cafe Nhớ
 * 
 * This file handles the options page functionality including
 * API key management and validation.
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
  const geminiKey = document.getElementById('gemini-key');
  const openaiKey = document.getElementById('openai-key');
  const saveBtn = document.getElementById('save-options');
  const status = document.getElementById('options-status');

  // Load saved keys
  chrome.storage.sync.get(['geminiKey', 'openaiKey'], function(result) {
    if (result.geminiKey) geminiKey.value = result.geminiKey;
    if (result.openaiKey) openaiKey.value = result.openaiKey;
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
    }, 4000);
  }

  // Validate API key format
  function validateApiKey(key, type) {
    if (!key || key.trim() === '') {
      return false;
    }
    
    if (type === 'gemini') {
      // Gemini API key format validation - more flexible
      return key.length >= 20 && (key.includes('AIza') || key.includes('ya29'));
    } else if (type === 'openai') {
      // OpenAI API key format validation
      return key.length >= 20 && key.startsWith('sk-');
    }
    
    return true;
  }

  saveBtn.addEventListener('click', function() {
    const gemini = geminiKey.value.trim();
    const openai = openaiKey.value.trim();
    
    // Validate inputs
    if (gemini && !validateApiKey(gemini, 'gemini')) {
      showStatus('❌ Gemini API key không đúng định dạng!', 'error');
      return;
    }
    
    if (openai && !validateApiKey(openai, 'openai')) {
      showStatus('❌ OpenAI API key không đúng định dạng!', 'error');
      return;
    }
    
    // Disable button during save
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Đang lưu...';
    
    chrome.storage.sync.set({ geminiKey: gemini, openaiKey: openai }, function() {
      showStatus('✅ Đã lưu API keys thành công!', 'success');
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Lưu API Keys';
    });
  });

  // Add input validation feedback
  function addInputValidation(input, type) {
    input.addEventListener('input', function() {
      const value = this.value.trim();
      
      if (value === '') {
        this.style.borderColor = '#e2e8f0';
        return;
      }
      
      if (validateApiKey(value, type)) {
        this.style.borderColor = '#48bb78';
        this.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
      } else {
        this.style.borderColor = '#f56565';
        this.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
      }
    });
    
    input.addEventListener('blur', function() {
      setTimeout(() => {
        this.style.borderColor = '#e2e8f0';
        this.style.boxShadow = 'none';
      }, 100);
    });
  }

  addInputValidation(geminiKey, 'gemini');
  addInputValidation(openaiKey, 'openai');

  // Add test API key buttons
  const testGeminiBtn = document.createElement('button');
  testGeminiBtn.textContent = '🧪 Test Gemini';
  testGeminiBtn.style.cssText = 'margin-left: 10px; padding: 8px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;';
  geminiKey.parentElement.appendChild(testGeminiBtn);

  const testOpenaiBtn = document.createElement('button');
  testOpenaiBtn.textContent = '🧪 Test OpenAI';
  testOpenaiBtn.style.cssText = 'margin-left: 10px; padding: 8px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;';
  openaiKey.parentElement.appendChild(testOpenaiBtn);

  testGeminiBtn.addEventListener('click', async function() {
    const key = geminiKey.value.trim();
    if (!key) {
      showStatus('Vui lòng nhập Gemini API key trước khi test', 'error');
      return;
    }
    
    testGeminiBtn.disabled = true;
    testGeminiBtn.textContent = '⏳ Testing...';
    
    const result = await testApiKey(key, 'gemini');
    showStatus(result.message, result.success ? 'success' : 'error');
    
    testGeminiBtn.disabled = false;
    testGeminiBtn.textContent = '🧪 Test Gemini';
  });

  testOpenaiBtn.addEventListener('click', async function() {
    const key = openaiKey.value.trim();
    if (!key) {
      showStatus('Vui lòng nhập OpenAI API key trước khi test', 'error');
      return;
    }
    
    testOpenaiBtn.disabled = true;
    testOpenaiBtn.textContent = '⏳ Testing...';
    
    const result = await testApiKey(key, 'openai');
    showStatus(result.message, result.success ? 'success' : 'error');
    
    testOpenaiBtn.disabled = false;
    testOpenaiBtn.textContent = '🧪 Test OpenAI';
  });

  // Add click animation to save button
  saveBtn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  
  saveBtn.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
  });

  // Add focus effects for inputs
  const inputs = document.querySelectorAll('input[type="password"]');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });

  // Test API key function with enhanced debugging
  async function testApiKey(key, type) {
    try {
      if (type === 'gemini') {
        console.log('🔍 Testing Gemini API key:', key.substring(0, 10) + '...');
        
        // First, try to list available models
        try {
          console.log('📋 Fetching available models...');
          const modelsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
            method: 'GET',
            headers: {
              'x-goog-api-key': key
            }
          });
          
          if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('✅ Available models:', modelsData);
            
            // Extract model names that support generateContent
            const availableModels = modelsData.models
              ?.filter(model => model.supportedGenerationMethods?.includes('generateContent'))
              ?.map(model => model.name.replace('models/', ''))
              || [];
            
            console.log('🎯 Models supporting generateContent:', availableModels);
            
            if (availableModels.length === 0) {
              return { success: false, message: '❌ Không có model nào hỗ trợ generateContent' };
            }
            
            // Try the available models
            for (const model of availableModels) {
              try {
                console.log(`🧪 Testing model: ${model}`);
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': key
                  },
                  body: JSON.stringify({
                    contents: [{
                      parts: [{
                        text: 'Hello'
                      }]
                    }]
                  })
                });

                if (response.ok) {
                  const data = await response.json();
                  console.log(`✅ Model ${model} working:`, data);
                  return { success: true, message: `✅ Gemini API key hợp lệ! (Model: ${model})` };
                } else {
                  const errorData = await response.text();
                  console.log(`❌ Model ${model} failed:`, response.status, errorData);
                }
              } catch (error) {
                console.error(`Error testing model ${model}:`, error);
              }
            }
            
            return { success: false, message: '❌ Có model khả dụng nhưng không thể generate content' };
          } else {
            const errorData = await modelsResponse.text();
            console.error('❌ Failed to fetch models:', modelsResponse.status, errorData);
            return { success: false, message: `❌ Không thể truy cập Gemini API: ${modelsResponse.status} - ${errorData}` };
          }
        } catch (error) {
          console.error('❌ Error fetching models:', error);
          return { success: false, message: `❌ Lỗi kết nối Gemini API: ${error.message}` };
        }
      } else if (type === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`
          }
        });

        if (response.ok) {
          return { success: true, message: '✅ OpenAI API key hợp lệ!' };
        } else {
          const errorData = await response.text();
          return { success: false, message: `❌ OpenAI API lỗi: ${response.status} - ${errorData}` };
        }
      }
    } catch (error) {
      return { success: false, message: `❌ Lỗi test API: ${error.message}` };
    }
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveBtn.click();
    }
  });
});
