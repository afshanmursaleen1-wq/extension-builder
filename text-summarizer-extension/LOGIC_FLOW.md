# AutoMind Text Summarizer — Architecture & Logic Flow

## Reference Extension Analysis: "Grok Automation"

The reference extension is a Manifest V3 Chrome extension that automates prompt
submission and media downloading on `grok.com`. Below is how its components
communicate.

### Components

| Component | File(s) | Role |
|---|---|---|
| **Service Worker** | `service-worker-loader.js` → `assets/index.ts-DZhBli9u.js` | Central message hub. Manages downloads, zoom, remote config, side-panel setup. |
| **Content Script** | `assets/index.ts-u-iHqYY-.js` | Injected into `grok.com` pages. Manipulates the DOM to automate prompts and capture generated media. Bundles jQuery. |
| **Side Panel** | `src/ui/side-panel/index.html` + `index.html-CspW0iPA.js` | Vue.js-based UI for configuring automation batches, folder names, and viewing status. |
| **Remote Config** | `assets/remoteConfig-Camq-y8r.js` | Fetches feature flags and CSS selectors from `configs.kylenguyen.me`. |

### Message Flow

```
 ┌─────────────────┐       chrome.runtime.sendMessage       ┌────────────────────┐
 │  Content Script  │ ─────────────────────────────────────► │  Service Worker    │
 │  (grok.com DOM)  │  DOWNLOAD_RESOURCE / SET_FOLDER_NAME   │  (background.js)   │
 │                  │  PROMPT_GROUP_STATUS / SET_ZOOM         │                    │
 └─────────────────┘                                         └────────────────────┘
                                                                   │         ▲
                                                                   │         │
                                          chrome.runtime messages  │         │
                                                                   ▼         │
                                                             ┌────────────────────┐
                                                             │    Side Panel UI   │
                                                             │  (Vue.js app)      │
                                                             └────────────────────┘
```

1. **Content Script → Service Worker**: Sends `DOWNLOAD_RESOURCE` with a URL and
   filename. The service worker calls `chrome.downloads.download()`.
2. **Side Panel → Service Worker**: Sends `SET_FOLDER_NAME` to configure the
   download directory prefix. Also requests `GET_REMOTE_CONFIG`.
3. **Service Worker → Side Panel**: Broadcasts `PROMPT_GROUP_STATUS` updates so
   the UI can reflect progress.
4. **Remote Config**: On every `GET_REMOTE_CONFIG` message the service worker
   fetches selectors from an external API so the content script knows which DOM
   elements to target (resilient to site layout changes).

---

## Simplified Version: AutoMind Text Summarizer

### Goal

A side-panel extension that summarizes user-selected text on any webpage using
the **Google Gemini free-tier API**.

### Components

| Component | File | Role |
|---|---|---|
| **Content Script** | `content.js` | Detects text selection, shows a floating "Summarize" button, sends text to the service worker. |
| **Service Worker** | `background.js` | Receives text, calls the Gemini API, broadcasts results to the side panel. Also manages the context menu and API key storage. |
| **Side Panel** | `sidepanel/sidepanel.html` + `.css` + `.js` | Displays the summary, settings for the API key, copy-to-clipboard. |

### Message Types

| Message | Direction | Purpose |
|---|---|---|
| `SUMMARIZE_TEXT` | Content Script → Service Worker | Selected text to summarize |
| `SUMMARY_LOADING` | Service Worker → Side Panel | Indicates summarisation started |
| `SUMMARY_RESULT` | Service Worker → Side Panel | Carries the generated summary |
| `SUMMARY_ERROR` | Service Worker → Side Panel | Error details |
| `GET_LAST_SUMMARY` | Side Panel → Service Worker | Restore previous summary on reopen |
| `SAVE_API_KEY` / `GET_API_KEY` | Side Panel ↔ Service Worker | Persist the user's Gemini key |

### Message Flow

```
 ┌─────────────────┐     { type: "SUMMARIZE_TEXT" }     ┌────────────────────┐
 │  Content Script  │ ─────────────────────────────────► │  Service Worker    │
 │  (any webpage)   │                                    │  (background.js)   │
 │                  │                                    │                    │
 │  - mouseup       │                                    │  - callGemini()    │
 │  - floating btn  │                                    │  - chrome.storage  │
 │  - context menu  │                                    │  - broadcast()     │
 └─────────────────┘                                     └────────────────────┘
                                                              │          ▲
                                               SUMMARY_RESULT │          │ GET_API_KEY
                                              SUMMARY_LOADING │          │ SAVE_API_KEY
                                               SUMMARY_ERROR  │          │ GET_LAST_SUMMARY
                                                              ▼          │
                                                        ┌────────────────────┐
                                                        │   Side Panel UI    │
                                                        │   (sidepanel/)     │
                                                        └────────────────────┘
```

### Directory Structure

```
text-summarizer-extension/
├── manifest.json          # Manifest V3 config
├── background.js          # Service Worker — API calls & message routing
├── content.js             # Content Script — text selection & floating button
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── sidepanel/
│   ├── sidepanel.html     # Side panel markup
│   ├── sidepanel.css      # Side panel styles
│   └── sidepanel.js       # Side panel UI logic
└── LOGIC_FLOW.md          # This file
```

### How to Use

1. Load the extension in Chrome via `chrome://extensions` → Developer Mode → Load Unpacked.
2. Click the extension icon to open the side panel.
3. Paste your **free** Google Gemini API key (get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)).
4. Select text on any webpage → click the purple **"Summarize"** button or right-click → **"Summarize with AutoMind"**.
5. The summary appears in the side panel instantly.

### Key Differences from Reference

| Aspect | Reference (Grok Automation) | This Extension |
|---|---|---|
| Target site | `grok.com` only | Any webpage |
| API | Paid/external config server | Google Gemini free tier |
| Functionality | Batch prompt automation + downloads | Text summarisation |
| Pricing | Freemium | Free forever |
| Framework | Vue.js, jQuery, bundled | Vanilla JS, zero dependencies |
| Author | kylenguyen | automindai |
