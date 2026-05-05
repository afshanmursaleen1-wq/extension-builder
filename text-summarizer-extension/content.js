/**
 * AutoMind Text Summarizer - Content Script
 *
 * Injected into every web page. Responsibilities:
 *   1. Listen for text selection via mouseup events.
 *   2. Show a small floating "Summarize" button near the selection.
 *   3. When clicked, send the selected text to the Service Worker via
 *      chrome.runtime.sendMessage({ type: "SUMMARIZE_TEXT", text }).
 *
 * This script intentionally avoids any API calls — all AI work is delegated
 * to the Service Worker so that the user's API key never touches page context.
 */

(function () {
  "use strict";

  const BUTTON_ID = "automind-summarize-btn";

  // Inject minimal styles for the floating button
  const style = document.createElement("style");
  style.textContent = `
    #${BUTTON_ID} {
      position: absolute;
      z-index: 2147483647;
      padding: 6px 14px;
      background: #6c3bff;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-family: system-ui, -apple-system, sans-serif;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.15s ease, transform 0.15s ease;
      pointer-events: none;
      white-space: nowrap;
    }
    #${BUTTON_ID}.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    #${BUTTON_ID}:hover {
      background: #5528d9;
    }
  `;
  document.documentElement.appendChild(style);

  // Create the floating button (hidden by default)
  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.textContent = "Summarize";
  document.documentElement.appendChild(btn);

  let selectedText = "";

  // -----------------------------------------------------------------------
  // Show / hide the floating button near the user's selection
  // -----------------------------------------------------------------------

  document.addEventListener("mouseup", (e) => {
    // Small delay to allow the selection to finalise
    setTimeout(() => {
      const selection = window.getSelection();
      const text = (selection?.toString() || "").trim();

      if (text.length < 20) {
        hideButton();
        return;
      }

      selectedText = text;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      btn.style.top = `${window.scrollY + rect.bottom + 6}px`;
      btn.style.left = `${window.scrollX + rect.left}px`;
      btn.classList.add("visible");
    }, 10);
  });

  document.addEventListener("mousedown", (e) => {
    if (e.target !== btn) {
      hideButton();
    }
  });

  // -----------------------------------------------------------------------
  // Send selected text to the Service Worker
  // -----------------------------------------------------------------------

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedText) return;

    chrome.runtime.sendMessage(
      { type: "SUMMARIZE_TEXT", text: selectedText },
      () => {
        // Acknowledged — side panel will open automatically
      }
    );

    hideButton();
  });

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  function hideButton() {
    btn.classList.remove("visible");
  }
})();
