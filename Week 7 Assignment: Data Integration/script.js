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

// global network indicator (shows whenever window.fetch runs)
(() => {
  const banner = document.getElementById('net-indicator');
  if (!banner || !('fetch' in window)) return;
  const originalFetch = window.fetch.bind(window);
  let pending = 0;
  function show(){ banner.hidden = false; }
  function hide(){ banner.hidden = pending > 0 ? false : true; }
  window.fetch = (...args) => {
    pending++;
    show();
    return originalFetch(...args)
      .finally(() => { pending = Math.max(0, pending-1); hide(); });
  };
})();

// helpers
const storage = {
  get(key, fallback=null){
    try{ return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }catch{ return fallback; }
  },
  set(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch{}
  },
  remove(key){
    try{ localStorage.removeItem(key); }catch{}
  }
};
const now = () => Date.now();
const isExpired = (savedAt, ttlDays) => {
  const ttlMs = (ttlDays ?? 0) * 24*60*60*1000;
  return !savedAt || (ttlMs > 0 && (now() - savedAt) > ttlMs);
};

// volunteer form validation + persistence
(() => {
  const FORM_KEY = 'volunteerFormData';
  const PERSIST_KEY = 'persistVolForm';
  const FORM_TTL_DAYS = 14;

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
  function validEmail(v){ return VALID_EMAIL.test(String(v||'').trim()); }

  function readPersistSetting(){
    const saved = storage.get(PERSIST_KEY);
    if (typeof saved === 'boolean') persistOpt.checked = saved;
  }
  function writePersistSetting(){
    storage.set(PERSIST_KEY, !!persistOpt.checked);
  }

  function saveForm(){
    if (!persistOpt.checked) return;
    const data = { 
      savedAt: now(),
      name: nameIn?.value ?? '',
      email: emailIn?.value ?? ''
    };
    storage.set(FORM_KEY, data);
  }

  function restoreForm(){
    const data = storage.get(FORM_KEY);
    if (!data) return;
    if (isExpired(data.savedAt, FORM_TTL_DAYS)){
      storage.remove(FORM_KEY);
      return;
    }
    if (nameIn) nameIn.value = data.name ?? '';
    if (emailIn) emailIn.value = data.email ?? '';
  }

  function clearSaved(){
    storage.remove(FORM_KEY);
    if (feedback) feedback.textContent = 'Saved form data cleared.';
  }

  function clearErrors(){
    if (nameErr) nameErr.textContent = '';
    if (emailErr) emailErr.textContent = '';
  }

  readPersistSetting();
  restoreForm();

  form.addEventListener('input', saveForm);
  form.addEventListener('change', (e) => {
    if (e.target === persistOpt){
      writePersistSetting();
      if (!persistOpt.checked) clearSaved();
      else saveForm();
    }else{
      saveForm();
    }
  });

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
  });

  if (clearBtn){
    clearBtn.addEventListener('click', () => {
      form.reset();
      clearSaved();
      form.dispatchEvent(new Event('input', { bubbles:true }));
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
  function save(){
    storage.set(FILTERS_KEY, getState());
  }
  function restore(){
    const s = storage.get(FILTERS_KEY);
    if (!s) return;
    if (isExpired(s.savedAt, FILTER_TTL_DAYS)){
      storage.remove(FILTERS_KEY);
      return;
    }
    setState(s);
  }

  function apply(){
    const s = getState();
    const activeTags = new Set(
      ['delivery','volunteer','donate','partners'].filter(k => s[k])
    );
    let shown = 0;
    list.querySelectorAll('li[data-tags]').forEach(li => {
      const tags = (li.getAttribute('data-tags') || '').split(',').map(t => t.trim());
      const text = li.textContent.toLowerCase();
      const q = s.q.toLowerCase();
      const matchesText = !q || text.includes(q);
      const matchesTags = activeTags.size === 0 || tags.some(t => activeTags.has(t));
      const show = matchesText && matchesTags;
      li.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    if (feedback) feedback.textContent = `${shown} result${shown === 1 ? '' : 's'}`;
  }

  function onChange(){
    save();
    apply();
  }

  restore();
  apply();

  form.addEventListener('submit', (e) => { e.preventDefault(); onChange(); });
  form.addEventListener('input', onChange);
  document.getElementById('reset-filters')?.addEventListener('click', () => {
    setTimeout(() => { storage.remove(FILTERS_KEY); apply(); }, 0);
  });
})();