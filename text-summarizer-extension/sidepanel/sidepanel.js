/**
 * AutoMind Text Summarizer — Side Panel UI Logic
 *
 * Listens for messages from the Service Worker and updates the UI accordingly.
 * Also handles settings (API key save/load) and copy-to-clipboard.
 */

(function () {
  "use strict";

  // DOM references
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsPanel = document.getElementById("settings-panel");
  const apiKeyInput = document.getElementById("api-key-input");
  const saveKeyBtn = document.getElementById("save-key-btn");
  const keyStatus = document.getElementById("key-status");
  const emptyState = document.getElementById("empty-state");
  const loadingState = document.getElementById("loading-state");
  const resultState = document.getElementById("result-state");
  const errorState = document.getElementById("error-state");
  const summaryContent = document.getElementById("summary-content");
  const originalContent = document.getElementById("original-content");
  const errorMessage = document.getElementById("error-message");
  const copyBtn = document.getElementById("copy-btn");

  // -----------------------------------------------------------------------
  // Settings toggle
  // -----------------------------------------------------------------------

  settingsToggle.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
  });

  // -----------------------------------------------------------------------
  // Load saved API key on open
  // -----------------------------------------------------------------------

  chrome.runtime.sendMessage({ type: "GET_API_KEY" }, (res) => {
    if (res?.key) {
      apiKeyInput.value = res.key;
      showKeyStatus("Key saved", "success");
    }
  });

  // -----------------------------------------------------------------------
  // Save API key
  // -----------------------------------------------------------------------

  saveKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showKeyStatus("Please enter a key.", "error");
      return;
    }
    chrome.runtime.sendMessage({ type: "SAVE_API_KEY", key }, () => {
      showKeyStatus("Key saved", "success");
    });
  });

  function showKeyStatus(text, type) {
    keyStatus.textContent = text;
    keyStatus.className = "key-status " + type;
  }

  // -----------------------------------------------------------------------
  // Listen for messages from the Service Worker
  // -----------------------------------------------------------------------

  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case "SUMMARY_LOADING":
        showView("loading");
        break;

      case "SUMMARY_RESULT":
        summaryContent.textContent = message.summary;
        originalContent.textContent = message.original;
        showView("result");
        break;

      case "SUMMARY_ERROR":
        errorMessage.textContent = message.error;
        showView("error");
        break;
    }
  });

  // -----------------------------------------------------------------------
  // Restore last summary when side panel opens
  // -----------------------------------------------------------------------

  chrome.runtime.sendMessage({ type: "GET_LAST_SUMMARY" }, (data) => {
    if (data?.lastSummary) {
      summaryContent.textContent = data.lastSummary;
      originalContent.textContent = data.lastOriginal || "";
      showView("result");
    }
  });

  // -----------------------------------------------------------------------
  // Copy summary to clipboard
  // -----------------------------------------------------------------------

  copyBtn.addEventListener("click", async () => {
    const text = summaryContent.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy Summary";
      }, 1500);
    } catch {
      copyBtn.textContent = "Failed";
      setTimeout(() => {
        copyBtn.textContent = "Copy Summary";
      }, 1500);
    }
  });

  // -----------------------------------------------------------------------
  // View management
  // -----------------------------------------------------------------------

  function showView(view) {
    emptyState.classList.add("hidden");
    loadingState.classList.add("hidden");
    resultState.classList.add("hidden");
    errorState.classList.add("hidden");

    switch (view) {
      case "empty":
        emptyState.classList.remove("hidden");
        break;
      case "loading":
        loadingState.classList.remove("hidden");
        break;
      case "result":
        resultState.classList.remove("hidden");
        break;
      case "error":
        errorState.classList.remove("hidden");
        break;
    }
  }
})();
