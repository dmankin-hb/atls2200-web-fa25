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

// volunteer form validation + feedback
(() => {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const nameIn = form.querySelector('#v-name');
  const emailIn = form.querySelector('#v-email');
  const nameErr = form.querySelector('#name-error');
  const emailErr = form.querySelector('#email-error');
  const feedback = form.querySelector('#volunteer-feedback');

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
  }

  function clearErrors() {
    if (nameErr) nameErr.textContent = '';
    if (emailErr) emailErr.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    clearErrors();
    let ok = true;
    if (!nameIn || !nameIn.value.trim()) {
      if (nameErr) nameErr.textContent = 'Please enter your name';
      ok = false;
    }
    if (!emailIn || !validEmail(emailIn.value)) {
      if (emailErr) emailErr.textContent = 'Enter a valid email';
      ok = false;
    }
    e.preventDefault();
    if (!ok) return;
    if (feedback) feedback.textContent = 'Thanks! Use Linktree for real sign-up.';
    form.reset();
    try { localStorage.removeItem('volunteerFormData'); } catch {}
  });
})();

// localStorage form persistence
(() => {
  const FORM_KEY = 'volunteerFormData';
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const controls = Array.from(
    form.querySelectorAll('input, select, textarea')
  ).filter(el => el.id);

  function saveForm() {
    try {
      const data = {};
      controls.forEach(el => {
        data[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
      });
      localStorage.setItem(FORM_KEY, JSON.stringify(data));
    } catch {}
  }

  function restoreForm() {
    try {
      const data = JSON.parse(localStorage.getItem(FORM_KEY) || '{}');
      controls.forEach(el => {
        if (!(el.id in data)) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!data[el.id];
        else el.value = data[el.id] ?? '';
      });
    } catch {}
  }

  function clearSaved() {
    try { localStorage.removeItem(FORM_KEY); } catch {}
  }

  form.addEventListener('input', saveForm);
  form.addEventListener('change', saveForm);

  // clear button
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

  restoreForm();
})();

// optional filter logic
(() => {
  const filterInput = document.getElementById('filter');
  const boxes = Array.from(document.querySelectorAll('[data-filter-group] input[type="checkbox"]'));
  const list = document.getElementById('resource-list');
  const counter = document.getElementById('results-count');
  if (!list) return;

  function applyFilters() {
    const q = (filterInput?.value || '').toLowerCase().trim();
    const active = new Set(boxes.filter(b => b.checked).map(b => b.value));
    let shown = 0;
    list.querySelectorAll('[data-item]').forEach(item => {
      const text = item.textContent.toLowerCase();
      const tags = (item.getAttribute('data-tags') || '').split(',').map(s => s.trim());
      const matchesText = !q || text.includes(q);
      const matchesTags = active.size === 0 || tags.some(t => active.has(t));
      const show = matchesText && matchesTags;
      item.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    if (counter) counter.textContent = `${shown} result${shown === 1 ? '' : 's'}`;
  }

  if (filterInput) filterInput.addEventListener('input', applyFilters);
  boxes.forEach(b => b.addEventListener('change', applyFilters));
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) resetBtn.addEventListener('click', () => setTimeout(applyFilters, 0));
  applyFilters();
})();