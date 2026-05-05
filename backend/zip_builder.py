"""ZIP file builder for Chrome extensions."""

import io
import zipfile
from pathlib import Path

from backend.config import OUTPUT_DIR
from backend.generator import generate_icons


def create_extension_zip(task_id: str, files: list[dict]) -> Path:
    """Create a ZIP file containing all extension files.

    Args:
        task_id: Unique identifier for this build task
        files: List of file dicts with 'filename' and 'content' keys

    Returns:
        Path to the created ZIP file
    """
    zip_path = OUTPUT_DIR / f"{task_id}.zip"
    buf = io.BytesIO()

    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        # Add all generated text files
        for f in files:
            filename = f["filename"]
            if "content_bytes" in f:
                zf.writestr(filename, f["content_bytes"])
            else:
                zf.writestr(filename, f["content"])

        # Add default icons if not already present
        existing = {f["filename"] for f in files}
        icons = generate_icons()
        for icon in icons:
            if icon["filename"] not in existing:
                zf.writestr(icon["filename"], icon["content_bytes"])

    zip_path.write_bytes(buf.getvalue())
    return zip_path


def validate_extension(files: list[dict]) -> list[str]:
    """Validate that an extension has all required files.

    Returns a list of warning/error messages. Empty list means valid.
    """
    errors: list[str] = []
    filenames = {f["filename"] for f in files}

    if "manifest.json" not in filenames:
        errors.append("Missing manifest.json - extension will not work")

    if "popup.html" not in filenames:
        errors.append("Missing popup.html - extension popup will not display")

    # Check manifest content
    import json

    for f in files:
        if f["filename"] == "manifest.json":
            try:
                manifest = json.loads(f["content"])
                if manifest.get("manifest_version") != 3:
                    errors.append("manifest.json should use manifest_version 3")
                if not manifest.get("name"):
                    errors.append("manifest.json is missing 'name' field")
                if not manifest.get("version"):
                    errors.append("manifest.json is missing 'version' field")
            except json.JSONDecodeError:
                errors.append("manifest.json contains invalid JSON")
            break

    return errors
