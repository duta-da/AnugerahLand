/**
 * GRIYA ASRI DEVELOPMENT
 * Main Application JavaScript
 * ================================
 * Handles: Navbar, Mobile Menu, Filter, Contact Form,
 *          IntersectionObserver Scroll Animations, Toast
 */

'use strict';

/* =====================================================
   1. GLOBAL STATE
   ===================================================== */
let proyekData = null;
let currentKavlingId = null;

/* =====================================================
   2. DATA LOADING
   ===================================================== */
async function loadData() {
  try {
    const response = await fetch('data/proyek-data.json');
    if (!response.ok) throw new Error('Failed to load data');
    proyekData = await response.json();
    console.log('✅ Project data loaded:', proyekData.proyek.length, 'projects');
    onDataLoaded();
  } catch (err) {
    console.warn('⚠️ Data load failed, using inline fallback:', err.message);
    proyekData = null;
  }
}

function onDataLoaded() {
  // Initialize siteplan if on detail page
  if (typeof initSiteplan === 'function') {
    const pageId = document.body.dataset.proyekId;
    if (pageId) {
      const proyek = proyekData.proyek.find(p => p.id === pageId);
      if (proyek) initSiteplan(proyek);
    }
  }
}

/* =====================================================
   3. NAVBAR
   ===================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mega menu hover (desktop)
  const menuWrapper = document.getElementById('nav-proyek-wrapper');
  const megaMenu = document.getElementById('mega-menu-proyek');
  if (menuWrapper && megaMenu) {
    menuWrapper.addEventListener('mouseenter', () => megaMenu.classList.add('show'));
    menuWrapper.addEventListener('mouseleave', () => megaMenu.classList.remove('show'));
    menuWrapper.addEventListener('focusin', () => megaMenu.classList.add('show'));
    menuWrapper.addEventListener('focusout', (e) => {
      if (!menuWrapper.contains(e.relatedTarget)) megaMenu.classList.remove('show');
    });
  }

  // Active nav link based on section
  updateActiveNavLink();
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let currentSection = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes('#' + currentSection) && currentSection) {
      link.classList.add('active');
    } else if (!href?.includes(currentSection) && !link.classList.contains('force-active')) {
      // Don't remove active from current page link
    }
  });
}

/* =====================================================
   4. MOBILE MENU (HAMBURGER)
   ===================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    isOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    if (isOpen) closeMenu(); else openMenu();
  });

  // Close on menu link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close on backdrop click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}

/* =====================================================
   5. PROJECT FILTER (Homepage)
   ===================================================== */
function initProyekFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.proyek-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with animation
      cards.forEach(card => {
        const tipe = card.dataset.tipe;
        const matches = filter === 'semua' || tipe === filter;

        if (matches) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease-out both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Card click navigation
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return; // Don't interfere with links
      const href = card.dataset.href;
      if (href) window.location.href = href;
    });
  });
}

/* =====================================================
   6. CONTACT FORM (Web3Forms Integration)
   ===================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  const submitBtn = document.getElementById('btn-submit-form');
  const submitText = document.getElementById('btn-submit-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const nama = form.querySelector('[name="nama"]')?.value?.trim();
    const hp = form.querySelector('[name="nomor_hp"]')?.value?.trim();
    const agree = form.querySelector('[name="agreement"]')?.checked;
    const produk = form.querySelector('[name="produk_minat"]')?.value;

    if (!nama || !hp) {
      showToast('⚠️ Mohon isi nama dan nomor HP terlebih dahulu.', 'warning');
      return;
    }
    if (!agree) {
      showToast('⚠️ Mohon setujui ketentuan penggunaan data.', 'warning');
      return;
    }
    if (!produk) {
      showToast('⚠️ Mohon pilih produk yang diminati.', 'warning');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Mengirim...';
    submitBtn.classList.add('opacity-75');

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        successMsg?.classList.remove('hidden');
        errorMsg?.classList.add('hidden');
        form.reset();
        showToast('✅ Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.', 'success');
        // Redirect to WA with form data
        const waMsg = encodeURIComponent(`Halo Griya Asri Development, saya ${nama} (${hp}) telah mengisi form dan tertarik dengan ${produk}. Mohon bantuannya.`);
        setTimeout(() => {
          window.open(`https://wa.me/6281234567890?text=${waMsg}`, '_blank', 'noopener');
        }, 1500);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      errorMsg?.classList.remove('hidden');
      successMsg?.classList.add('hidden');
      showToast('❌ Gagal mengirim. Hubungi kami via WhatsApp.', 'error');
      // Fallback to WA
      const waMsg = encodeURIComponent(`Halo Griya Asri Development, saya tertarik dengan properti Anda. Boleh saya mendapatkan informasi lebih lanjut?`);
      window.open(`https://wa.me/6281234567890?text=${waMsg}`, '_blank', 'noopener');
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Kirim Pesan';
      submitBtn.classList.remove('opacity-75');
    }
  });
}

/* =====================================================
   7. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ===================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay based on element's transition-delay
        const el = entry.target;
        const delay = el.style.transitionDelay || '0s';
        el.style.transitionDelay = delay;
        el.classList.add('revealed');
        observer.unobserve(el); // Only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =====================================================
   8. TOAST NOTIFICATION
   ===================================================== */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast) return;

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toastIcon.textContent = icons[type] || '✅';
  toastMsg.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* =====================================================
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   ===================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    });
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 80;
  const top = el.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* =====================================================
   10. KPR CALCULATOR (Homepage & Detail Page)
   ===================================================== */
function initKPRCalculator() {
  const hargaInput = document.getElementById('kpr-harga');
  const dpSlider = document.getElementById('kpr-dp-slider');
  const dpDisplay = document.getElementById('kpr-dp-display');
  const dpInput = document.getElementById('kpr-dp');
  const tenorSelect = document.getElementById('kpr-tenor');
  const bungaSelect = document.getElementById('kpr-bunga');
  const hitungBtn = document.getElementById('btn-hitung-kpr');

  if (!hitungBtn) return;

  // Format currency input
  if (hargaInput) {
    hargaInput.addEventListener('input', function() {
      let val = this.value.replace(/\D/g, '');
      this.value = formatRupiah(val);
    });
  }

  // DP Slider
  if (dpSlider && dpDisplay && dpInput) {
    dpSlider.addEventListener('input', function() {
      const dp = parseInt(this.value);
      dpDisplay.textContent = dp + '%';
      const harga = parseRupiah(hargaInput?.value || '168000000');
      const dpAmount = Math.round(harga * dp / 100);
      dpInput.value = 'Rp ' + formatRupiah(dpAmount);
    });
  }

  hitungBtn.addEventListener('click', calculateKPR);
  // Auto-calculate on load
  setTimeout(calculateKPR, 300);
}

function calculateKPR() {
  const hargaStr = document.getElementById('kpr-harga')?.value || '168000000';
  const dpPct = parseInt(document.getElementById('kpr-dp-slider')?.value || '1');
  const tenor = parseInt(document.getElementById('kpr-tenor')?.value || '20');
  const bunga = parseFloat(document.getElementById('kpr-bunga')?.value || '5');

  const harga = parseRupiah(hargaStr);
  if (!harga || harga <= 0) return;

  const dpAmount = Math.round(harga * dpPct / 100);
  const pokokKPR = harga - dpAmount;
  const bungaBulanan = (bunga / 100) / 12;
  const totalBulan = tenor * 12;

  // Annuity formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]
  let cicilanBulanan;
  if (bungaBulanan === 0) {
    cicilanBulanan = pokokKPR / totalBulan;
  } else {
    const factor = Math.pow(1 + bungaBulanan, totalBulan);
    cicilanBulanan = pokokKPR * (bungaBulanan * factor) / (factor - 1);
  }

  const totalBayar = Math.round(cicilanBulanan * totalBulan + dpAmount);
  const totalBunga = totalBayar - harga;

  // Update display
  setElText('result-cicilan', 'Rp ' + formatRupiah(Math.round(cicilanBulanan)));
  setElText('result-durasi', `Selama ${totalBulan} bulan (${tenor} tahun)`);
  setElText('result-harga', 'Rp ' + formatRupiah(harga));
  setElText('result-dp', 'Rp ' + formatRupiah(dpAmount) + ` (${dpPct}%)`);
  setElText('result-pokok', 'Rp ' + formatRupiah(pokokKPR));
  setElText('result-total', 'Rp ' + formatRupiah(totalBayar));

  // Update DP input
  const dpInputEl = document.getElementById('kpr-dp');
  if (dpInputEl) dpInputEl.value = 'Rp ' + formatRupiah(dpAmount);

  const dpDisplayEl = document.getElementById('kpr-dp-display');
  if (dpDisplayEl) dpDisplayEl.textContent = dpPct + '%';

  // Biaya tambahan
  calculateBiayaTambahan(harga, pokokKPR);
}

function calculateBiayaTambahan(harga, pokokKPR) {
  const njopMin = 60000000;
  const taxableBase = Math.max(0, harga - njopMin);
  const bphtb = Math.round(taxableBase * 0.05);
  const ajb = 2500000;
  const notaris = 3000000;
  const provisi = Math.round(pokokKPR * 0.01);
  const appraisal = 500000;
  const total = bphtb + ajb + notaris + provisi + appraisal;

  setElText('b-bphtb', 'Rp ' + formatRupiah(bphtb));
  setElText('b-ajb', 'Rp ' + formatRupiah(ajb));
  setElText('b-notaris', 'Rp ' + formatRupiah(notaris));
  setElText('b-provisi', 'Rp ' + formatRupiah(provisi));
  setElText('b-appraisal', 'Rp ' + formatRupiah(appraisal));
  setElText('b-total', 'Rp ' + formatRupiah(total));
}

/* =====================================================
   11. HELPER FUNCTIONS
   ===================================================== */
function formatRupiah(num) {
  const n = typeof num === 'string' ? parseInt(num.replace(/\D/g, '')) : Math.round(num);
  if (isNaN(n)) return '0';
  return n.toLocaleString('id-ID');
}

function parseRupiah(str) {
  if (!str) return 0;
  return parseInt(str.toString().replace(/\D/g, '')) || 0;
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatHarga(harga) {
  if (!harga) return '-';
  if (harga >= 1000000000) return 'Rp ' + (harga / 1000000000).toFixed(1).replace('.', ',') + ' M';
  if (harga >= 1000000) return 'Rp ' + formatRupiah(harga);
  return 'Rp ' + formatRupiah(harga);
}

/* =====================================================
   12. LAZY LOAD IMAGES (Polyfill for older browsers)
   ===================================================== */
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    return;
  }
  // Fallback with IntersectionObserver
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

/* =====================================================
   13. PROGRESS BAR ANIMATIONS
   ===================================================== */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.width = width; }, 100);
        });
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* =====================================================
   14. BACK TO TOP
   ===================================================== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'fixed bottom-24 right-6 z-40 w-10 h-10 bg-dark-700 hover:bg-dark-600 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 opacity-0 pointer-events-none';
  btn.innerHTML = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>';
  btn.setAttribute('aria-label', 'Kembali ke atas');
  btn.setAttribute('id', 'back-to-top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   15. INITIALIZE ALL
   ===================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🏠 Griya Asri Development - App Starting...');

  // Load data
  await loadData();

  // Initialize features
  initNavbar();
  initMobileMenu();
  initProyekFilter();
  initContactForm();
  initScrollReveal();
  initSmoothScroll();
  initKPRCalculator();
  initLazyLoad();
  initProgressBars();
  initBackToTop();

  console.log('✅ App initialized successfully');
});
