// nav menu
const menuBtn = document.getElementById('menuButton')
const navList = document.getElementById('navList')
if (menuBtn && navList) {
  function toggleMenu() {
    navList.classList.toggle('show')
    menuBtn.setAttribute('aria-expanded', navList.classList.contains('show'))
  }
  menuBtn.addEventListener('click', toggleMenu)
}

// filter
const filterInput = document.getElementById('filter-input')
const resourceList = document.getElementById('resource-list')
const feedback = document.getElementById('filter-feedback')
const boxes = [
  document.getElementById('chk-delivery'),
  document.getElementById('chk-volunteer'),
  document.getElementById('chk-donate'),
  document.getElementById('chk-partners')
]

function applyFilters() {
  const q = (filterInput?.value || '').toLowerCase()
  const required = boxes.filter(b => b?.checked).map(b => b.id.replace('chk-',''))
  let shown = 0
  resourceList.querySelectorAll('li').forEach(li => {
    const hay = (li.dataset.tags + li.textContent).toLowerCase()
    let ok = !q || hay.includes(q)
    if (ok && required.length) ok = required.every(t => hay.includes(t))
    li.style.display = ok ? '' : 'none'
    if (ok) shown++
  })
  feedback.textContent = `${shown} result${shown===1?'':'s'}`
}

filterInput?.addEventListener('input', applyFilters)
boxes.forEach(b => b?.addEventListener('change', applyFilters))
document.getElementById('reset-filters')?.addEventListener('click', ()=>setTimeout(applyFilters,0))

// form check
const form = document.getElementById('volunteer-form')
const nameIn = document.getElementById('v-name')
const emailIn = document.getElementById('v-email')
const nameErr = document.getElementById('name-err')
const emailErr = document.getElementById('email-err')
const feedbackForm = document.getElementById('volunteer-feedback')

function validEmail(v){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)}

form?.addEventListener('submit', e=>{
  let ok = true
  nameErr.textContent = ''
  emailErr.textContent = ''
  feedbackForm.textContent = ''
  if (!nameIn.value.trim()){ nameErr.textContent='Enter your name'; ok=false }
  if (!validEmail(emailIn.value)){ emailErr.textContent='Enter valid email'; ok=false }
  if (!ok){ e.preventDefault(); return }
  e.preventDefault()
  feedbackForm.textContent = 'Thanks! Use Linktree for real sign-up.'
  form.reset()
})

applyFilters()