/**
 * GRIYA ASRI DEVELOPMENT
 * Siteplan Interactive JavaScript
 * ================================
 * Handles: SVG Siteplan Interaction, Kavling Grid,
 *          Modal Detail Kavling, Floor Plan SVG,
 *          Lightbox Fullscreen, WA Dynamic Message
 */

'use strict';

/* =====================================================
   1. KAVLING DATA (Inline fallback when JSON fails)
   ===================================================== */
const kavlingDataFallback = {
  'subsidi-asri': {
    nama: 'Subsidi Asri Residence',
    wa: '6281234567890',
    kavling: [
      { id:'A01', nomor:'A-01', cluster:'A', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-001/Makmur', tipe_lantai:1 },
      { id:'A02', nomor:'A-02', cluster:'A', status:'booking', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-002/Makmur', tipe_lantai:1 },
      { id:'A03', nomor:'A-03', cluster:'A', status:'terjual', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-003/Makmur', tipe_lantai:1 },
      { id:'A04', nomor:'A-04', cluster:'A', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-004/Makmur', tipe_lantai:1 },
      { id:'A05', nomor:'A-05', cluster:'A', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-005/Makmur', tipe_lantai:1 },
      { id:'A06', nomor:'A-06', cluster:'A', status:'terjual', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.A-006/Makmur', tipe_lantai:1 },
      { id:'B01', nomor:'B-01', cluster:'B', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-001/Makmur', tipe_lantai:1 },
      { id:'B02', nomor:'B-02', cluster:'B', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-002/Makmur', tipe_lantai:1 },
      { id:'B03', nomor:'B-03', cluster:'B', status:'booking', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-003/Makmur', tipe_lantai:1 },
      { id:'B04', nomor:'B-04', cluster:'B', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-004/Makmur', tipe_lantai:1 },
      { id:'B05', nomor:'B-05', cluster:'B', status:'terjual', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-005/Makmur', tipe_lantai:1 },
      { id:'B06', nomor:'B-06', cluster:'B', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.B-006/Makmur', tipe_lantai:1 },
      { id:'C01', nomor:'C-01', cluster:'C', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-001/Makmur', tipe_lantai:1 },
      { id:'C02', nomor:'C-02', cluster:'C', status:'terjual', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-002/Makmur', tipe_lantai:1 },
      { id:'C03', nomor:'C-03', cluster:'C', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-003/Makmur', tipe_lantai:1 },
      { id:'C04', nomor:'C-04', cluster:'C', status:'booking', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-004/Makmur', tipe_lantai:1 },
      { id:'C05', nomor:'C-05', cluster:'C', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-005/Makmur', tipe_lantai:1 },
      { id:'C06', nomor:'C-06', cluster:'C', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-006/Makmur', tipe_lantai:1 },
      { id:'C07', nomor:'C-07', cluster:'C', status:'terjual', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-007/Makmur', tipe_lantai:1 },
      { id:'C08', nomor:'C-08', cluster:'C', status:'tersedia', harga:168000000, lt:60, lb:36, dimensi:'6×10 m', sertifikat:'SHM No.C-008/Makmur', tipe_lantai:1 },
    ],
    biaya_tambahan: {
      bphtb_persen: 5, bphtb_njop_min: 60000000,
      biaya_akta_ajb: 2500000, biaya_notaris: 3000000,
      provisi_bank_persen: 1, biaya_appraisal: 500000
    }
  }
};

/* =====================================================
   2. STATE
   ===================================================== */
let currentProyekData = null;
let allKavlingData = [];
let selectedKavlingId = null;

/* =====================================================
   3. INIT SITEPLAN (called from app.js onDataLoaded)
   ===================================================== */
function initSiteplan(proyekDataFromJson) {
  currentProyekData = proyekDataFromJson || kavlingDataFallback['subsidi-asri'];
  allKavlingData = currentProyekData.kavling || kavlingDataFallback['subsidi-asri'].kavling;

  buildKavlingGridButtons();
  attachSVGKavlingEvents();
  initModal();
  initLightbox();
  initZoomControls();
}

// Also initialize on DOMContentLoaded as fallback
document.addEventListener('DOMContentLoaded', () => {
  const pageId = document.body.dataset.proyekId;
  if (!pageId) return;

  // Use fallback data immediately (JSON data enhances this later)
  if (!currentProyekData) {
    const fallback = kavlingDataFallback[pageId];
    if (fallback) {
      allKavlingData = fallback.kavling;
      currentProyekData = fallback;
      buildKavlingGridButtons();
      attachSVGKavlingEvents();
      initModal();
      initLightbox();
      initZoomControls();
    }
  }
});

/* =====================================================
   4. BUILD KAVLING GRID BUTTONS
   ===================================================== */
function buildKavlingGridButtons() {
  const clusters = {};
  allKavlingData.forEach(kv => {
    if (!clusters[kv.cluster]) clusters[kv.cluster] = [];
    clusters[kv.cluster].push(kv);
  });

  Object.entries(clusters).forEach(([clusterId, kavlings]) => {
    const containerId = `grid-cluster-${clusterId.toLowerCase()}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    kavlings.forEach(kv => {
      const btn = document.createElement('button');
      btn.className = `kavling-btn ${kv.status}`;
      btn.textContent = kv.nomor;
      btn.dataset.kavlingId = kv.id;
      btn.setAttribute('title', `${kv.nomor} - ${kv.status.toUpperCase()} - ${formatHargaFull(kv.harga)}`);
      btn.setAttribute('aria-label', `Kavling ${kv.nomor}, status: ${kv.status}`);

      if (kv.status !== 'terjual') {
        btn.addEventListener('click', () => {
          selectKavling(kv.id);
        });
      } else {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      }

      container.appendChild(btn);
    });
  });
}

/* =====================================================
   5. SVG KAVLING CLICK EVENTS
   ===================================================== */
function attachSVGKavlingEvents() {
  const siteplanSvg = document.getElementById('siteplan-svg');
  if (!siteplanSvg) return;

  const kavlingCells = siteplanSvg.querySelectorAll('.kavling-cell');
  kavlingCells.forEach(cell => {
    const kavlingId = cell.dataset.kavlingId;
    const status = cell.dataset.status;

    if (status !== 'terjual') {
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', () => selectKavling(kavlingId));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectKavling(kavlingId);
        }
      });
      // Hover effect via CSS class
      cell.addEventListener('mouseenter', () => highlightSVGKavling(kavlingId));
      cell.addEventListener('mouseleave', () => unhighlightSVGKavling(kavlingId));
    }
  });
}

function highlightSVGKavling(kavlingId) {
  const cell = document.querySelector(`[data-kavling-id="${kavlingId}"]`);
  if (cell) {
    const rect = cell.querySelector('rect');
    if (rect) {
      rect.style.filter = 'brightness(1.3)';
      rect.style.strokeWidth = '2.5';
    }
  }
}

function unhighlightSVGKavling(kavlingId) {
  const cell = document.querySelector(`[data-kavling-id="${kavlingId}"]`);
  if (cell) {
    const rect = cell.querySelector('rect');
    if (rect) {
      rect.style.filter = '';
      rect.style.strokeWidth = '';
    }
  }
}

/* =====================================================
   6. SELECT KAVLING (unified handler)
   ===================================================== */
function selectKavling(kavlingId) {
  selectedKavlingId = kavlingId;
  if (typeof currentKavlingId !== 'undefined') {
    window.currentKavlingId = kavlingId;
  }

  const kv = allKavlingData.find(k => k.id === kavlingId);
  if (!kv) {
    console.warn('Kavling not found:', kavlingId);
    return;
  }

  // Update grid button selection
  document.querySelectorAll('.kavling-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.kavlingId === kavlingId) btn.classList.add('selected');
  });

  // Highlight SVG
  document.querySelectorAll('.kavling-cell rect').forEach(rect => {
    rect.style.filter = '';
    rect.style.strokeWidth = '';
  });
  const selectedCell = document.querySelector(`[data-kavling-id="${kavlingId}"] rect`);
  if (selectedCell) {
    selectedCell.style.filter = 'brightness(1.5) drop-shadow(0 0 6px rgba(255,255,255,0.5))';
    selectedCell.style.strokeWidth = '3';
  }

  // Show quick info panel
  updateQuickInfoPanel(kv);

  // Open modal
  openKavlingModal(kv);
}

/* =====================================================
   7. QUICK INFO PANEL
   ===================================================== */
function updateQuickInfoPanel(kv) {
  const panel = document.getElementById('kavling-quick-info');
  if (!panel) return;

  panel.classList.remove('hidden');

  const statusBadge = document.getElementById('quick-badge');
  if (statusBadge) {
    statusBadge.textContent = '● ' + kv.status.charAt(0).toUpperCase() + kv.status.slice(1);
    statusBadge.className = `badge-${kv.status}`;
  }

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('quick-nomor', kv.nomor);
  setText('quick-harga', kv.harga > 0 ? 'Rp ' + formatRupiah(kv.harga) : '-');
  setText('quick-lt', kv.lt + ' m²');
  setText('quick-lb', kv.lb > 0 ? kv.lb + ' m²' : 'Kavling Kosong');
  setText('quick-dimensi', kv.dimensi || '-');
}

/* =====================================================
   8. KAVLING MODAL
   ===================================================== */
function initModal() {
  const modal = document.getElementById('kavling-modal');
  const closeBtn = document.getElementById('modal-close');

  if (!modal) return;

  closeBtn?.addEventListener('click', closeKavlingModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeKavlingModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeKavlingModal();
    }
  });

  // Zoom floorplan button
  const zoomBtn = document.getElementById('btn-zoom-floorplan');
  if (zoomBtn) {
    zoomBtn.addEventListener('click', openLightbox);
  }

  // KPR sync button
  const kprBtn = document.getElementById('modal-kpr-btn');
  if (kprBtn) {
    kprBtn.addEventListener('click', () => {
      if (selectedKavlingId) {
        const kv = allKavlingData.find(k => k.id === selectedKavlingId);
        if (kv) {
          const hargaEl = document.getElementById('kpr-harga');
          if (hargaEl) {
            hargaEl.value = formatRupiah(kv.harga);
            if (typeof calculateKPR === 'function') calculateKPR();
          }
        }
      }
      closeKavlingModal();
      scrollToSection('kalkulator');
    });
  }
}

function openModal(kavlingId) {
  selectKavling(kavlingId || selectedKavlingId);
}

function openKavlingModal(kv) {
  const modal = document.getElementById('kavling-modal');
  if (!modal) return;

  // Populate modal fields
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setText('modal-title', 'Detail Kavling ' + kv.nomor);
  setText('modal-nomor', kv.nomor);
  setText('modal-harga', kv.harga > 0 ? 'Rp ' + formatRupiah(kv.harga) : 'Hubungi Sales');
  setText('modal-lt', kv.lt + ' m²');
  setText('modal-lb', kv.lb > 0 ? kv.lb + ' m²' : 'Kavling Kosong');
  setText('modal-dimensi', kv.dimensi || '-');
  setText('modal-sertifikat', kv.sertifikat || '-');
  setText('modal-tipe-lantai', kv.tipe_lantai > 0 ? kv.tipe_lantai + ' Lantai' : 'Kavling Tanah');

  // Badge
  const badge = document.getElementById('modal-badge');
  if (badge) {
    badge.textContent = '● ' + kv.status.charAt(0).toUpperCase() + kv.status.slice(1);
    badge.className = `badge-${kv.status}`;
  }

  // WA Button with dynamic message
  const waBtn = document.getElementById('modal-wa-btn');
  if (waBtn) {
    const proyekNama = currentProyekData?.nama || 'Griya Asri Residence';
    const hargaStr = kv.harga > 0 ? 'Rp ' + formatRupiah(kv.harga) : 'sesuai penawaran';
    const msg = `Halo Griya Asri Development, saya tertarik dengan unit di proyek ${proyekNama}. Saya telah melihat detail Kavling ${kv.nomor} seharga ${hargaStr}. Bisakah saya dibantu untuk proses booking dan survey lokasi?`;
    waBtn.onclick = () => {
      window.open(`https://wa.me/${currentProyekData?.wa || '6281234567890'}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    };
  }

  // Floating WA button update
  const waFloat = document.getElementById('wa-float-detail');
  if (waFloat && kv.harga > 0) {
    const proyekNama = currentProyekData?.nama || 'Griya Asri Residence';
    const msg = `Halo Griya Asri Development, saya tertarik dengan unit di proyek ${proyekNama}. Saya telah melihat detail Kavling ${kv.nomor} seharga Rp ${formatRupiah(kv.harga)}. Bisakah saya dibantu untuk proses booking dan survey lokasi?`;
    waFloat.href = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
  }

  // KPR button - sync harga
  const kprBtn = document.getElementById('modal-kpr-btn');
  if (kprBtn && kv.harga > 0) {
    kprBtn.onclick = () => {
      const hargaEl = document.getElementById('kpr-harga');
      if (hargaEl) {
        hargaEl.value = formatRupiah(kv.harga);
        if (typeof calculateKPR === 'function') setTimeout(calculateKPR, 100);
      }
      closeKavlingModal();
      setTimeout(() => scrollToSection('kalkulator'), 300);
    };
  }

  // Render floor plan
  renderFloorPlan(kv.tipe_lantai, kv.lb, kv.lt);

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus management
  setTimeout(() => {
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.focus();
  }, 300);
}

function closeKavlingModal() {
  const modal = document.getElementById('kavling-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* =====================================================
   9. FLOOR PLAN SVG RENDERER
   ===================================================== */
function renderFloorPlan(tipe_lantai, lb, lt) {
  const container = document.getElementById('modal-floorplan-container');
  if (!container) return;

  if (tipe_lantai === 1) {
    container.innerHTML = generateFloorPlan1Lantai(lb, lt);
  } else if (tipe_lantai === 2) {
    container.innerHTML = generateFloorPlan2Lantai(lb, lt);
  } else {
    container.innerHTML = generateFloorPlanKavling(lt);
  }
}

function generateFloorPlan1Lantai(lb, lt) {
  return `
    <div class="p-2">
      <div class="text-center text-xs text-gray-400 mb-2 font-semibold">DENAH LANTAI 1 (1:100)</div>
      <svg viewBox="0 0 320 240" class="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="floor-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34,197,94,0.08)" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="320" height="240" fill="#0a1a0f"/>
        <rect width="320" height="240" fill="url(#floor-grid)"/>

        <!-- Outer Wall -->
        <rect x="10" y="10" width="300" height="220" rx="4" fill="#0d2a18" stroke="#22c55e" stroke-width="2.5"/>

        <!-- Rooms -->
        <!-- Ruang Tamu -->
        <rect x="10" y="10" width="150" height="100" fill="rgba(34,197,94,0.06)" stroke="#22c55e" stroke-width="1.5"/>
        <text x="85" y="55" class="room-label">RUANG TAMU</text>
        <text x="85" y="70" class="room-sublabel">5.0 × 4.5 m</text>

        <!-- Dapur -->
        <rect x="160" y="10" width="150" height="100" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="235" y="55" class="room-label">DAPUR &amp; R. MAKAN</text>
        <text x="235" y="70" class="room-sublabel">4.5 × 4.5 m</text>

        <!-- Divider -->
        <line x1="160" y1="10" x2="160" y2="230" stroke="#22c55e" stroke-width="1" stroke-dasharray="4,2"/>

        <!-- KT 1 -->
        <rect x="10" y="110" width="120" height="120" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="70" y="165" class="room-label">KAMAR TIDUR 1</text>
        <text x="70" y="180" class="room-sublabel">3.0 × 3.0 m</text>

        <!-- KT 2 -->
        <rect x="130" y="110" width="120" height="120" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="190" y="165" class="room-label">KAMAR TIDUR 2</text>
        <text x="190" y="180" class="room-sublabel">3.0 × 3.0 m</text>

        <!-- KM/WC -->
        <rect x="250" y="110" width="60" height="70" fill="rgba(236,72,153,0.06)" stroke="#ec4899" stroke-width="1.5"/>
        <text x="280" y="143" class="room-label">KM</text>
        <text x="280" y="155" class="room-sublabel">2.0×2.5</text>

        <!-- Carport/Teras -->
        <rect x="250" y="180" width="60" height="50" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="280" y="207" class="room-sublabel">TERAS</text>

        <!-- Door symbols -->
        <path d="M 10 110 Q 25 110 25 125" fill="none" stroke="#4ade80" stroke-width="1" stroke-dasharray="2,1"/>
        <path d="M 160 110 Q 175 110 175 125" fill="none" stroke="#4ade80" stroke-width="1" stroke-dasharray="2,1"/>

        <!-- Compass -->
        <g transform="translate(295,225)">
          <circle cx="0" cy="0" r="10" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
          <path d="M0,-7 L-3,3 L0,0 L3,3 Z" fill="#4ade80" opacity="0.9"/>
          <text x="0" y="-10" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="5" font-family="Plus Jakarta Sans">N</text>
        </g>

        <!-- Dimensions -->
        <text x="160" y="8" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="7" font-family="Plus Jakarta Sans">← 6.0 m →</text>
        <text x="6" y="120" fill="rgba(255,255,255,0.4)" font-size="7" font-family="Plus Jakarta Sans" transform="rotate(-90,6,120)">← 10.0 m →</text>

        <!-- Info -->
        <text x="160" y="238" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="7" font-family="Plus Jakarta Sans">LB ${lb}m² • LT ${lt}m² • Tipe 1 Lantai</text>
      </svg>
    </div>
  `;
}

function generateFloorPlan2Lantai(lb, lt) {
  return `
    <div class="p-2">
      <div class="text-center text-xs text-gray-400 mb-2 font-semibold">DENAH 2 LANTAI — Geser/Scroll untuk melihat semua</div>
      <div class="flex gap-3 overflow-x-auto no-scrollbar">
        <!-- Lantai 1 -->
        <div class="flex-shrink-0">
          <div class="text-center text-xs text-purple-400 mb-1 font-semibold">LANTAI 1</div>
          <svg viewBox="0 0 200 260" width="180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="p2-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(168,85,247,0.08)" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="200" height="260" fill="#1a0a2e"/>
            <rect width="200" height="260" fill="url(#p2-grid)"/>
            <rect x="8" y="8" width="184" height="244" rx="3" fill="#1a0d30" stroke="#a855f7" stroke-width="2"/>

            <!-- Ruang Tamu -->
            <rect x="8" y="8" width="100" height="110" fill="rgba(168,85,247,0.06)" stroke="#a855f7" stroke-width="1.2"/>
            <text x="58" y="58" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8" font-weight="600" font-family="Plus Jakarta Sans">RUANG TAMU</text>
            <text x="58" y="70" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">4.5 × 5.0 m</text>

            <!-- Dapur -->
            <rect x="108" y="8" width="84" height="110" fill="rgba(251,191,36,0.06)" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="150" y="58" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-weight="600" font-family="Plus Jakarta Sans">DAPUR</text>
            <text x="150" y="70" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">3.5×5.0m</text>

            <!-- KM -->
            <rect x="8" y="118" width="60" height="65" fill="rgba(236,72,153,0.06)" stroke="#ec4899" stroke-width="1.2"/>
            <text x="38" y="150" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-family="Plus Jakarta Sans">KM/WC</text>
            <text x="38" y="162" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">2.5×3.0m</text>

            <!-- R. Makan -->
            <rect x="68" y="118" width="124" height="65" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="130" y="150" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-family="Plus Jakarta Sans">R. MAKAN / KELUARGA</text>
            <text x="130" y="162" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">5.0×3.0m</text>

            <!-- Teras / Garasi -->
            <rect x="8" y="183" width="184" height="69" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="4,2"/>
            <text x="100" y="215" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-family="Plus Jakarta Sans">TERAS &amp; GARASI</text>
            <text x="100" y="228" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="6" font-family="Plus Jakarta Sans">9.0×3.5m</text>

            <text x="100" y="258" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="5.5" font-family="Plus Jakarta Sans">LT ${lt}m² — Tipe 2 Lantai</text>
          </svg>
        </div>

        <!-- Divider -->
        <div class="flex-shrink-0 flex items-center">
          <div class="h-48 w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"></div>
        </div>

        <!-- Lantai 2 -->
        <div class="flex-shrink-0">
          <div class="text-center text-xs text-pink-400 mb-1 font-semibold">LANTAI 2</div>
          <svg viewBox="0 0 200 260" width="180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="p2-grid-2" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(236,72,153,0.08)" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="200" height="260" fill="#2a0a1e"/>
            <rect width="200" height="260" fill="url(#p2-grid-2)"/>
            <rect x="8" y="8" width="184" height="244" rx="3" fill="#2a0d1e" stroke="#ec4899" stroke-width="2"/>

            <!-- KT Utama -->
            <rect x="8" y="8" width="120" height="120" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="68" y="62" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8" font-weight="600" font-family="Plus Jakarta Sans">KT UTAMA</text>
            <text x="68" y="75" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">5.0×5.5m</text>
            <!-- KM Utama -->
            <rect x="68" y="83" width="60" height="45" fill="rgba(236,72,153,0.06)" stroke="#ec4899" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="98" y="107" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="6" font-family="Plus Jakarta Sans">KM En-Suite</text>

            <!-- KT 2 -->
            <rect x="128" y="8" width="64" height="100" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="160" y="52" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-family="Plus Jakarta Sans">KT 2</text>
            <text x="160" y="64" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">3.0×4.5m</text>

            <!-- KT 3 -->
            <rect x="128" y="108" width="64" height="80" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" stroke-width="1.2"/>
            <text x="160" y="145" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-family="Plus Jakarta Sans">KT 3</text>
            <text x="160" y="157" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">3.0×3.5m</text>

            <!-- KM Bersama -->
            <rect x="8" y="128" width="70" height="60" fill="rgba(236,72,153,0.06)" stroke="#ec4899" stroke-width="1.2"/>
            <text x="43" y="156" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="7" font-family="Plus Jakarta Sans">KM/WC</text>
            <text x="43" y="168" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="6" font-family="Plus Jakarta Sans">Bersama</text>

            <!-- Balkon -->
            <rect x="8" y="188" width="184" height="64" fill="rgba(168,85,247,0.05)" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="4,2"/>
            <text x="100" y="218" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8" font-family="Plus Jakarta Sans">BALKON &amp; R. SANTAI</text>
            <text x="100" y="232" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="6" font-family="Plus Jakarta Sans">9.0×3.0m</text>

            <text x="100" y="258" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="5.5" font-family="Plus Jakarta Sans">LB ${lb}m² — 3 KT + 2 KM</text>
          </svg>
        </div>
      </div>
    </div>
  `;
}

function generateFloorPlanKavling(lt) {
  return `
    <div class="p-4 text-center">
      <div class="w-full h-40 bg-gradient-to-br from-gold-900/20 to-dark-700 rounded-xl border border-gold-600/20 flex items-center justify-center mb-3">
        <div class="text-center">
          <div class="text-6xl mb-2">📍</div>
          <div class="text-gold-400 font-bold font-display">Kavling Kosong</div>
          <div class="text-gray-400 text-sm mt-1">${lt} m² — Bebas Desain</div>
        </div>
      </div>
      <div class="text-gray-500 text-xs leading-relaxed">
        Tanah kavling siap bangun. Anda bebas membangun desain rumah sesuai selera.<br/>
        Konsultasikan kebutuhan desain Anda dengan tim arsitek rekanan kami.
      </div>
      <a href="https://wa.me/6281234567890?text=Saya%20ingin%20konsultasi%20desain%20untuk%20kavling%20tanah%20di%20Griya%20Asri%20Development." 
         target="_blank" rel="noopener" class="btn-whatsapp text-sm py-2 px-5 mt-3 inline-flex">
        💬 Konsultasi Desain
      </a>
    </div>
  `;
}

/* =====================================================
   10. LIGHTBOX
   ===================================================== */
function initLightbox() {
  const lightbox = document.getElementById('floorplan-lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  if (!lightbox) return;

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

function openLightbox() {
  const lightbox = document.getElementById('floorplan-lightbox');
  const sourceContainer = document.getElementById('modal-floorplan-container');
  const targetContainer = document.getElementById('lightbox-floorplan-content');

  if (!lightbox || !sourceContainer || !targetContainer) return;

  // Clone content
  targetContainer.innerHTML = sourceContainer.innerHTML;
  // Scale up for lightbox view
  targetContainer.style.maxWidth = '900px';
  targetContainer.style.margin = '0 auto';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('floorplan-lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* =====================================================
   11. SVG ZOOM CONTROLS
   ===================================================== */
function initZoomControls() {
  const svg = document.getElementById('siteplan-svg');
  const zoomIn = document.getElementById('btn-zoom-in');
  const zoomOut = document.getElementById('btn-zoom-out');
  const zoomReset = document.getElementById('btn-zoom-reset');

  if (!svg) return;

  let currentScale = 1;
  const minScale = 0.6;
  const maxScale = 2.5;
  const zoomStep = 0.2;
  let translateX = 0;
  let translateY = 0;

  function applyTransform() {
    svg.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    svg.style.transformOrigin = 'center center';
    svg.style.transition = 'transform 0.2s ease-out';
  }

  zoomIn?.addEventListener('click', () => {
    if (currentScale < maxScale) {
      currentScale = Math.min(maxScale, currentScale + zoomStep);
      applyTransform();
    }
  });

  zoomOut?.addEventListener('click', () => {
    if (currentScale > minScale) {
      currentScale = Math.max(minScale, currentScale - zoomStep);
      applyTransform();
    }
  });

  zoomReset?.addEventListener('click', () => {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  });

  // Mouse wheel zoom
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    currentScale = Math.max(minScale, Math.min(maxScale, currentScale + delta));
    applyTransform();
  }, { passive: false });

  // Touch pinch-to-zoom (simplified)
  let lastDist = 0;
  svg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist = Math.sqrt(dx*dx + dy*dy);
    }
  }, { passive: true });

  svg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const delta = (dist - lastDist) * 0.005;
      currentScale = Math.max(minScale, Math.min(maxScale, currentScale + delta));
      lastDist = dist;
      applyTransform();
    }
  }, { passive: true });
}

/* =====================================================
   12. HELPER
   ===================================================== */
function formatRupiah(num) {
  const n = typeof num === 'string' ? parseInt(num.replace(/\D/g, '')) : Math.round(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString('id-ID');
}

function formatHargaFull(harga) {
  if (!harga || harga === 0) return 'Lihat Harga';
  return 'Rp ' + formatRupiah(harga);
}

// Expose for inline HTML usage
window.openModal = openModal;
window.currentKavlingId = null;
window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};
