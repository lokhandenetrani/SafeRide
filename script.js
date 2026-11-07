/**
 * SafeRide — Smart Helmet Safety Add-On
 * Vanilla JavaScript: State Machine Simulator, Audio Synthesizer, Form Validation,
 * LocalStorage Pilot Registrations, Dark/Light Mode & Responsive Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgressAndNav();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initAnimatedCounters();
  initSimulator();
  initFaqAccordion();
  initPilotForm();
  initAdminModal();
  initBackToTop();
});

/* ==========================================================================
   1. THEME TOGGLER (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('saferide_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme ? storedTheme : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonAria(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('saferide_theme', nextTheme);
      updateThemeButtonAria(nextTheme);
    });
  }
}

function updateThemeButtonAria(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ==========================================================================
   2. SCROLL PROGRESS BAR & STICKY NAVBAR ACTIVE LINKS
   ========================================================================== */
function initScrollProgressAndNav() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    if (header) {
      if (winScroll > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('hamburger-icon-open');
  const iconClose = document.getElementById('hamburger-icon-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu .btn');

  if (!hamburgerBtn || !mobileMenu) return;

  function toggleMenu(open) {
    const shouldOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
    if (shouldOpen) {
      mobileMenu.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      if (iconOpen) iconOpen.style.display = 'none';
      if (iconClose) iconClose.style.display = 'block';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      if (iconOpen) iconOpen.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   4. SMOOTH SCROLLING FOR ANCHOR LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const statSection = document.getElementById('problem');
  if (!statSection) return;

  let animated = false;

  const countUp = (el, target, isDecimal, suffix) => {
    let start = 0;
    const duration = 1600;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const current = target * (1 - Math.pow(1 - progress, 2));

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.round(current).toLocaleString('en-IN') + suffix;
      }

      if (frame >= totalFrames) {
        clearInterval(counter);
        if (isDecimal) {
          el.textContent = target.toFixed(1) + suffix;
        } else {
          el.textContent = target.toLocaleString('en-IN') + suffix;
        }
      }
    }, frameRate);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;

        const stat1 = document.getElementById('stat-counter-1');
        const stat2 = document.getElementById('stat-counter-2');
        const stat3 = document.getElementById('stat-counter-3');

        if (stat1) countUp(stat1, 46.2, true, '%');
        if (stat2) countUp(stat2, 54122, false, '');
        if (stat3) countUp(stat3, 10, false, 's');
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statSection);
}

/* ==========================================================================
   7. INTERACTIVE STATE MACHINE & SOS SIMULATOR
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function playTone(freq, type = 'sine', duration = 0.15) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio context not allowed or not supported; ignore gracefully
  }
}

function initSimulator() {
  const btnNormal = document.getElementById('sim-btn-normal');
  const btnImpact = document.getElementById('sim-btn-impact');
  const btnCancel = document.getElementById('sim-btn-cancel');
  const statusPill = document.getElementById('sim-status-pill');
  const logContent = document.getElementById('sim-log-content');
  const countdownBar = document.getElementById('sim-countdown-bar');
  const soundToggleBtn = document.getElementById('sim-sound-toggle');
  const actionBanner = document.getElementById('sim-action-banner');

  if (!btnNormal || !btnImpact || !btnCancel || !logContent) return;

  let timer = null;
  let remainingSeconds = 10;
  const TOTAL_WINDOW = 10;

  // Sound toggle button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('on', soundEnabled);
      soundToggleBtn.setAttribute('aria-pressed', soundEnabled);
      soundToggleBtn.querySelector('.sound-label').textContent = soundEnabled ? 'Audio: ON' : 'Audio: MUTE';
    });
  }

  function clearActiveTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (countdownBar) {
      countdownBar.style.width = '0%';
    }
  }

  function setActiveButton(btn) {
    [btnNormal, btnImpact, btnCancel].forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  // State 1: Normal Cruising
  btnNormal.addEventListener('click', () => {
    clearActiveTimer();
    setActiveButton(btnNormal);
    playTone(520, 'sine', 0.12);

    statusPill.className = 'sim-status-pill armed';
    statusPill.textContent = 'SYSTEM: ARMED & MONITORING';

    logContent.innerHTML = `
      <div style="color: #34D399;">[0.00s] Chin-Strap Interlock: CLOSED & LATCHED (Resistance: 0.2Ω)</div>
      <div>[0.02s] MPU-6050 Accelerometer: X=0.03g, Y=0.98g, Z=0.10g (Stable riding telemetry)</div>
      <div style="color: #94A3B8;">[0.05s] FreeRTOS Task: Sampling rate 50Hz. No abnormal deceleration spikes.</div>
    `;

    if (actionBanner) {
      actionBanner.innerHTML = `
        <span>Status: Normal cruising mode. Strap verified.</span>
        <span style="color: #34D399;">LED: Solid Orange</span>
      `;
    }
  });

  // State 2: High-G Crash Impact Simulation (>4.5G)
  btnImpact.addEventListener('click', () => {
    clearActiveTimer();
    setActiveButton(btnImpact);

    remainingSeconds = TOTAL_WINDOW;
    statusPill.className = 'sim-status-pill impact';
    statusPill.textContent = `ALERT: CRASH DETECTED (${remainingSeconds}s CANCEL WINDOW)`;

    playTone(880, 'square', 0.25);

    const updateCountdownView = () => {
      const percentage = (remainingSeconds / TOTAL_WINDOW) * 100;
      if (countdownBar) countdownBar.style.width = `${percentage}%`;

      logContent.innerHTML = `
        <div style="color: #EF4444; font-weight: 700;">[!] THRESHOLD EXCEEDED: Acceleration shock 5.4G on Z-axis!</div>
        <div style="color: #F87171;">[!] Rotational gyro delta: 280 deg/s. Possible collision detected.</div>
        <div style="color: #FBBF24; font-weight: 600;">[!] 10-Second Grace Cancellation Active: ${remainingSeconds}s remaining</div>
        <div style="color: #94A3B8;">→ If unhurt, tap "3. Rider Press Cancel Button" to abort SMS dispatch.</div>
      `;

      if (actionBanner) {
        actionBanner.innerHTML = `
          <span style="color: #FBBF24; font-weight: 600;">Piezo buzzer pulsing (85dB). Grace timer: ${remainingSeconds}s</span>
          <span style="color: #EF4444; font-weight: 700;">● WARNING ACTIVE</span>
        `;
      }
    };

    updateCountdownView();

    timer = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds > 0) {
        playTone(750 + (10 - remainingSeconds) * 40, 'triangle', 0.15);
        statusPill.textContent = `ALERT: CRASH DETECTED (${remainingSeconds}s CANCEL WINDOW)`;
        updateCountdownView();
      } else {
        clearActiveTimer();
        // Time expired -> SOS Dispatched
        playTone(950, 'sawtooth', 0.4);
        statusPill.className = 'sim-status-pill sent';
        statusPill.textContent = 'DISPATCHED: EMERGENCY SOS TRANSMITTED';

        logContent.innerHTML = `
          <div style="color: #EF4444; font-weight: 700;">[0.00s] Cancellation grace elapsed without rider intervention.</div>
          <div style="color: #FF944D;">[+0.2s] GPS Fix Acquired: 12.9716° N, 77.5946° E (Bengaluru, KA)</div>
          <div style="color: #FF944D;">[+0.8s] GSM SIM800L / Mobile BLE: Transmitting emergency packet...</div>
          <div style="color: #34D399; font-weight: 600; padding: 0.4rem 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.25);">
            ✓ SMS Sent to Emergency Contacts & National Helpline (112):<br>
            "EMERGENCY ALERT: SafeRide rider collision detected at 12.9716, 77.5946. Maps: https://maps.google.com/?q=12.9716,77.5946"
          </div>
        `;

        if (actionBanner) {
          actionBanner.innerHTML = `
            <span style="color: #34D399; font-weight: 600;">Emergency SMS & GPS Coordinates Sent.</span>
            <span style="color: #FF944D;">Audio: Continuous Beacon</span>
          `;
        }
      }
    }, 1000);
  });

  // State 3: Cancel Button Pressed (False Alarm Aborted)
  btnCancel.addEventListener('click', () => {
    clearActiveTimer();
    setActiveButton(btnCancel);
    playTone(440, 'sine', 0.18);

    statusPill.className = 'sim-status-pill aborted';
    statusPill.textContent = 'ABORTED: FALSE ALARM CANCELLED';

    logContent.innerHTML = `
      <div style="color: #FBBF24;">[+] Physical Cancel Push-Button triggered on GPIO 25.</div>
      <div style="color: #34D399; font-weight: 600;">✓ Event dismissed by rider within 10-second grace window.</div>
      <div style="color: #94A3B8;">[+] No emergency contacts notified. Sensors recalibrating to armed baseline.</div>
    `;

    if (actionBanner) {
      actionBanner.innerHTML = `
        <span style="color: #34D399;">Alert safely dismissed. No SMS transmitted.</span>
        <span style="color: #94A3B8;">Audio: Silent</span>
      `;
    }
  });
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optional: close other open items for single-open experience
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ==========================================================================
   9. PILOT REGISTRATION FORM & LOCALSTORAGE
   ========================================================================== */
const PILOT_STORAGE_KEY = 'saferide_pilot_applications';

function getStoredApplications() {
  try {
    const raw = localStorage.getItem(PILOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse stored pilot applications', e);
    return [];
  }
}

function saveApplication(appData) {
  try {
    const list = getStoredApplications();
    list.unshift(appData);
    localStorage.setItem(PILOT_STORAGE_KEY, JSON.stringify(list));
    updateSubmissionsCounter();
  } catch (e) {
    console.error('Failed to save pilot application', e);
  }
}

function updateSubmissionsCounter() {
  const counterEl = document.getElementById('admin-submissions-count');
  if (counterEl) {
    const list = getStoredApplications();
    counterEl.textContent = `${list.length} Pilot Sign-up${list.length === 1 ? '' : 's'} Logged`;
  }
}

function initPilotForm() {
  const form = document.getElementById('pilot-form');
  const successBanner = document.getElementById('pilot-form-success');
  const resetBtn = document.getElementById('pilot-form-reset-btn');

  if (!form) return;
  updateSubmissionsCounter();

  // Validate on blur
  const inputs = form.querySelectorAll('input[required], select[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    const consentBox = document.getElementById('pilot-consent');
    if (consentBox && !consentBox.checked) {
      isValid = false;
      consentBox.focus();
      const consentErr = document.getElementById('consent-error');
      if (consentErr) consentErr.style.display = 'block';
    } else {
      const consentErr = document.getElementById('consent-error');
      if (consentErr) consentErr.style.display = 'none';
    }

    if (!isValid) return;

    // Gather data
    const formData = new FormData(form);
    const newSubmission = {
      id: 'SR-' + Date.now().toString(36).toUpperCase(),
      fullname: (formData.get('fullname') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      ridertype: (formData.get('ridertype') || '').toString(),
      city: (formData.get('city') || '').toString().trim(),
      message: (formData.get('message') || '').toString().trim(),
      submittedAt: new Date().toISOString()
    };

    saveApplication(newSubmission);

    // Show success banner
    form.style.display = 'none';
    if (successBanner) {
      successBanner.classList.add('visible');
      const namePlaceholder = document.getElementById('success-user-name');
      if (namePlaceholder) {
        namePlaceholder.textContent = newSubmission.fullname;
      }
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successBanner) successBanner.classList.remove('visible');
    });
  }
}

function validateField(input) {
  const val = input.value.trim();
  let valid = true;

  if (input.name === 'fullname') {
    valid = val.length >= 2;
  } else if (input.name === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    valid = emailRegex.test(val);
  } else if (input.name === 'phone') {
    // Validate Indian phone number (10 digits, optional +91 or 0 prefix)
    const phoneClean = val.replace(/[\s\-\+]/g, '');
    valid = phoneClean.length >= 10 && phoneClean.length <= 13 && /^\d+$/.test(phoneClean);
  } else if (input.name === 'ridertype') {
    valid = val !== '';
  } else if (input.name === 'city') {
    valid = val.length >= 2;
  }

  if (valid) {
    input.classList.remove('error');
    const errSpan = input.parentElement.querySelector('.error-msg');
    if (errSpan) errSpan.style.display = 'none';
  } else {
    input.classList.add('error');
    const errSpan = input.parentElement.querySelector('.error-msg');
    if (errSpan) errSpan.style.display = 'block';
  }

  return valid;
}

/* ==========================================================================
   10. ADMIN MODAL (VIEW REGISTERED PILOTS & EXPORT)
   ========================================================================== */
function initAdminModal() {
  const modal = document.getElementById('admin-modal');
  const openBtn = document.getElementById('open-admin-modal-btn');
  const closeBtn = document.getElementById('close-admin-modal-btn');
  const clearBtn = document.getElementById('clear-submissions-btn');
  const exportBtn = document.getElementById('export-submissions-btn');
  const listContainer = document.getElementById('admin-submissions-list');

  if (!modal || !openBtn) return;

  function renderList() {
    const apps = getStoredApplications();
    if (!listContainer) return;

    if (apps.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--color-text-muted);">
          <p style="margin-bottom: 0.5rem; font-weight: 600;">No pilot sign-ups stored yet.</p>
          <p style="font-size: 0.8rem;">Fill out the "Join Pilot" form on the page to test registration.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = apps.map((app, index) => {
      const dateStr = new Date(app.submittedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      return `
        <div style="background-color: var(--color-bg-alt); border: 1px solid var(--color-card-border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="color: var(--color-text-heading); font-size: 0.95rem;">${app.fullname}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-accent); font-weight: 600;">#${app.id}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--color-text); display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 0.5rem;">
            <div><strong>Email:</strong> ${app.email}</div>
            <div><strong>Phone:</strong> ${app.phone}</div>
            <div><strong>Rider:</strong> ${app.ridertype}</div>
            <div><strong>City:</strong> ${app.city}</div>
          </div>
          ${app.message ? `<div style="font-size: 0.78rem; color: var(--color-text-muted); background: var(--color-card); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--color-card-border); margin-bottom: 0.4rem;"><em>"${app.message}"</em></div>` : ''}
          <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--color-text-subtle); text-align: right;">
            Registered: ${dateStr}
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleModal(open) {
    if (open) {
      renderList();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  openBtn.addEventListener('click', () => toggleModal(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      toggleModal(false);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear stored pilot demo submissions from localStorage?')) {
        localStorage.removeItem(PILOT_STORAGE_KEY);
        renderList();
        updateSubmissionsCounter();
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const apps = getStoredApplications();
      if (apps.length === 0) {
        alert('No submissions to export yet.');
        return;
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `saferide_pilot_applications_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
