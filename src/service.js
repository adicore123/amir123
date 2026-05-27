import './style.css';

// ========================================
// המרכבה — Admin Dashboard Logic (service.js)
// ========================================

// --- DOM References ---
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const filterTool = document.getElementById('filterTool');
const filterStatus = document.getElementById('filterStatus');
const btnRefresh = document.getElementById('btnRefresh');
const statTotal = document.getElementById('statTotal');
const statNew = document.getElementById('statNew');
const statProgress = document.getElementById('statProgress');
const statCompleted = document.getElementById('statCompleted');

// --- State ---
let allRequests = [];

// --- Tool Type Icons Map ---
const toolIconMap = {
  'אופניים חשמליים': 'flash',
  'קורקינט חשמלי': 'battery-charging',
  'אופניים מכניות': 'bicycle',
  'אחר': 'build',
};

// --- Status CSS Class Map ---
const statusClassMap = {
  'חדש': 'status-new',
  'בטיפול': 'status-progress',
  'תוקן': 'status-repaired',
  'נסגר': 'status-closed',
};

// --- Format Date to Hebrew Locale ---
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr || '—';
  }
}

// --- Format phone for WhatsApp (remove leading 0, add 972) ---
function formatPhoneForWA(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('972')) return cleaned;
  if (cleaned.startsWith('0')) return '972' + cleaned.substring(1);
  return '972' + cleaned;
}

// --- Animate stat counter ---
function animateCounter(el, target) {
  const duration = 600;
  const start = parseInt(el.textContent) || 0;
  const diff = target - start;
  if (diff === 0) return;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.round(start + diff * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// --- Update Stats ---
function updateStats(data) {
  animateCounter(statTotal, data.length);
  animateCounter(statNew, data.filter((r) => r.status === 'חדש').length);
  animateCounter(statProgress, data.filter((r) => r.status === 'בטיפול').length);
  animateCounter(statCompleted, data.filter((r) => r.status === 'תוקן' || r.status === 'נסגר').length);
}

// --- Render Table ---
function renderTable(data) {
  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <ion-icon name="file-tray-outline"></ion-icon>
            <p>אין בקשות להצגה</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = data
    .map((req) => {
      const icon = toolIconMap[req.toolType] || 'help-circle';
      const statusClass = statusClassMap[req.status] || 'status-new';
      const waPhone = formatPhoneForWA(req.clientPhone || '');

      return `
      <tr data-id="${req.id || req._id || ''}">
        <td class="date-cell">${formatDate(req.createdAt)}</td>
        <td class="name-cell">${escapeHTML(req.clientName || '')}</td>
        <td>
          <span class="tool-type-badge">
            <ion-icon name="${icon}"></ion-icon>
            ${escapeHTML(req.toolType || '')}
          </span>
        </td>
        <td dir="ltr" style="text-align:right;">${escapeHTML(req.clientPhone || '')}</td>
        <td>${escapeHTML(req.problemDesc || '')}</td>
        <td>${escapeHTML(req.notes || '—')}</td>
        <td>
          <div class="status-select-wrapper">
            <select class="status-select ${statusClass}" data-request-id="${req.id || req._id || ''}" onchange="window.__updateStatus(this)">
              <option value="חדש" ${req.status === 'חדש' ? 'selected' : ''}>חדש</option>
              <option value="בטיפול" ${req.status === 'בטיפול' ? 'selected' : ''}>בטיפול</option>
              <option value="תוקן" ${req.status === 'תוקן' ? 'selected' : ''}>תוקן</option>
              <option value="נסגר" ${req.status === 'נסגר' ? 'selected' : ''}>נסגר</option>
            </select>
          </div>
        </td>
        <td>
          <div class="quick-actions">
            <a class="action-btn call" href="tel:${escapeHTML(req.clientPhone || '')}" title="התקשר">
              <ion-icon name="call"></ion-icon>
            </a>
            <a class="action-btn whatsapp" href="https://wa.me/${waPhone}" target="_blank" rel="noopener" title="וואטסאפ">
              <ion-icon name="logo-whatsapp"></ion-icon>
            </a>
          </div>
        </td>
      </tr>
    `;
    })
    .join('');
}

// --- Escape HTML ---
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Fetch Data ---
async function fetchRequests() {
  try {
    const res = await fetch('/api/requests');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Handle both array responses and {data: []} wrappers
    allRequests = Array.isArray(data) ? data : data.data || data.requests || [];
    // Sort by date descending
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    updateStats(allRequests);
    applyFilters();
  } catch (err) {
    console.error('Fetch error:', err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <ion-icon name="cloud-offline-outline"></ion-icon>
            <p>שגיאה בטעינת הנתונים. בדקו את החיבור לשרת.</p>
          </div>
        </td>
      </tr>
    `;
  }
}

// --- Apply Filters ---
function applyFilters() {
  let filtered = [...allRequests];

  const search = searchInput.value.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter(
      (r) =>
        (r.clientName || '').toLowerCase().includes(search) ||
        (r.clientPhone || '').includes(search)
    );
  }

  const toolFilter = filterTool.value;
  if (toolFilter) {
    filtered = filtered.filter((r) => r.toolType === toolFilter);
  }

  const statusFilter = filterStatus.value;
  if (statusFilter) {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  renderTable(filtered);
}

// --- Update Status via PUT ---
window.__updateStatus = async function (selectEl) {
  const requestId = selectEl.dataset.requestId;
  const newStatus = selectEl.value;
  const newClass = statusClassMap[newStatus] || 'status-new';

  // Update visual class immediately
  selectEl.className = `status-select ${newClass}`;

  try {
    const res = await fetch(`/api/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Update local state
    const item = allRequests.find((r) => (r.id || r._id) === requestId);
    if (item) item.status = newStatus;
    updateStats(allRequests);
  } catch (err) {
    console.error('Status update error:', err);
    // Optionally revert — for now just log
  }
};

// --- Event Listeners ---
searchInput.addEventListener('input', applyFilters);
filterTool.addEventListener('change', applyFilters);
filterStatus.addEventListener('change', applyFilters);

btnRefresh.addEventListener('click', () => {
  btnRefresh.classList.add('spinning');
  fetchRequests().finally(() => {
    setTimeout(() => btnRefresh.classList.remove('spinning'), 800);
  });
});

// --- Init ---
fetchRequests();
