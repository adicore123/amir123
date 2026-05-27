import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

// Define paths
const logoPath = path.join(__dirname, 'public/logo.jpg');
const outputPath = path.join(__dirname, 'דיווח_תקלה_המרכבה.html');

console.log('Generating offline HTML...');

let logoBase64 = '';
try {
  if (fs.existsSync(logoPath)) {
    const fileBuffer = fs.readFileSync(logoPath);
    logoBase64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    console.log('Successfully loaded logo image and converted to Base64.');
  } else {
    console.warn('Logo image not found at', logoPath);
  }
} catch (err) {
  console.error('Failed to process logo image:', err);
}

// Complete self-contained offline HTML content
const htmlContent = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>המרכבה — דיווח תקלה מהיר</title>
  <style>
    /* --- CSS Reset & Variables --- */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --merkava-blue: #1B1F44;
      --merkava-orange: #F58220;
      --wa-green: #25D366;
      --wa-green-hover: #128C7E;
      --sms-blue: #007AFF;
      --sms-blue-hover: #0056b3;
      --bg-color: #f0f4f8;
      --text-color: #334155;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-color);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      line-height: 1.5;
      position: relative;
      overflow-x: hidden;
    }

    /* --- Background watermark --- */
    .bg-watermark {
      position: fixed;
      inset: 0;
      background-image: url('${logoBase64}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: 60% auto;
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
      mix-blend-mode: darken;
    }

    .container {
      width: 100%;
      max-width: 480px;
      position: relative;
      z-index: 10;
      margin: 0 auto;
    }

    /* --- Top secure pill --- */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 8px;
    }

    .pill {
      background: rgba(255, 255, 255, 0.7);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: bold;
      color: #475569;
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 8px rgba(31, 38, 135, 0.05);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* --- Card Glassmorphism --- */
    .card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 30px rgba(31, 38, 135, 0.06);
      overflow: hidden;
    }

    /* --- Header --- */
    .header {
      padding: 24px 24px 16px;
      text-align: center;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    }

    .logo-container {
      width: 76px;
      height: 76px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border: 2px solid white;
      overflow: hidden;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .title {
      font-size: 22px;
      font-weight: 800;
      color: var(--merkava-blue);
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    /* --- Form --- */
    .form {
      padding: 24px;
    }

    .space-y {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      color: #94a3b8;
      pointer-events: none;
    }

    .input {
      width: 100%;
      padding: 12px 42px 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      color: #1e293b;
      outline: none;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .input:focus {
      background: white;
      border-color: var(--merkava-orange);
      box-shadow: 0 0 0 4px rgba(245, 130, 32, 0.12);
    }

    textarea.input {
      resize: none;
      padding: 12px 14px;
      min-height: 80px;
    }

    /* --- Inline location widget --- */
    .location-widget {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(245, 130, 32, 0.2);
      border-radius: 16px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 4px;
    }

    .location-header {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .location-icon {
      background: #fff7ed;
      border: 1px solid #ffedd5;
      padding: 6px;
      border-radius: 10px;
      font-size: 18px;
      color: var(--merkava-orange);
    }

    .location-title {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
    }

    .location-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    .nav-btn {
      width: 100%;
      background: #fafafa;
      border: 1px solid rgba(0,0,0,0.1);
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .maps-logo {
      width: 16px;
      height: 16px;
    }

    /* --- Grid Selection --- */
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .grid-card {
      position: relative;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.6);
      padding: 16px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s ease;
    }

    .grid-card input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .grid-card:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: #cbd5e1;
    }

    .grid-card.selected {
      border-color: var(--merkava-orange);
      background: #fffbeb;
      box-shadow: 0 4px 12px rgba(245, 130, 32, 0.08);
    }

    .card-icon {
      font-size: 24px;
      color: #94a3b8;
      transition: color 0.3s;
    }

    .grid-card.selected .card-icon {
      color: var(--merkava-orange);
    }

    .card-label {
      font-size: 12px;
      font-weight: bold;
      color: #475569;
    }

    .grid-card.selected .card-label {
      color: var(--merkava-blue);
    }

    .grid-check {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--merkava-orange);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s ease;
    }

    .grid-card.selected .grid-check {
      opacity: 1;
      transform: scale(1);
    }

    .check-svg {
      width: 10px;
      height: 10px;
      stroke: white;
      stroke-width: 3;
      fill: none;
    }

    /* --- Action Button --- */
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, var(--wa-green), var(--wa-green-hover));
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 14px 20px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
    }

    /* --- Result Panel (Hidden by default) --- */
    .result-panel {
      display: none;
      padding: 24px;
      animation: fadeIn 0.4s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .success-badge {
      background: #dcfce7;
      color: #166534;
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }

    .result-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--merkava-blue);
    }

    .result-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .output-box {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      font-size: 13px;
      color: #334155;
      font-family: inherit;
      line-height: 1.6;
      resize: none;
      height: 160px;
      outline: none;
      margin-bottom: 16px;
    }

    .action-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-action {
      width: 100%;
      padding: 12px 20px;
      border-radius: 10px;
      border: none;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-wa-direct {
      background: var(--wa-green);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
    }

    .btn-wa-direct:hover {
      background: var(--wa-green-hover);
      transform: translateY(-1px);
    }

    .btn-sms {
      background: var(--sms-blue);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
    }

    .btn-sms:hover {
      background: var(--sms-blue-hover);
      transform: translateY(-1px);
    }

    .btn-copy {
      background: #e2e8f0;
      color: #475569;
      border: 1px solid #cbd5e1;
    }

    .btn-copy:hover {
      background: #cbd5e1;
    }

    .btn-back {
      background: transparent;
      color: #64748b;
      font-size: 13px;
      text-decoration: underline;
      margin-top: 10px;
      cursor: pointer;
      border: none;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-back:hover {
      color: var(--merkava-blue);
    }

    .error-msg {
      color: #ef4444;
      font-size: 11px;
      font-weight: bold;
      margin-top: 2px;
      display: none;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }

    .shake {
      animation: shake 0.4s ease-in-out;
    }

    .toast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: white;
      border-radius: 12px;
      padding: 12px 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 10000;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: bold;
      font-size: 13px;
      border-right: 4px solid var(--wa-green);
    }
  </style>
</head>
<body>

  <!-- Background Watermark -->
  <div class="bg-watermark"></div>

  <!-- Toast Message -->
  <div class="toast" id="toast">
    <svg style="width:18px;height:18px;fill:var(--wa-green);" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <span id="toastMsg">הועתק בהצלחה!</span>
  </div>

  <div class="container">
    
    <!-- Top Secure Pill -->
    <div class="top-bar">
      <div class="pill">
        <!-- SVG Secure shield -->
        <svg style="width:14px;height:14px;fill:#166534;" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        פנייה ישירה
      </div>
      <div class="pill" style="font-weight: normal;">בס"ד</div>
    </div>

    <!-- Main Card -->
    <div class="card">
      
      <!-- Card Header -->
      <div class="header">
        <div class="logo-container">
          <img class="logo-img" src="${logoBase64}" alt="לוגו המרכבה">
        </div>
        <h1 class="title">המרכבה</h1>
        <p class="subtitle">דיווח תקלה מהיר ושליחה ישירה למוסך</p>
      </div>

      <!-- Form Panel -->
      <form id="offlineForm" class="form" onsubmit="generateRequest(event)" novalidate>
        <div class="space-y">
          
          <!-- Shop Location Inline Info -->
          <div class="location-widget">
            <div class="location-header">
              <div class="location-icon">
                <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div class="text-right">
                <h4 class="location-title">יהודה הנשיא 94, אלעד</h4>
                <p class="location-desc">🍕 צמוד לפיצה שמש! נכנסים לחניון, עולים ישר בעלייה ואנחנו שם בשבילכם!</p>
              </div>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=%D7%94%D7%9E%D7%A5%D7%9B%D7%91%D7%94+%D7%A2%D7%95%D7%9C%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%92%D7%9C%D7%9C+%D7%99%D7%94%D7%95%D7%93%D7%94+%D7%94%D7%A0%D7%A9%D7%99%D7%90+94+%D7%90%D7%9C%D7%A2%D7%93" target="_blank" rel="noopener noreferrer" class="nav-btn">
              <img class="maps-logo" src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps">
              ניווט לחנות בגוגל מפות
            </a>
          </div>

          <!-- Name field -->
          <div class="field-group">
            <label class="label" for="clientName">איך קוראים לך?</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <input type="text" class="input" id="clientName" placeholder="שם מלא" required>
            </div>
            <span class="error-msg" id="nameError">חובה להזין שם מלא</span>
          </div>

          <!-- Phone field -->
          <div class="field-group">
            <label class="label" for="clientPhone">מה מספר הטלפון שלך?</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </span>
              <input type="tel" class="input" id="clientPhone" placeholder="מספר טלפון ליצירת קשר" required dir="ltr" style="text-align: right;">
            </div>
            <span class="error-msg" id="phoneError">חובה להזין מספר טלפון</span>
          </div>

          <!-- Tool selection -->
          <div class="field-group" id="toolGridGroup">
            <label class="label">איזה כלי צריך תיקון?</label>
            <div class="grid-container" id="toolGrid">
              
              <!-- Scooter -->
              <div class="grid-card" onclick="selectTool(this, 'קורקינט חשמלי')">
                <span class="card-icon">🛴</span>
                <span class="card-label">קורקינט חשמלי</span>
                <div class="grid-check">
                  <svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>

              <!-- Electric Bicycle -->
              <div class="grid-card" onclick="selectTool(this, 'אופניים חשמליים')">
                <span class="card-icon">⚡</span>
                <span class="card-label">אופניים חשמליים</span>
                <div class="grid-check">
                  <svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>

              <!-- Mechanical Bicycle -->
              <div class="grid-card" onclick="selectTool(this, 'אופניים מכניות')">
                <span class="card-icon">🚲</span>
                <span class="card-label">אופניים מכניות</span>
                <div class="grid-check">
                  <svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>

              <!-- Other -->
              <div class="grid-card" onclick="selectTool(this, 'אחר')">
                <span class="card-icon">⚙️</span>
                <span class="card-label">אחר</span>
                <div class="grid-check">
                  <svg class="check-svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>

            </div>
            <input type="hidden" id="selectedTool" required>
            <span class="error-msg" id="toolError" style="margin-top: 4px;">חובה לבחור סוג כלי</span>
          </div>

          <!-- Problem description -->
          <div class="field-group">
            <label class="label" for="problemDesc">תיאור התקלה</label>
            <textarea class="input" id="problemDesc" placeholder="מה בדיוק קרה? קולות מוזרים? פנצ'ר?" required></textarea>
            <span class="error-msg" id="descError">חובה לתאר את התקלה</span>
          </div>

          <!-- Extra notes -->
          <div class="field-group">
            <label class="label" for="extraNotes">הערות (אופציונלי)</label>
            <textarea class="input" id="extraNotes" placeholder="בקשות מיוחדות, זמן הגעה וכו'"></textarea>
          </div>

          <!-- Submit -->
          <div style="margin-top: 8px;">
            <button type="submit" class="btn-submit">
              <svg style="width:20px;height:20px;fill:currentColor;" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.88 4.42-9.88 9.89 0 2.09.55 4.14 1.59 5.95L2.06 24l6.3-1.65a11.895 11.895 0 005.69 1.45h.01c5.45 0 9.88-4.43 9.88-9.89 0-2.64-1.03-5.12-2.9-6.99A9.825 9.825 0 0012.04 2zm0 18.29h-.01c-1.87 0-3.7-.5-5.37-1.45l-.39-.23-3.97 1.04 1.06-3.87-.25-.4c-1.05-1.67-1.61-3.61-1.61-5.6 0-4.83 3.93-8.76 8.76-8.76 2.34 0 4.54.91 6.19 2.57a8.706 8.706 0 012.56 6.2c-.02 4.83-3.95 8.76-8.77 8.76zm4.84-6.6c-.26-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.17.27-.68.86-.84 1.04-.15.18-.31.2-.57.07-.26-.13-1.11-.41-2.12-1.31-.79-.7-1.32-1.57-1.48-1.84-.16-.27-.02-.41.12-.55.12-.12.26-.31.39-.46.13-.15.17-.26.26-.44.09-.18.04-.33-.02-.46-.06-.13-.59-1.42-.81-1.96-.21-.52-.43-.45-.6-.46-.15-.01-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.92.9-0.92 2.2 0 1.3 0.94 2.55 1.07 2.73.13.18 1.86 2.84 4.51 3.98.63.27 1.12.43 1.5.55.63.2 1.21.17 1.66.1.51-.08 1.57-.64 1.79-1.25.22-.61.22-1.14.15-1.25-.06-.11-.24-.17-.5-.3z"/>
              </svg>
              שלח דיווח ישירות לוואטסאפ
            </button>
          </div>

        </div>
      </form>

      <!-- Result Screen -->
      <div id="resultPanel" class="result-panel">
        <div class="result-header">
          <div class="success-badge">
            <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            ההודעה הופקה!
          </div>
          <h2 class="result-title">הפרטים מוכנים לשליחה</h2>
          <p class="result-subtitle">אם וואטסאפ לא נפתח או שאתם ללא אינטרנט, השתמשו באפשרויות הבאות:</p>
        </div>

        <textarea id="outputBox" class="output-box" readonly></textarea>

        <div class="action-row">
          <!-- WhatsApp Manual Button -->
          <a id="waDirectLink" href="#" target="_blank" class="btn-action btn-wa-direct">
            <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.88 4.42-9.88 9.89 0 2.09.55 4.14 1.59 5.95L2.06 24l6.3-1.65a11.895 11.895 0 005.69 1.45h.01c5.45 0 9.88-4.43 9.88-9.89 0-2.64-1.03-5.12-2.9-6.99A9.825 9.825 0 0012.04 2zm0 18.29h-.01c-1.87 0-3.7-.5-5.37-1.45l-.39-.23-3.97 1.04 1.06-3.87-.25-.4c-1.05-1.67-1.61-3.61-1.61-5.6 0-4.83 3.93-8.76 8.76-8.76 2.34 0 4.54.91 6.19 2.57a8.706 8.706 0 012.56 6.2c-.02 4.83-3.95 8.76-8.77 8.76zm4.84-6.6c-.26-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.17.27-.68.86-.84 1.04-.15.18-.31.2-.57.07-.26-.13-1.11-.41-2.12-1.31-.79-.7-1.32-1.57-1.48-1.84-.16-.27-.02-.41.12-.55.12-.12.26-.31.39-.46.13-.15.17-.26.26-.44.09-.18.04-.33-.02-.46-.06-.13-.59-1.42-.81-1.96-.21-.52-.43-.45-.6-.46-.15-.01-.33-.01-.51-.01-.18 0-.46.07-.7.33-.24.26-.92.9-0.92 2.2 0 1.3 0.94 2.55 1.07 2.73.13.18 1.86 2.84 4.51 3.98.63.27 1.12.43 1.5.55.63.2 1.21.17 1.66.1.51-.08 1.57-.64 1.79-1.25.22-.61.22-1.14.15-1.25-.06-.11-.24-.17-.5-.3z"/>
            </svg>
            שליחה מחדש לוואטסאפ למוסך
          </a>

          <!-- Copy to Clipboard Button -->
          <button onclick="copyToClipboard()" class="btn-action btn-copy">
            <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            העתק הודעה (להדבקה ידנית בוואטסאפ)
          </button>

          <!-- Send SMS Button -->
          <a id="smsLink" href="#" class="btn-action btn-sms">
            <svg style="width:18px;height:18px;fill:currentColor;" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
            </svg>
            שלח ב-SMS למוסך (לא דורש אינטרנט)
          </a>

          <!-- Back Button -->
          <button onclick="showForm()" class="btn-back">חזרה לעריכת הפרטים</button>
        </div>
      </div>

    </div>
  </div>

  <script>
    let selectedToolName = '';

    // Handle tool selection
    window.selectTool = function(card, toolName) {
      // Remove selected from all
      const cards = document.querySelectorAll('.grid-card');
      cards.forEach(c => c.classList.remove('selected'));
      
      // Select clicked
      card.classList.add('selected');
      selectedToolName = toolName;
      document.getElementById('selectedTool').value = toolName;
      
      // Hide error if selected
      document.getElementById('toolError').style.display = 'none';
      document.getElementById('toolGridGroup').classList.remove('shake');
    };

    // Show form screen
    window.showForm = function() {
      document.getElementById('offlineForm').style.display = 'block';
      document.getElementById('resultPanel').style.display = 'none';
    };

    // Show toast message
    function showToast(message) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      toastMsg.textContent = message;
      
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0px)';
      
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -100px)';
      }, 3000);
    }

    // Copy formatted request text to clipboard
    window.copyToClipboard = function() {
      const box = document.getElementById('outputBox');
      box.select();
      box.setSelectionRange(0, 99999); // for mobile
      
      try {
        navigator.clipboard.writeText(box.value);
        showToast('הועתק בהצלחה! 📋');
      } catch (err) {
        // Fallback for older browsers
        document.execCommand('copy');
        showToast('הועתק בהצלחה! 📋');
      }
    };

    // Generate formatted request and show result screen
    window.generateRequest = function(event) {
      event.preventDefault();
      
      // Reset errors
      const errors = document.querySelectorAll('.error-msg');
      errors.forEach(e => e.style.display = 'none');
      
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const problem = document.getElementById('problemDesc').value.trim();
      const notes = document.getElementById('extraNotes').value.trim();
      
      let hasError = false;
      
      if (!name) {
        document.getElementById('nameError').style.display = 'block';
        document.getElementById('clientName').focus();
        hasError = true;
      }
      
      if (!phone) {
        document.getElementById('phoneError').style.display = 'block';
        if (!hasError) {
          document.getElementById('clientPhone').focus();
          hasError = true;
        }
      }
      
      if (!selectedToolName) {
        document.getElementById('toolError').style.display = 'block';
        document.getElementById('toolGridGroup').classList.add('shake');
        setTimeout(() => {
          document.getElementById('toolGridGroup').classList.remove('shake');
        }, 400);
        hasError = true;
      }
      
      if (!problem) {
        document.getElementById('descError').style.display = 'block';
        if (!hasError) {
          document.getElementById('problemDesc').focus();
          hasError = true;
        }
      }
      
      if (hasError) return;
      
      // Format text body
      let msg = "*פנייה חדשה - המרכבה 🛠️*\\n";
      msg += "━━━━━━━━━━━━━━━━━━\\n\\n";
      msg += "*👤 לקוח:* " + name + "\\n";
      msg += "*📱 טלפון:* " + phone + "\\n";
      msg += "*🛴 כלי:* " + selectedToolName + "\\n\\n";
      msg += "*⚠️ תיאור התקלה:*\\n" + problem + "\\n";
      
      if (notes) {
        msg += "\\n*📝 הערות:*\\n" + notes + "\\n";
      }
      msg += "\\n━━━━━━━━━━━━━━━━━━\\n_נשלח באמצעות קובץ פניות חכם_";
      
      const textMessage = msg.replace(/\\\\n/g, '\\n');
      
      // Set to output text box
      document.getElementById('outputBox').value = textMessage;
      
      // Format URLs
      const smsNumber = "0549387731";
      const encodedMsg = encodeURIComponent(textMessage);
      
      // WhatsApp link
      const waUrl = "https://wa.me/972549387731?text=" + encodedMsg;
      document.getElementById('waDirectLink').href = waUrl;
      
      // SMS link
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const separator = isIOS ? '&' : '?';
      document.getElementById('smsLink').href = "sms:" + smsNumber + separator + "body=" + encodedMsg;
      
      // Try auto redirect to WhatsApp first!
      window.location.href = waUrl;
      
      // Toggle views so fallback is shown when they return
      document.getElementById('offlineForm').style.display = 'none';
      document.getElementById('resultPanel').style.display = 'block';
    };
  </script>
</body>
</html>`;

fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log('Successfully generated self-contained offline html at:', outputPath);
