"""Chrome Extension Generator using OpenAI API."""

import base64
import json
import re
from pathlib import Path

from openai import AsyncOpenAI

from backend.config import OPENAI_API_KEY, OPENAI_MODEL

SYSTEM_PROMPT = (
    "You are an expert Chrome Extension developer. "
    "You generate complete, production-ready Chrome extensions "
    "using Manifest V3.\n\n"
    "IMPORTANT RULES:\n"
    "1. Always generate ALL required files for a working extension\n"
    "2. Use Manifest V3 (NOT V2)\n"
    "3. Every extension MUST have these files at minimum:\n"
    "   - manifest.json (valid MV3 manifest)\n"
    "   - popup.html (the extension popup UI)\n"
    "   - popup.css (styles for the popup)\n"
    "   - popup.js (popup logic)\n"
    "4. If the extension needs to interact with web pages, include:\n"
    "   - content.js (content script)\n"
    "   - content.css (injected styles, if needed)\n"
    "5. If the extension needs background processing, include:\n"
    "   - background.js (service worker)\n"
    "6. Generate clean, well-structured, commented code\n"
    "7. Make the popup UI look modern and professional with good CSS\n"
    "8. Handle errors gracefully in all scripts\n"
    "9. Use Chrome Extension APIs correctly\n"
    "10. NEVER use deprecated APIs or Manifest V2 features\n\n"
    "RESPONSE FORMAT:\n"
    "You MUST respond with a valid JSON object containing a 'files' "
    "array. Each file object has:\n"
    '- "filename": the file path (e.g., "manifest.json")\n'
    '- "content": the complete file content as a string\n\n'
    "Example response structure:\n"
    "{\n"
    '  "files": [\n'
    '    {"filename": "manifest.json", "content": "..."},\n'
    '    {"filename": "popup.html", "content": "..."},\n'
    '    {"filename": "popup.css", "content": "..."},\n'
    '    {"filename": "popup.js", "content": "..."},\n'
    '    {"filename": "background.js", "content": "..."},\n'
    '    {"filename": "content.js", "content": "..."}\n'
    "  ],\n"
    '  "name": "Extension Name",\n'
    '  "description": "Brief description"\n'
    "}\n\n"
    "NEVER include markdown code fences. Return ONLY the JSON object."
)

CLONE_SYSTEM_PROMPT = (
    "You are an expert Chrome Extension developer specializing in "
    "creating pixel-perfect Chrome extensions. You receive details "
    "about an existing extension (from a website URL, reference "
    "images, or code snippets) and create a complete, working clone."
    "\n\n"
    "IMPORTANT RULES:\n"
    "1. Recreate the extension as closely as possible\n"
    "2. Use Manifest V3 (NOT V2)\n"
    "3. Generate ALL required files\n"
    "4. Make the UI match the reference as closely as possible\n"
    "5. If HTML/CSS/JS code is provided, incorporate it into a "
    "proper extension structure\n"
    "6. If only an image is provided, recreate the UI from it\n"
    "7. If a website URL is provided, create an extension that "
    "works on/with that website\n\n"
    "RESPONSE FORMAT:\n"
    "Respond with a valid JSON object containing a 'files' array. "
    "Each file has 'filename' and 'content' keys.\n\n"
    "{\n"
    '  "files": [\n'
    '    {"filename": "manifest.json", "content": "..."},\n'
    '    {"filename": "popup.html", "content": "..."},\n'
    '    {"filename": "popup.css", "content": "..."},\n'
    '    {"filename": "popup.js", "content": "..."}\n'
    "  ],\n"
    '  "name": "Extension Name",\n'
    '  "description": "Brief description"\n'
    "}\n\n"
    "NEVER include markdown code fences. Return ONLY the JSON object."
)


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=OPENAI_API_KEY)


def _extract_json(text: str) -> dict:
    """Extract JSON from AI response, handling markdown wrapping."""
    text = text.strip()
    fence_pattern = r"```(?:json)?\s*([\s\S]*?)```"
    match = re.search(fence_pattern, text)
    if match:
        text = match.group(1).strip()

    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        text = text[start:end]

    return json.loads(text)


def _build_manifest(
    name: str, description: str, files: list[dict]
) -> str:
    """Build a complete manifest.json for the extension."""
    manifest: dict = {
        "manifest_version": 3,
        "name": name or "My Extension",
        "version": "1.0.0",
        "description": description or "A Chrome extension",
        "icons": {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png",
        },
        "action": {
            "default_popup": "popup.html",
            "default_icon": {
                "16": "icons/icon16.png",
                "48": "icons/icon48.png",
            },
        },
    }

    filenames = {f["filename"] for f in files}

    if "background.js" in filenames:
        manifest["background"] = {
            "service_worker": "background.js",
            "type": "module",
        }

    content_scripts_files = []
    content_css_files = []
    if "content.js" in filenames:
        content_scripts_files.append("content.js")
    if "content.css" in filenames:
        content_css_files.append("content.css")

    if content_scripts_files or content_css_files:
        content_script: dict = {"matches": ["<all_urls>"]}
        if content_scripts_files:
            content_script["js"] = content_scripts_files
        if content_css_files:
            content_script["css"] = content_css_files
        manifest["content_scripts"] = [content_script]

    manifest["permissions"] = ["storage", "activeTab"]

    return json.dumps(manifest, indent=2)


def _create_simple_png(width: int, height: int) -> bytes:
    """Create a simple colored PNG icon."""
    try:
        from PIL import Image, ImageDraw

        img = Image.new("RGBA", (width, height), (99, 102, 241, 255))
        draw = ImageDraw.Draw(img)

        margin = max(2, width // 6)
        x1, y1 = margin, margin
        x2, y2 = width - margin, height - margin
        mid_y = (y1 + y2) // 2
        line_w = max(1, width // 8)

        fill = (255, 255, 255, 255)
        draw.rectangle([x1, y1, x1 + line_w, y2], fill=fill)
        draw.rectangle([x1, y1, x2, y1 + line_w], fill=fill)
        draw.rectangle(
            [x1, mid_y - line_w // 2, x2 - margin, mid_y + line_w // 2],
            fill=fill,
        )
        draw.rectangle([x1, y2 - line_w, x2, y2], fill=fill)

        import io

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
    except ImportError:
        return (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
            b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00"
            b"\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00"
            b"\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
        )


def _validate_and_fix_files(
    files: list[dict], name: str, description: str
) -> list[dict]:
    """Validate extension files and add any missing required ones."""
    filenames = {f["filename"] for f in files}
    result = list(files)

    has_manifest = False
    for f in result:
        if f["filename"] == "manifest.json":
            has_manifest = True
            try:
                manifest = json.loads(f["content"])
                if manifest.get("manifest_version") != 3:
                    manifest["manifest_version"] = 3
                    f["content"] = json.dumps(manifest, indent=2)
            except json.JSONDecodeError:
                f["content"] = _build_manifest(
                    name, description, result
                )
            break

    if not has_manifest:
        result.append({
            "filename": "manifest.json",
            "content": _build_manifest(name, description, result),
        })

    if "popup.html" not in filenames:
        result.append({
            "filename": "popup.html",
            "content": (
                "<!DOCTYPE html>\n"
                '<html lang="en">\n<head>\n'
                '  <meta charset="UTF-8">\n'
                f"  <title>{name}</title>\n"
                '  <link rel="stylesheet" href="popup.css">\n'
                "</head>\n<body>\n"
                '  <div class="container">\n'
                f"    <h1>{name}</h1>\n"
                f"    <p>{description}</p>\n"
                "  </div>\n"
                '  <script src="popup.js"></script>\n'
                "</body>\n</html>"
            ),
        })

    if "popup.css" not in filenames:
        result.append({
            "filename": "popup.css",
            "content": (
                "* { margin: 0; padding: 0; box-sizing: border-box; }\n"
                "body {\n"
                "  width: 350px;\n"
                "  min-height: 200px;\n"
                "  font-family: 'Segoe UI', system-ui, sans-serif;\n"
                "  background: #ffffff;\n"
                "  color: #1a1a2e;\n"
                "  padding: 16px;\n"
                "}\n"
                "h1 { font-size: 18px; color: #6366f1; }\n"
                "p { font-size: 14px; color: #64748b; }\n"
            ),
        })

    if "popup.js" not in filenames:
        result.append({
            "filename": "popup.js",
            "content": (
                "document.addEventListener('DOMContentLoaded', () => {\n"
                "  console.log('Extension popup loaded');\n"
                "});\n"
            ),
        })

    return result


def _encode_image(img_path: str) -> tuple[str, str]:
    """Read and base64-encode an image file, return (data, media_type)."""
    path = Path(img_path)
    if not path.exists():
        return "", ""
    with open(path, "rb") as f:
        img_data = base64.b64encode(f.read()).decode()
    ext = path.suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    valid = ("png", "jpeg", "gif", "webp")
    media_type = f"image/{ext}" if ext in valid else "image/png"
    return img_data, media_type


async def generate_from_prompt(
    prompt: str,
    website_url: str = "",
    image_paths: list[str] | None = None,
) -> dict:
    """Generate a Chrome extension from a text prompt."""
    client = _get_client()

    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    user_content: list[dict] = []

    text_parts = [
        f"Create a Chrome extension based on this description:"
        f"\n\n{prompt}"
    ]
    if website_url:
        text_parts.append(f"\nTarget website URL: {website_url}")
        text_parts.append(
            "The extension should work specifically on this "
            "website. Include the URL in the content_scripts "
            "matches pattern in manifest.json."
        )
    user_content.append({"type": "text", "text": "\n".join(text_parts)})

    if image_paths:
        for img_path in image_paths:
            img_data, media_type = _encode_image(img_path)
            if img_data:
                user_content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{media_type};base64,{img_data}"
                    },
                })

    messages.append({"role": "user", "content": user_content})

    response = await client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=messages,
        max_tokens=16000,
        temperature=0.3,
    )

    raw = response.choices[0].message.content or "{}"
    data = _extract_json(raw)

    name = data.get("name", "My Extension")
    description = data.get("description", "A Chrome extension")
    files = data.get("files", [])

    files = _validate_and_fix_files(files, name, description)

    return {"name": name, "description": description, "files": files}


async def generate_from_code(
    name: str,
    description: str,
    html_code: str = "",
    css_code: str = "",
    js_code: str = "",
    content_js: str = "",
    background_js: str = "",
    website_url: str = "",
) -> dict:
    """Generate a Chrome extension from provided code snippets."""
    files: list[dict] = []

    if html_code:
        if "<html" not in html_code.lower():
            html_code = (
                "<!DOCTYPE html>\n"
                '<html lang="en">\n<head>\n'
                '  <meta charset="UTF-8">\n'
                f"  <title>{name}</title>\n"
                '  <link rel="stylesheet" href="popup.css">\n'
                "</head>\n<body>\n"
                f"{html_code}\n"
                '  <script src="popup.js"></script>\n'
                "</body>\n</html>"
            )
        files.append({"filename": "popup.html", "content": html_code})

    if css_code:
        files.append({"filename": "popup.css", "content": css_code})

    if js_code:
        files.append({"filename": "popup.js", "content": js_code})

    if content_js:
        files.append({"filename": "content.js", "content": content_js})

    if background_js:
        files.append({
            "filename": "background.js",
            "content": background_js,
        })

    manifest: dict = {
        "manifest_version": 3,
        "name": name or "My Extension",
        "version": "1.0.0",
        "description": description or "A Chrome extension",
        "icons": {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png",
        },
        "action": {
            "default_popup": "popup.html",
            "default_icon": {
                "16": "icons/icon16.png",
                "48": "icons/icon48.png",
            },
        },
        "permissions": ["storage", "activeTab"],
    }

    if background_js:
        manifest["background"] = {
            "service_worker": "background.js",
            "type": "module",
        }

    if content_js:
        matches = ["<all_urls>"]
        if website_url:
            from urllib.parse import urlparse

            parsed = urlparse(website_url)
            if parsed.scheme and parsed.netloc:
                matches = [f"{parsed.scheme}://{parsed.netloc}/*"]
        manifest["content_scripts"] = [
            {"matches": matches, "js": ["content.js"]}
        ]

    files.append({
        "filename": "manifest.json",
        "content": json.dumps(manifest, indent=2),
    })

    files = _validate_and_fix_files(files, name, description)

    return {"name": name, "description": description, "files": files}


async def generate_from_clone(
    website_url: str = "",
    prompt: str = "",
    image_paths: list[str] | None = None,
    html_code: str = "",
    css_code: str = "",
    js_code: str = "",
) -> dict:
    """Generate a clone extension from reference material."""
    client = _get_client()

    messages: list[dict] = [
        {"role": "system", "content": CLONE_SYSTEM_PROMPT}
    ]

    user_content: list[dict] = []

    text_parts = []
    if prompt:
        text_parts.append(f"Extension description: {prompt}")
    if website_url:
        text_parts.append(
            f"Reference website/extension URL: {website_url}"
        )
    if html_code:
        text_parts.append(
            f"Reference HTML code:\n```html\n{html_code}\n```"
        )
    if css_code:
        text_parts.append(
            f"Reference CSS code:\n```css\n{css_code}\n```"
        )
    if js_code:
        text_parts.append(
            f"Reference JS code:\n```javascript\n{js_code}\n```"
        )

    if not text_parts:
        text_parts.append(
            "Create a Chrome extension based on the provided "
            "reference images. Match the UI and functionality "
            "as closely as possible."
        )

    user_content.append({
        "type": "text",
        "text": "\n\n".join(text_parts),
    })

    if image_paths:
        for img_path in image_paths:
            img_data, media_type = _encode_image(img_path)
            if img_data:
                user_content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{media_type};base64,{img_data}"
                    },
                })

    messages.append({"role": "user", "content": user_content})

    response = await client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=messages,
        max_tokens=16000,
        temperature=0.3,
    )

    raw = response.choices[0].message.content or "{}"
    data = _extract_json(raw)

    name = data.get("name", "Cloned Extension")
    description = data.get("description", "A cloned extension")
    files = data.get("files", [])

    files = _validate_and_fix_files(files, name, description)

    return {"name": name, "description": description, "files": files}


def generate_icons() -> list[dict]:
    """Generate default extension icons."""
    icons = []
    for size in (16, 48, 128):
        png_data = _create_simple_png(size, size)
        icons.append({
            "filename": f"icons/icon{size}.png",
            "content_bytes": png_data,
        })
    return icons
