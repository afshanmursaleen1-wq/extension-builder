"""Chrome Extension Builder - FastAPI Backend."""

import uuid

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from backend.config import FRONTEND_DIR, OPENAI_API_KEY, UPLOAD_DIR
from backend.generator import generate_from_clone, generate_from_code, generate_from_prompt
from backend.zip_builder import create_extension_zip, validate_extension

app = FastAPI(
    title="Chrome Extension Builder",
    description="Generate complete Chrome extensions from prompts, images, URLs, or code",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store tasks in memory (for production, use a database)
tasks: dict[str, dict] = {}


@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the frontend HTML page."""
    index_path = FRONTEND_DIR / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Frontend not found")
    return HTMLResponse(content=index_path.read_text(encoding="utf-8"))


# Serve static frontend files
app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "api_key_configured": bool(OPENAI_API_KEY),
    }


@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload a reference image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    file_id = str(uuid.uuid4())
    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "png"
    save_path = UPLOAD_DIR / f"{file_id}.{ext}"

    content = await file.read()
    save_path.write_bytes(content)

    return {"image_id": file_id, "path": str(save_path), "filename": file.filename}


@app.post("/api/generate")
async def generate_extension(
    prompt: str = Form(""),
    website_url: str = Form(""),
    mode: str = Form("prompt"),
    image_paths: str = Form(""),
):
    """Generate a Chrome extension from a prompt, with optional images and URL."""
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key not configured. Set OPENAI_API_KEY environment variable.",
        )

    if not prompt and not website_url and not image_paths:
        raise HTTPException(
            status_code=400,
            detail="Please provide a prompt, URL, or upload images",
        )

    task_id = str(uuid.uuid4())
    img_list = (
        [p.strip() for p in image_paths.split(",") if p.strip()]
        if image_paths
        else []
    )

    try:
        if mode == "clone":
            result = await generate_from_clone(
                website_url=website_url,
                prompt=prompt,
                image_paths=img_list if img_list else None,
            )
        else:
            result = await generate_from_prompt(
                prompt=prompt,
                website_url=website_url,
                image_paths=img_list if img_list else None,
            )

        warnings = validate_extension(result["files"])
        zip_path = create_extension_zip(task_id, result["files"])

        tasks[task_id] = {
            "status": "completed",
            "name": result["name"],
            "description": result["description"],
            "files": [
                {"filename": f["filename"], "preview": f.get("content", "")[:200]}
                for f in result["files"]
                if "content" in f
            ],
            "warnings": warnings,
            "zip_path": str(zip_path),
        }

        return {
            "task_id": task_id,
            "status": "completed",
            "name": result["name"],
            "description": result["description"],
            "files": [f["filename"] for f in result["files"] if "content" in f],
            "warnings": warnings,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}") from e


@app.post("/api/generate-from-code")
async def generate_from_code_endpoint(
    name: str = Form("My Extension"),
    description: str = Form("A Chrome extension"),
    html_code: str = Form(""),
    css_code: str = Form(""),
    js_code: str = Form(""),
    content_js: str = Form(""),
    background_js: str = Form(""),
    website_url: str = Form(""),
):
    """Generate a Chrome extension from provided code snippets."""
    if not any([html_code, css_code, js_code, content_js, background_js]):
        raise HTTPException(status_code=400, detail="Please provide at least one code snippet")

    task_id = str(uuid.uuid4())

    try:
        result = await generate_from_code(
            name=name,
            description=description,
            html_code=html_code,
            css_code=css_code,
            js_code=js_code,
            content_js=content_js,
            background_js=background_js,
            website_url=website_url,
        )

        warnings = validate_extension(result["files"])
        zip_path = create_extension_zip(task_id, result["files"])

        tasks[task_id] = {
            "status": "completed",
            "name": result["name"],
            "description": result["description"],
            "files": [
                {"filename": f["filename"], "preview": f.get("content", "")[:200]}
                for f in result["files"]
                if "content" in f
            ],
            "warnings": warnings,
            "zip_path": str(zip_path),
        }

        return {
            "task_id": task_id,
            "status": "completed",
            "name": result["name"],
            "description": result["description"],
            "files": [f["filename"] for f in result["files"] if "content" in f],
            "warnings": warnings,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}") from e


@app.get("/api/download/{task_id}")
async def download_extension(task_id: str):
    """Download the generated extension ZIP file."""
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    zip_path = task.get("zip_path")
    if not zip_path:
        raise HTTPException(status_code=404, detail="ZIP file not found")

    from pathlib import Path

    if not Path(zip_path).exists():
        raise HTTPException(status_code=404, detail="ZIP file no longer exists")

    safe_name = task.get("name", "extension").replace(" ", "_").lower()
    return FileResponse(
        path=zip_path,
        filename=f"{safe_name}_extension.zip",
        media_type="application/zip",
    )


@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    """Get the status of a generation task."""
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
