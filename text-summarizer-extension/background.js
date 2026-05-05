/**
 * AutoMind Text Summarizer - Service Worker (Background Script)
 *
 * Architecture overview:
 *   Content Script  --[SUMMARIZE_TEXT]--> Service Worker --[Gemini API]--> Side Panel
 *
 * The service worker acts as the central message bus:
 *   1. Opens the side panel when the toolbar icon is clicked.
 *   2. Receives selected text from the content script via chrome.runtime messages.
 *   3. Calls the Google Gemini API to generate a summary.
 *   4. Forwards the summary (or errors) to the side panel via chrome.runtime messages.
 *   5. Provides a right-click context menu for quick summarisation.
 */

// ---------------------------------------------------------------------------
// Side Panel setup
// ---------------------------------------------------------------------------

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// ---------------------------------------------------------------------------
// Context Menu
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-selection",
    title: "Summarize with AutoMind",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarize-selection" && info.selectionText) {
    if (tab?.id) {
      await chrome.sidePanel.open({ tabId: tab.id });
    }
    await handleSummarize(info.selectionText);
  }
});

// ---------------------------------------------------------------------------
// Message handling (Content Script <-> Service Worker <-> Side Panel)
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUMMARIZE_TEXT") {
    if (sender.tab?.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id });
    }
    handleSummarize(message.text);
    sendResponse({ status: "processing" });
  }

  if (message.type === "GET_LAST_SUMMARY") {
    chrome.storage.local.get(["lastSummary", "lastOriginal"], (data) => {
      sendResponse(data);
    });
    return true; // keep channel open for async response
  }

  if (message.type === "SAVE_API_KEY") {
    chrome.storage.local.set({ geminiApiKey: message.key }, () => {
      sendResponse({ status: "saved" });
    });
    return true;
  }

  if (message.type === "GET_API_KEY") {
    chrome.storage.local.get("geminiApiKey", (data) => {
      sendResponse({ key: data.geminiApiKey || "" });
    });
    return true;
  }

  return false;
});

// ---------------------------------------------------------------------------
// Gemini API integration
// ---------------------------------------------------------------------------

async function handleSummarize(text) {
  // Notify the side panel that summarisation has started
  broadcast({ type: "SUMMARY_LOADING", original: text });

  const { geminiApiKey } = await chrome.storage.local.get("geminiApiKey");

  if (!geminiApiKey) {
    broadcast({
      type: "SUMMARY_ERROR",
      error: "Please set your free Google Gemini API key in the side panel settings."
    });
    return;
  }

  try {
    const summary = await callGemini(geminiApiKey, text);

    // Persist for when the side panel re-opens
    await chrome.storage.local.set({ lastSummary: summary, lastOriginal: text });

    broadcast({ type: "SUMMARY_RESULT", summary, original: text });
  } catch (err) {
    broadcast({
      type: "SUMMARY_ERROR",
      error: err.message || "Failed to summarize. Check your API key and try again."
    });
  }
}

async function callGemini(apiKey, text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are a concise summarizer. Summarize the following text in clear, easy-to-read bullet points. Keep it short and informative.\n\n---\n${text}\n---`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!candidate) {
    throw new Error("Gemini returned an empty response.");
  }

  return candidate;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function broadcast(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // Side panel may not be open yet; ignore.
  });
}
