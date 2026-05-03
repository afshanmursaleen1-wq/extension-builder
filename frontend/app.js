/* ========== ExtensionForge - Frontend Logic ========== */

let currentTaskId = null;
const uploadedImages = { prompt: [], clone: [] };

/* ========== Tab Switching ========== */
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.builder-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const mode = tab.dataset.mode;
    document.getElementById(`panel-${mode}`).classList.add('active');
    hideResult();
  });
});

/* Code tabs */
document.querySelectorAll('.code-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-editor').forEach(e => e.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ========== Image Upload ========== */
function setupUploadArea(areaId, inputId, previewId, mode) {
  const area = document.getElementById(areaId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('dragover');
  });

  area.addEventListener('dragleave', () => {
    area.classList.remove('dragover');
  });

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('dragover');
    handleFiles(e.dataTransfer.files, mode, preview);
  });

  input.addEventListener('change', () => {
    handleFiles(input.files, mode, preview);
    input.value = '';
  });
}

async function handleFiles(files, mode, previewContainer) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      uploadedImages[mode].push(data.path);

      const item = document.createElement('div');
      item.className = 'preview-item';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      const btn = document.createElement('button');
      btn.className = 'preview-remove';
      btn.textContent = '\u00D7';
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = uploadedImages[mode].indexOf(data.path);
        if (idx > -1) uploadedImages[mode].splice(idx, 1);
        item.remove();
      };

      item.appendChild(img);
      item.appendChild(btn);
      previewContainer.appendChild(item);
    } catch (err) {
      console.error('Upload error:', err);
    }
  }
}

setupUploadArea('upload-area-prompt', 'image-input-prompt', 'preview-prompt', 'prompt');
setupUploadArea('upload-area-clone', 'image-input-clone', 'preview-clone', 'clone');

/* ========== Generation Functions ========== */
function showLoading() {
  const area = document.getElementById('result-area');
  area.style.display = 'block';
  document.getElementById('loading-state').style.display = 'block';
  document.getElementById('success-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'none';
  area.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showSuccess(data) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('success-state').style.display = 'block';
  document.getElementById('error-state').style.display = 'none';

  document.getElementById('result-name').textContent = data.name || 'Extension';
  document.getElementById('result-description').textContent = data.description || '';

  const filesList = document.getElementById('result-files');
  filesList.innerHTML = '';
  (data.files || []).forEach(f => {
    const tag = document.createElement('span');
    tag.className = 'file-tag';
    const icon = getFileIcon(f);
    tag.innerHTML = `<span class="file-tag-icon">${icon}</span> ${f}`;
    filesList.appendChild(tag);
  });

  const warnList = document.getElementById('result-warnings');
  if (data.warnings && data.warnings.length > 0) {
    warnList.style.display = 'block';
    warnList.innerHTML = data.warnings.map(w => `<div class="warning-item">\u26A0\uFE0F ${w}</div>`).join('');
  } else {
    warnList.style.display = 'none';
  }

  currentTaskId = data.task_id;
}

function showError(message) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('success-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
  document.getElementById('error-message').textContent = message;
}

function hideResult() {
  document.getElementById('result-area').style.display = 'none';
}

function getFileIcon(filename) {
  if (filename.endsWith('.html')) return '\uD83C\uDFE0';
  if (filename.endsWith('.css')) return '\uD83C\uDFA8';
  if (filename.endsWith('.js')) return '\u26A1';
  if (filename.endsWith('.json')) return '\uD83D\uDCC4';
  if (filename.endsWith('.png') || filename.endsWith('.svg')) return '\uD83D\uDDBC\uFE0F';
  return '\uD83D\uDCC1';
}

function setButtonLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;display:inline-block;vertical-align:middle;"></span> Generating...';
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

/* ========== API Calls ========== */
async function generateFromPrompt() {
  const prompt = document.getElementById('prompt-input').value.trim();
  const url = document.getElementById('prompt-url').value.trim();
  const images = uploadedImages.prompt;

  if (!prompt && !url && images.length === 0) {
    alert('Please provide a prompt, URL, or upload images');
    return;
  }

  showLoading();
  setButtonLoading('btn-generate-prompt', true);

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('website_url', url);
    formData.append('mode', 'prompt');
    formData.append('image_paths', images.join(','));

    const res = await fetch('/api/generate', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || 'Generation failed');
    showSuccess(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setButtonLoading('btn-generate-prompt', false);
  }
}

async function generateClone() {
  const prompt = document.getElementById('clone-prompt').value.trim();
  const url = document.getElementById('clone-url').value.trim();
  const html = document.getElementById('clone-html').value.trim();
  const css = document.getElementById('clone-css').value.trim();
  const js = document.getElementById('clone-js').value.trim();
  const images = uploadedImages.clone;

  if (!prompt && !url && !html && !css && !js && images.length === 0) {
    alert('Please provide some reference material');
    return;
  }

  showLoading();
  setButtonLoading('btn-generate-clone', true);

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('website_url', url);
    formData.append('mode', 'clone');
    formData.append('image_paths', images.join(','));
    formData.append('html_code', html);
    formData.append('css_code', css);
    formData.append('js_code', js);

    const res = await fetch('/api/generate', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || 'Clone generation failed');
    showSuccess(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setButtonLoading('btn-generate-clone', false);
  }
}

async function generateFromCode() {
  const name = document.getElementById('code-name').value.trim();
  const desc = document.getElementById('code-description').value.trim();
  const html = document.getElementById('code-html-input').value.trim();
  const css = document.getElementById('code-css-input').value.trim();
  const js = document.getElementById('code-js-input').value.trim();
  const contentJs = document.getElementById('code-content-input').value.trim();
  const bgJs = document.getElementById('code-bg-input').value.trim();
  const url = document.getElementById('code-url').value.trim();

  if (!html && !css && !js && !contentJs && !bgJs) {
    alert('Please provide at least one code snippet');
    return;
  }

  showLoading();
  setButtonLoading('btn-generate-code', true);

  try {
    const formData = new FormData();
    formData.append('name', name || 'My Extension');
    formData.append('description', desc || 'A Chrome extension');
    formData.append('html_code', html);
    formData.append('css_code', css);
    formData.append('js_code', js);
    formData.append('content_js', contentJs);
    formData.append('background_js', bgJs);
    formData.append('website_url', url);

    const res = await fetch('/api/generate-from-code', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || 'Generation failed');
    showSuccess(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setButtonLoading('btn-generate-code', false);
  }
}

function downloadExtension() {
  if (!currentTaskId) return;
  window.location.href = `/api/download/${currentTaskId}`;
}

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
