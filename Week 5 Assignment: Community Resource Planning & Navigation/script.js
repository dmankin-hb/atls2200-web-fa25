const toggleBtn = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

toggleBtn.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('show');
  toggleBtn.setAttribute('aria-expanded', isOpen);
});