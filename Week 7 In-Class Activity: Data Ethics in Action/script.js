// menu toggle
(() => {
  const menuBtn = document.getElementById('menuButton');
  const navList = document.getElementById('navList');
  if (!menuBtn || !navList) return;

  function toggleMenu() {
    const open = !navList.classList.contains('show');
    navList.classList.toggle('show', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  menuBtn.addEventListener('click', toggleMenu);
  menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });
})();

// resource filter
(() => {
  const filterInput = document.getElementById('filter-input');
  const resourceList = document.getElementById('resource-list');
  const feedback = document.getElementById('filter-feedback');
  const boxes = [
    document.getElementById('chk-delivery'),
    document.getElementById('chk-volunteer'),
    document.getElementById('chk-donate'),
    document.getElementById('chk-partners')
  ].filter(Boolean);

  if (!resourceList || !feedback) return;

  function applyFilters() {
    const q = (filterInput && filterInput.value ? filterInput.value : '').toLowerCase();
    const required = boxes.filter(b => b.checked).map(b => b.id.replace('chk-',''));
    let shown = 0;

    resourceList.querySelectorAll('li').forEach((li) => {
      const hay = ((li.dataset.tags || '') + ' ' + li.textContent).toLowerCase();
      let ok = !q || hay.includes(q);
      if (ok && required.length) ok = required.every(t => hay.includes(t));
      li.style.display = ok ? '' : 'none';
      if (ok) shown += 1;
    });

    feedback.textContent = `${shown} result${shown === 1 ? '' : 's'}`;
  }

  if (filterInput) filterInput.addEventListener('input', applyFilters);
  boxes.forEach(b => b.addEventListener('change', applyFilters));
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) resetBtn.addEventListener('click', () => setTimeout(applyFilters, 0));

  applyFilters();
})();

// simple practice form validation
(() => {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const nameIn = document.getElementById('v-name');
  const emailIn = document.getElementById('v-email');
  const nameErr = document.getElementById('name-err');
  const emailErr = document.getElementById('email-err');
  const feedbackForm = document.getElementById('volunteer-feedback');

  const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

  form.addEventListener('submit', (e) => {
    let ok = true;
    if (nameErr) nameErr.textContent = '';
    if (emailErr) emailErr.textContent = '';
    if (feedbackForm) feedbackForm.textContent = '';

    if (!nameIn || !nameIn.value.trim()) {
      if (nameErr) nameErr.textContent = 'Enter your name';
      ok = false;
    }
    if (!emailIn || !validEmail(emailIn.value)) {
      if (emailErr) emailErr.textContent = 'Enter valid email';
      ok = false;
    }

    if (!ok) {
      e.preventDefault();
      return;
    }

    e.preventDefault(); // demo only
    if (feedbackForm) feedbackForm.textContent = 'Thanks! Use Linktree for real sign-up.';
    form.reset();
  });
})();
// ===== Option D: Form Data Persistence (volunteer form) =====
(() => {
  const FORM_KEY = 'volunteerFormData';
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const controls = Array.from(
    form.querySelectorAll('input, select, textarea')
  ).filter(el => el.id);

  // Save current form values into localStorage
  function saveForm() {
    try {
      const data = {};
      controls.forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          data[el.id] = el.checked;
        } else {
          data[el.id] = el.value;
        }
      });
      localStorage.setItem(FORM_KEY, JSON.stringify(data));
    } catch {
    }
  }

  // Restore saved values (if any)
  function restoreForm() {
    try {
      const raw = localStorage.getItem(FORM_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      controls.forEach(el => {
        if (!(el.id in data)) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = !!data[el.id];
        } else {
          el.value = data[el.id] ?? '';
        }
      });
    } catch {
    }
  }

  function clearSaved() {
    try { localStorage.removeItem(FORM_KEY); } catch {}
  }

  form.addEventListener('input', saveForm);
  form.addEventListener('change', saveForm);

  form.addEventListener('submit', () => {
    clearSaved();
  });

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'btn-secondary';
  clearBtn.textContent = 'Clear saved data';
  clearBtn.addEventListener('click', () => {
    form.reset();
    clearSaved();
    form.dispatchEvent(new Event('input', { bubbles: true }));
    const msg = document.getElementById('volunteer-feedback');
    if (msg) msg.textContent = 'Saved form data cleared.';
  });
  const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
  (submitBtn?.parentNode || form).insertBefore(clearBtn, submitBtn?.nextSibling || null);

  // Initial restore
  restoreForm();
})();