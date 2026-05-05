# 🧩 Extension Builder - Chrome Extension SaaS

A powerful SaaS application that generates complete, ready-to-upload Chrome extensions from your ideas, prompts, reference images, website URLs, or code snippets.

## Features

- **Prompt-Based Generation**: Describe your extension idea in plain text and get a complete extension
- **Reference Image Support**: Upload screenshots/mockups of the extension you want to build
- **Website URL Input**: Provide a website URL and describe what the extension should do on that site
- **Code Input**: Paste your HTML/CSS/JS code and the app packages it into a proper Chrome extension
- **Complete ZIP Download**: Get a ready-to-upload ZIP file with all required files:
  - `manifest.json` (MV3)
  - `popup.html` + `popup.css` + `popup.js`
  - `content.js` (content script)
  - `background.js` (service worker)
  - `styles.css` (injected styles)
  - Extension icons (16x16, 48x48, 128x128)
- **No Missing Files**: Every extension is validated before download to ensure completeness
- **Modern UI**: Clean, responsive interface for a seamless experience

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Vanilla HTML/CSS/JS
- **AI**: OpenAI GPT-4 for intelligent code generation
- **Packaging**: Python zipfile for creating extension archives

## Quick Start

### Prerequisites

- Python 3.10+
- OpenAI API Key

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd extension-builder

# Install dependencies
pip install -e .

# Set your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"

# Run the server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then open `http://localhost:8000` in your browser.

## How It Works

1. **Choose Input Method**: Select how you want to describe your extension (prompt, image, URL, or code)
2. **Provide Details**: Enter your extension idea, upload images, paste a URL, or provide code
3. **Generate**: Click "Build Extension" and the AI generates all extension files
4. **Download**: Get a complete ZIP file ready to upload to Chrome via `chrome://extensions`

## Loading Your Extension in Chrome

1. Download the ZIP file
2. Extract it to a folder
3. Open Chrome and go to `chrome://extensions`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked" and select the extracted folder
6. Your extension is now active!

## API Endpoints

- `POST /api/generate` - Generate extension from prompt/inputs
- `POST /api/generate-from-code` - Generate extension from provided code
- `POST /api/upload-image` - Upload reference images
- `GET /api/download/{task_id}` - Download generated extension ZIP

## License

MIT
