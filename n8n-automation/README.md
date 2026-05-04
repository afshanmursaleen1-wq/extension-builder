# n8n + RankReady SaaS — Automated Blog Post Pipeline

Automate blog post creation by connecting your **RankReady** SaaS app (AI SEO content generator) to **n8n**, which orchestrates the full publishing pipeline to WordPress.

## Architecture Overview

```
Google Sheets (Blog Ideas)
        │
        ▼
   n8n Workflow
        │
        ├──► RankReady API (/api/generate)  → SEO blog content (HTML)
        │
        ├──► WordPress REST API             → Create draft post
        │
        ├──► Nvidia Kimi LLM               → Mermaid diagram
        │        └──► mermaid.ink           → Render to image
        │              └──► WordPress       → Upload & embed
        │
        ├──► Nvidia Kimi LLM               → Featured image prompt
        │        └──► Image Gen API         → Generate image
        │              └──► WordPress       → Upload & set as featured
        │
        ├──► RankReady API (/api/analyze)   → SEO score & checklist
        │
        ├──► Nvidia Kimi LLM               → Marketing content
        │        └──► Google Docs           → Content brief
        │
        ├──► Google Sheets                  → Mark row "Generated"
        │
        └──► Pushover                       → Mobile notification
```

## RankReady API Endpoints

Your Lovable SaaS app at `https://rank-ready-sag.lovable.app` exposes these endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/generate` | POST | Generate SEO blog content (SSE stream) |
| `/api/analyze` | POST | Analyze content for SEO scores |
| `/api/improve` | POST | Improve existing content |
| `/api/save` | POST | Save generated content |
| `/api/saved` | GET | List saved content |
| `/api/saved/{id}` | DELETE | Delete saved content |

### `/api/generate` — Content Generation

**Request:**
```json
{
  "topic": "How to automate lead generation with n8n",
  "audience": "business owners and agencies",
  "tone": "Expert",
  "wordCount": 1200
}
```

| Parameter | Type | Options |
|---|---|---|
| `topic` | string | Blog topic or keyword |
| `audience` | string | Target audience description |
| `tone` | string | `"Informative"`, `"Conversational"`, `"Expert"` |
| `wordCount` | number | `800`, `1200`, or `2000` |

**Response:** Server-Sent Events (SSE) stream
```
data: {"type":"text","delta":"<article>\n<h1>...","wordCount":3}
data: {"type":"text","delta":" more content here...","wordCount":20}
...
```

Each chunk contains:
- `type`: always `"text"`
- `delta`: HTML content fragment
- `wordCount`: running word count

### `/api/analyze` — SEO Analysis

**Request:**
```json
{
  "content": "<article>...full HTML content...</article>",
  "keyword": "target keyword"
}
```

**Response:**
```json
{
  "overall": 7.8,
  "scores": {
    "contentQuality": 8.0,
    "onPageSeo": 7.5,
    "eeat": 7.2,
    "userExperience": 8.5
  },
  "checklist": [
    { "label": "Title tag present", "present": true },
    { "label": "Meta description present", "present": false }
  ],
  "wordCount": 1200,
  "keywordDensityPercent": 1.5,
  "seoWarnings": [],
  "metaDescription": "Auto-generated meta description..."
}
```

### `/api/improve` — Content Improvement

**Request:**
```json
{
  "content": "<article>...at least 120 chars of HTML...</article>",
  "topic": "target keyword",
  "audience": "target audience",
  "tone": "Expert",
  "wordCount": 1200
}
```

**Response:**
```json
{
  "improvedContent": "<article>...improved HTML...</article>",
  "title": "Improved Blog Title",
  "canonicalSlug": "improved-blog-title"
}
```

## Workflow Phases

### Phase 1: Content Generation via RankReady

**What changed from the original pipeline:**
The original AI Agent (AWS Bedrock + SerpAPI + WordPress Tool) is replaced with:

1. **`RankReady — Generate Content`** (Code node) — Calls `POST /api/generate`, collects the SSE stream, extracts the full HTML blog content, title, and slug.
2. **`Create WordPress Draft`** (HTTP Request) — Posts the content to WordPress REST API as a draft.
3. **`Parse Pipeline Data`** (Code node) — Builds the summary, post_id, and post_url for downstream nodes.

### Phase 2: Mermaid Diagram (unchanged)

LLM generates a Mermaid.js flowchart → encoded to base64 → rendered via mermaid.ink → uploaded to WordPress → appended to post.

### Phase 3: Featured Image (unchanged)

LLM generates an image prompt → image generation API creates the hero image → uploaded to WordPress → set as featured media.

### Phase 4: Marketing Content + SEO Analysis

**New addition:** RankReady `/api/analyze` runs in parallel to score the generated content for SEO quality. The scores are included in the Google Docs content brief.

### Phase 5: Tracking & Notification (unchanged)

Google Sheet row marked "Generated" → Pushover mobile notification sent.

## Setup Guide

### Prerequisites

- **n8n** instance (cloud or self-hosted)
- **RankReady** app running at `https://rank-ready-sag.lovable.app`
- **WordPress** site with REST API enabled + Application Password
- **Google** Sheets & Docs OAuth credentials in n8n
- **Nvidia NIM** API key (for Kimi LLM)
- **Image generation** API endpoint (e.g., Google Imagen, DALL-E, Stable Diffusion)
- **Pushover** account (optional, for notifications)

### Step-by-Step Import

1. **Open n8n** and go to **Workflows** → **Import from File**
2. **Upload** `workflows/content-pipeline-rankready.json`
3. **Replace placeholders** in the workflow (search for `YOUR_`):

| Placeholder | Replace With |
|---|---|
| `YOUR_WORDPRESS_SITE` | Your WordPress domain (e.g., `rising-automation.com`) |
| `YOUR_WP_BASIC_AUTH_CREDENTIAL_ID` | Your WordPress HTTP Basic Auth credential ID in n8n |
| `YOUR_GOOGLE_SHEET_ID` | Your Google Sheets document ID |
| `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` | Your Google Sheets OAuth credential ID in n8n |
| `YOUR_GOOGLE_DOCS_CREDENTIAL_ID` | Your Google Docs OAuth credential ID in n8n |
| `YOUR_GOOGLE_DRIVE_FOLDER_ID` | Google Drive folder ID for content briefs |
| `YOUR_NVIDIA_BEARER_AUTH_ID` | Your Nvidia NIM Bearer Auth credential ID in n8n |
| `YOUR_IMAGE_GENERATION_API_URL` | Your image generation API endpoint |
| `YOUR_PUSHOVER_USER_KEY` | Your Pushover user key |
| `YOUR_PUSHOVER_CREDENTIAL_ID` | Your Pushover credential ID in n8n |

4. **Set up credentials** in n8n:
   - **WordPress**: Settings → Credentials → HTTP Basic Auth → username + Application Password
   - **Google Sheets/Docs**: Settings → Credentials → Google OAuth2
   - **Nvidia**: Settings → Credentials → HTTP Bearer Auth → your NIM API key
   - **Pushover**: Settings → Credentials → Pushover

5. **Configure Google Sheet** with columns: `Idea` | `Status`
6. **Activate** the workflow

### WordPress Application Password

1. Go to your WordPress admin → Users → Profile
2. Scroll to **Application Passwords**
3. Enter a name (e.g., "n8n Automation") and click **Add New**
4. Copy the generated password
5. Use your WordPress username + this password as HTTP Basic Auth in n8n

### Testing

1. Add a test row to your Google Sheet: `Idea: "How to automate email outreach with n8n"` (leave Status empty)
2. In n8n, click **Test Workflow** (or wait for the daily trigger)
3. Verify:
   - RankReady generates HTML content
   - WordPress draft is created
   - Diagram is generated and embedded
   - Featured image is uploaded
   - Content brief appears in Google Docs
   - Sheet row shows "Generated"
   - Pushover notification arrives

### Customizing RankReady Parameters

In the **`RankReady — Generate Content`** Code node, you can adjust:

```javascript
const requestBody = {
  topic: idea,
  audience: 'business owners and agencies interested in AI automation',
  tone: 'Expert',       // Options: 'Informative', 'Conversational', 'Expert'
  wordCount: 1200        // Options: 800, 1200, 2000
};
```

### Optional: Content Improvement Loop

To add an auto-improvement step using RankReady's `/api/improve` endpoint:

1. After the SEO analysis, add a **Code node** that checks if `seo.overall < 7`
2. If the score is low, add an **HTTP Request** to `POST /api/improve`
3. Then **PATCH** the WordPress post with the improved content
4. Re-run the SEO analysis to verify improvement

## Error Handling

- The **`RankReady — Generate Content`** node throws clear errors if the API fails or returns empty content
- The **Image Generation** and **LLM** nodes have `retryOnFail: true` enabled
- If any node fails, n8n will show the error in the execution log

## File Structure

```
n8n-automation/
├── README.md                                          ← This guide
└── workflows/
    └── content-pipeline-rankready.json                ← Import-ready n8n workflow
```
