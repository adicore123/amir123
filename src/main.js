import './style.css';

// ========================================
// המרכבה — Customer Form Logic (main.js)
// ========================================

// --- DOM References ---
const form = document.getElementById('serviceForm');
const toolGrid = document.getElementById('toolGrid');
const toolCards = toolGrid.querySelectorAll('.tool-card');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
const toolErrorMsg = document.getElementById('toolErrorMsg');

// --- Tool Card Selection Logic ---
toolCards.forEach((card) => {
  card.addEventListener('click', () => {
    // Check the hidden radio
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      // Trigger change event manually to ensure validation resets
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
});

// --- Clear Selection Errors on Change ---
const radioInputs = document.querySelectorAll('input[name="toolType"]');
radioInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (toolErrorMsg) toolErrorMsg.classList.add('hidden');
    toolGrid.classList.remove('error-shake');
    const divs = toolGrid.querySelectorAll('label > div:first-of-type');
    divs.forEach((d) => {
      d.classList.remove('border-red-400', 'bg-red-50/70');
      d.classList.add('border-white/80');
    });
  });
});

// --- Show Toast ---
let toastTimeout;
function showToast(message, type = 'success') {
  const icon = toast.querySelector('i');
  toastMsg.textContent = message;

  // Reset classes
  toast.className = 'toast fixed top-5 left-1/2 bg-white rounded-2xl py-3.5 px-6 shadow-glass border-r-4 flex items-center gap-2.5 z-[10000] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]';

  if (type === 'success') {
    toast.classList.add('border-r-waGreen');
    if (icon) {
      icon.className = 'ph-fill ph-check-circle text-2xl text-waGreen';
    }
  } else {
    toast.classList.add('border-r-red-500');
    if (icon) {
      icon.className = 'ph-fill ph-x-circle text-2xl text-red-500';
    }
  }

  // Clear previous timeout if any
  clearTimeout(toastTimeout);

  // Animate using inline styles for absolute reliability
  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0px)';
  toast.style.visibility = 'visible';

  // Auto hide
  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -100px)';
    // Hide visibility after transition completes
    setTimeout(() => {
      if (toast.style.opacity === '0') {
        toast.style.visibility = 'hidden';
      }
    }, 500);
  }, 4000);
}

// --- Toggle Loading ---
function setLoading(active) {
  if (active) {
    loadingOverlay.classList.add('active');
  } else {
    loadingOverlay.classList.remove('active');
  }
}

// --- Format WhatsApp Message ---
function formatWhatsAppMessage(data) {
  const lines = [
    `🔧 *פנייה חדשה - המרכבה 🛠️*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `👤 *לקוח:* ${data.clientName}`,
    `📱 *טלפון:* ${data.clientPhone}`,
    `🛴 *כלי:* ${data.toolType}`,
    ``,
    `⚠️ *תיאור התקלה:*`,
    data.problemDesc,
  ];

  if (data.notes) {
    lines.push(``);
    lines.push(`📝 *הערות:*`);
    lines.push(data.notes);
  }

  lines.push(``);
  lines.push(`━━━━━━━━━━━━━━━━━━`);
  lines.push(`_נשלח באמצעות מערכת פניות חכמה_`);

  return lines.join('\n');
}

// --- Form Submit Handler ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Gather values
  const clientName = document.getElementById('clientName').value.trim();
  const clientPhone = document.getElementById('clientPhone').value.trim();
  const problemDesc = document.getElementById('problemDesc').value.trim();
  const extraNotesField = document.getElementById('extraNotes');
  const extraNotes = extraNotesField ? extraNotesField.value.trim() : '';
  const toolTypeRadio = form.querySelector('input[name="toolType"]:checked');

  // Validation
  if (!clientName) {
    document.getElementById('clientName').focus();
    showToast('נא להזין שם מלא', 'error');
    return;
  }

  if (!clientPhone) {
    document.getElementById('clientPhone').focus();
    showToast('נא להזין מספר טלפון', 'error');
    return;
  }

  // Tool Type Validation with Premium Red Borders & Shake
  if (!toolTypeRadio) {
    toolGrid.classList.add('error-shake');
    if (toolErrorMsg) toolErrorMsg.classList.remove('hidden');

    const divs = toolGrid.querySelectorAll('label > div:first-of-type');
    divs.forEach((d) => {
      d.classList.add('border-red-400', 'bg-red-50/70');
      d.classList.remove('border-white/80');
    });

    showToast('נא לבחור סוג כלי', 'error');

    setTimeout(() => {
      toolGrid.classList.remove('error-shake');
    }, 400);
    return;
  }

  if (!problemDesc) {
    document.getElementById('problemDesc').focus();
    showToast('נא לתאר את התקלה', 'error');
    return;
  }

  const toolType = toolTypeRadio.value;

  const payload = {
    clientName,
    clientPhone,
    toolType,
    problemDesc,
    status: 'חדש',
    notes: extraNotes,
    createdAt: new Date().toISOString(),
  };

  setLoading(true);

  try {
    // POST to API
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    showToast('הבקשה נשלחה בהצלחה! 🎉');

    // Format and open WhatsApp
    const waMessage = formatWhatsAppMessage(payload);
    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/972549387731?text=${encoded}`;
    
    // Redirect directly for reliable mobile support
    window.location.href = waUrl;

    // Reset form
    form.reset();
    const divs = toolGrid.querySelectorAll('label > div:first-of-type');
    divs.forEach((d) => {
      d.classList.remove('border-red-400', 'bg-red-50/70');
      d.classList.add('border-white/80');
    });
  } catch (err) {
    console.error('Submit error:', err);
    showToast('שגיאה בשליחה. נסו שוב.', 'error');
  } finally {
    setLoading(false);
  }
});
