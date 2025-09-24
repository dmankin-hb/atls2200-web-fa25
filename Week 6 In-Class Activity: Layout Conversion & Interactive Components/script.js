var filterButtons = document.querySelectorAll('.gallery-nav button');
var photoCards = document.querySelectorAll('.photo-card');
var countEl = document.getElementById('count');

function setActive(button) {
  filterButtons.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
}

function updateCount() {
  var visible = 0;
  photoCards.forEach(card => {
    if (card.style.display !== 'none') visible++;
  });
  countEl.textContent = visible + (visible === 1 ? " item" : " items");
}

function filterPhotos(category) {
  photoCards.forEach(card => {
    var show = category === 'all' || card.classList.contains(category);
    card.style.display = show ? 'block' : 'none';
  });
  updateCount();
}

filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    setActive(button);
    filterPhotos(button.dataset.filter);
  });
});

filterPhotos('all');