/**
 * Auto Translator Extension - Content Script
 * Copyright © 2024 Hoài Nghĩa - Cafe Nhớ
 * 
 * This file handles text translation functionality on web pages.
 * It provides both manual translation via keyboard shortcuts and
 * automatic translation for input fields.
 * 
 * Author: Hoài Nghĩa - Cafe Nhớ
 * Email: hoainghia02@gmail.com
 * Telegram: @hoainghia286
 * GitHub: https://github.com/hoainghia22
 * Website: https://cafenho.net
 * 
 * Licensed under MIT License
 */

// Content script để dịch văn bản được bôi đen và tự động dịch
const originalTexts = new Map(); // Track original text for each input

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      translateText(selectedText);
    } else {
      // Show user-friendly message when no text is selected
      showNotification('Vui lòng bôi đen văn bản cần dịch trước khi nhấn phím tắt', 'error');
    }
  }
});

// Load settings and setup auto-translate if enabled
function initializeExtension() {
  chrome.storage.sync.get(['autoTranslate'], function(result) {
    if (result.autoTranslate) {
      setupAutoTranslate();
    }
  });
}

// Initialize when DOM is ready or immediately if already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

function setupAutoTranslate() {
  // Attach listeners to existing inputs
  document.querySelectorAll('input[type="text"], textarea').forEach(attachListener);

  // Observe for new inputs
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches('input[type="text"], textarea')) {
            attachListener(node);
          }
          node.querySelectorAll && node.querySelectorAll('input[type="text"], textarea').forEach(attachListener);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function attachListener(input) {
  // Prevent duplicate listeners
  if (input.hasAttribute('data-translate-listener')) {
    return;
  }
  input.setAttribute('data-translate-listener', 'true');
  
  input.addEventListener('blur', function() {
    const text = input.value.trim();
    if (text && text !== originalTexts.get(input)) {
      originalTexts.set(input, text);
      autoTranslateText(text, input);
    }
  });
}

async function translateText(text, replaceInSelection = true, input = null) {
  try {
    // Load settings from storage
    const settings = await chrome.storage.sync.get(['api', 'targetLang', 'geminiKey', 'openaiKey']);
    const api = settings.api || 'gemini';
    const targetLang = settings.targetLang || 'en';
    const sourceLang = 'vi'; // Assuming input is Vietnamese

    // Validate API key
    if (api === 'gemini' && !settings.geminiKey) {
      showNotification('Vui lòng cấu hình Gemini API key trong Options', 'error');
      return;
    }
    if (api === 'openai' && !settings.openaiKey) {
      showNotification('Vui lòng cấu hình OpenAI API key trong Options', 'error');
      return;
    }

    let translatedText = '';
    if (api === 'gemini') {
      translatedText = await translateWithGemini(text, sourceLang, targetLang, settings.geminiKey);
    } else if (api === 'openai') {
      translatedText = await translateWithOpenAI(text, sourceLang, targetLang, settings.openaiKey);
    }
    
    if (replaceInSelection) {
      // Replace selection with translated text
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(translatedText));
        showNotification('✅ Dịch thành công!', 'success');
      }
    } else if (input) {
      // For auto-translate, set input value
      input.value = translatedText;
      originalTexts.set(input, translatedText); // Update to avoid re-translation
    }
  } catch (error) {
    console.error('Translation error:', error);
    showNotification('Lỗi dịch: ' + error.message, 'error');
  }
}

// Helper function to show notifications
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  
  const styles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 16px',
    borderRadius: '8px',
    zIndex: '10000',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxWidth: '300px',
    wordWrap: 'break-word'
  };
  
  if (type === 'success') {
    styles.background = '#48bb78';
    styles.color = 'white';
  } else if (type === 'error') {
    styles.background = '#f56565';
    styles.color = 'white';
  } else {
    styles.background = '#4299e1';
    styles.color = 'white';
  }
  
  Object.assign(notification.style, styles);
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

async function autoTranslateText(text, input) {
  await translateText(text, false, input);
}

async function translateWithGemini(text, source, target, apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key không hợp lệ');
  }

  try {
    // First, try to get available models
    console.log('🔍 Fetching available Gemini models...');
    const modelsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey
      }
    });

    let availableModels = [];
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('✅ Available models:', modelsData);
      
      // Extract model names that support generateContent
      availableModels = modelsData.models
        ?.filter(model => model.supportedGenerationMethods?.includes('generateContent'))
        ?.map(model => model.name.replace('models/', ''))
        || [];
      
      console.log('🎯 Models supporting generateContent:', availableModels);
    } else {
      console.log('⚠️ Could not fetch models list, using fallback models');
      // Fallback to known models
      availableModels = ['gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro', 'gemini-pro-vision'];
    }

    if (availableModels.length === 0) {
      throw new Error('Không có model Gemini nào hỗ trợ generateContent');
    }

    // Try each available model
    for (const model of availableModels) {
      try {
        console.log(`🧪 Trying Gemini model: ${model}`);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Translate the following text from ${source} to ${target}. Only return the translated text, no explanations: "${text}"`
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API error with model ${model}:`, response.status, errorText);
          
          if (response.status === 404) {
            console.log(`Model ${model} not found, trying next model...`);
            continue; // Try next model
          }
          
          throw new Error(`Gemini API error (${model}): ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Gemini API response for model ${model}:`, data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
          const translatedText = data.candidates[0].content.parts[0].text.trim();
          console.log(`✅ Translation successful with model ${model}:`, translatedText);
          return translatedText;
        } else {
          console.error(`Invalid response format for model ${model}:`, data);
          throw new Error('Không thể dịch với Gemini: ' + JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error with Gemini model ${model}:`, error);
        
        // If this is the last model, throw the error
        if (model === availableModels[availableModels.length - 1]) {
          throw error;
        }
        
        // Otherwise, continue to next model
        console.log(`Continuing to next model...`);
      }
    }
    
    throw new Error('Tất cả các model Gemini đều không khả dụng');
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    throw error;
  }
}

async function translateWithOpenAI(text, source, target, apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('OpenAI API key không hợp lệ');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Translate the following text from ${source} to ${target}: "${text}"`
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content.trim();
  } else {
    throw new Error('Không thể dịch với OpenAI: ' + JSON.stringify(data));
  }
}
