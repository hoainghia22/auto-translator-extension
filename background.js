/**
 * Auto Translator Extension - Background Script
 * Copyright © 2024 Hoài Nghĩa - Cafe Nhớ
 * 
 * This file handles keyboard shortcuts and communication between
 * the extension and content scripts.
 * 
 * Author: Hoài Nghĩa - Cafe Nhớ
 * Email: hoainghia22@gmail.com
 * Telegram: @hoainghia22
 * GitHub: https://github.com/hoainghia22
 * Website: https://cafenho.net
 * 
 * Licensed under MIT License
 */

// Background script để handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "translate-selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error querying tabs:', chrome.runtime.lastError);
        return;
      }
      
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "translate" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
          }
        });
      }
    });
  }
});
