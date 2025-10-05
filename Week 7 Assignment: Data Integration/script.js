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

// optional fetch banner (only shows if element exists)
(() => {
  const banner = document.getElementById('net-indicator');
  if (!banner || !('fetch' in window)) return;
  const originalFetch = window.fetch.bind(window);
  let pending = 0;
  const show = () => { banner.hidden = false; };
  const hide = () => { banner.hidden = pending > 0 ? false : true; };
  window.fetch = (...args) => {
    pending++; show();
    return originalFetch(...args).finally(() => { pending = Math.max(0, pending-1); hide(); });
  };
})();

// tiny storage helpers
const storage = {
  get(key, fallback=null){ try{ return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }catch{ return fallback; } },
  set(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} },
  remove(key){ try{ localStorage.removeItem(key); }catch{} }
};
const now = () => Date.now();
const days = (n) => n*24*60*60*1000;
const isExpired = (ts, ttlDays) => !ts || (ttlDays>0 && (now()-ts) > days(ttlDays));

// volunteer form: draft + log
(() => {
  const DRAFT_KEY = 'volunteerFormDraft';          // single draft for autofill
  const LOG_KEY   = 'volunteerFormData';           // array of entries (your “multiple”)
  const TTL_DAYS  = 14;

  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const nameIn = form.querySelector('#v-name');
  const emailIn = form.querySelector('#v-email');
  const nameErr = form.querySelector('#name-err');
  const emailErr = form.querySelector('#email-err');
  const feedback = form.querySelector('#volunteer-feedback');
  const persistOpt = form.querySelector('#persist-opt-in');
  const clearBtn = form.querySelector('#btn-clear');

  const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // keep comments short
  const readLog = () => Array.isArray(storage.get(LOG_KEY)) ? storage.get(LOG_KEY) : [];
  const writeLog = (arr) => storage.set(LOG_KEY, arr);

  function purgeOldLog() {
    const arr = readLog().filter(e => !isExpired(e.savedAt, TTL_DAYS));
    writeLog(arr);
  }

  function saveDraft() {
    if (!persistOpt?.checked) return;
    storage.set(DRAFT_KEY, {
      savedAt: now(),
      name: nameIn?.value ?? '',
      email: emailIn?.value ?? ''
    });
  }

  function restoreDraft() {
    const d = storage.get(DRAFT_KEY);
    if (!d) return;
    if (isExpired(d.savedAt, TTL_DAYS)) { storage.remove(DRAFT_KEY); return; }
    if (nameIn) nameIn.value = d.name ?? '';
    if (emailIn) emailIn.value = d.email ?? '';
  }

  function appendLogEntry() {
    if (!persistOpt?.checked) return;
    const arr = readLog();
    arr.push({
      savedAt: now(),
      name: nameIn?.value ?? '',
      email: emailIn?.value ?? ''
    });
    writeLog(arr);
  }

  function clearErrors(){ if (nameErr) nameErr.textContent = ''; if (emailErr) emailErr.textContent = ''; }
  function validate() {
    let ok = true;
    if (!nameIn?.value.trim()) { if (nameErr) nameErr.textContent = 'Please enter your name'; ok = false; }
    if (!emailIn?.value.trim() || !VALID_EMAIL.test(emailIn.value)) { if (emailErr) emailErr.textContent = 'Enter a valid email'; ok = false; }
    return ok;
  }

  // init
  purgeOldLog();
  restoreDraft();

  // live save draft
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', (e) => {
    if (e.target === persistOpt) {
      if (!persistOpt.checked) { storage.remove(DRAFT_KEY); storage.remove(LOG_KEY); if (feedback) feedback.textContent = 'Saving is off. Data cleared.'; }
      else { saveDraft(); if (feedback) feedback.textContent = 'Saving is on.'; }
    } else {
      saveDraft();
    }
  });

  // submit -> validate + add to log + keep draft
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;
    appendLogEntry();     // this is the “multiple entries” part
    saveDraft();          // keep latest for autofill
    if (feedback) feedback.textContent = 'Thanks! Use Linktree for real sign-up.';
  });

  // clear both
  if (clearBtn){
    clearBtn.addEventListener('click', () => {
      form.reset();
      storage.remove(DRAFT_KEY);
      storage.remove(LOG_KEY);
      if (feedback) feedback.textContent = 'Saved form data cleared.';
    });
  }
})();

// resource filters + persistence
(() => {
  const FILTERS_KEY = 'resourceFilters';
  const FILTER_TTL_DAYS = 7;

  const form = document.getElementById('filter-form');
  const qIn = document.getElementById('filter-input');
  const chkDelivery = document.getElementById('chk-delivery');
  const chkVolunteer = document.getElementById('chk-volunteer');
  const chkDonate = document.getElementById('chk-donate');
  const chkPartners = document.getElementById('chk-partners');
  const list = document.getElementById('resource-list');
  const feedback = document.getElementById('filter-feedback');
  if (!form || !list) return;

  function getState(){
    return {
      q: (qIn?.value ?? '').trim(),
      delivery: !!chkDelivery?.checked,
      volunteer: !!chkVolunteer?.checked,
      donate: !!chkDonate?.checked,
      partners: !!chkPartners?.checked,
      savedAt: now()
    };
  }
  function setState(s){
    if (qIn) qIn.value = s.q ?? '';
    if (chkDelivery) chkDelivery.checked = !!s.delivery;
    if (chkVolunteer) chkVolunteer.checked = !!s.volunteer;
    if (chkDonate) chkDonate.checked = !!s.donate;
    if (chkPartners) chkPartners.checked = !!s.partners;
  }
  function save(){ storage.set(FILTERS_KEY, getState()); }
  function restore(){
    const s = storage.get(FILTERS_KEY);
    if (!s) return;
    if (isExpired(s.savedAt, FILTER_TTL_DAYS)){ storage.remove(FILTERS_KEY); return; }
    setState(s);
  }

  function apply(){
    const s = getState();
    const active = new Set(['delivery','volunteer','donate','partners'].filter(k => s[k]));
    let shown = 0;
    list.querySelectorAll('li[data-tags]').forEach(li => {
      const tags = (li.getAttribute('data-tags') || '').split(',').map(t => t.trim());
      const text = li.textContent.toLowerCase();
      const q = s.q.toLowerCase();
      const okText = !q || text.includes(q);
      const okTags = active.size === 0 || tags.some(t => active.has(t));
      const show = okText && okTags;
      li.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    if (feedback) feedback.textContent = `${shown} result${shown === 1 ? '' : 's'}`;
  }

  restore();
  apply();

  form.addEventListener('submit', (e) => { e.preventDefault(); save(); apply(); });
  form.addEventListener('input', () => { save(); apply(); });
  document.getElementById('reset-filters')?.addEventListener('click', () => {
    setTimeout(() => { storage.remove(FILTERS_KEY); apply(); }, 0);
  });
})();