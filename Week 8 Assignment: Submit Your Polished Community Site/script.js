// ===== MENU TOGGLE =====
var menuButton = document.getElementById('menuButton');
var navList = document.getElementById('navList');

menuButton.addEventListener('click', function() {
  var isOpen = navList.classList.contains('show');
  
  if (isOpen) {
    navList.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
  } else {
    navList.classList.add('show');
    menuButton.setAttribute('aria-expanded', 'true');
    // Focus first nav item for accessibility
    var firstLink = navList.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
  }
});

// Close menu when clicking a nav link
var navLinks = navList.querySelectorAll('a');
for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', function() {
    navList.classList.remove('show');
    menuButton.setAttribute('aria-expanded', 'false');
  });
}


// ===== VISITOR COUNTER =====
function updateVisitorCount() {
  var visits = localStorage.getItem('visitCount');
  
  if (visits === null) {
    visits = 1;
  } else {
    visits = parseInt(visits) + 1;
  }
  
  localStorage.setItem('visitCount', visits);
  
  var counterElement = document.getElementById('visit-counter');
  if (counterElement) {
    counterElement.textContent = 'You have visited this site ' + visits + ' time' + (visits === 1 ? '' : 's');
  }
}

updateVisitorCount();


// ===== VOLUNTEER FORM =====
var volunteerForm = document.getElementById('volunteer-form');
var nameInput = document.getElementById('v-name');
var emailInput = document.getElementById('v-email');
var nameError = document.getElementById('name-err');
var emailError = document.getElementById('email-err');
var volunteerFeedback = document.getElementById('volunteer-feedback');
var persistCheckbox = document.getElementById('persist-opt-in');
var clearButton = document.getElementById('btn-clear');
var submissionCounter = document.getElementById('submission-counter');

var FORM_DRAFT_KEY = 'volunteerDraft';
var FORM_LOG_KEY = 'volunteerLog';
var FORM_EXPIRY_DAYS = 14;

function saveFormDraft() {
  if (!persistCheckbox.checked) {
    return;
  }
  
  var draftData = {
    name: nameInput.value,
    email: emailInput.value,
    savedAt: Date.now()
  };
  
  localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draftData));
}

function loadFormDraft() {
  var savedDraft = localStorage.getItem(FORM_DRAFT_KEY);
  
  if (!savedDraft) {
    return;
  }
  
  var draft = JSON.parse(savedDraft);
  var daysSinceSaved = (Date.now() - draft.savedAt) / (1000 * 60 * 60 * 24);
  
  if (daysSinceSaved > FORM_EXPIRY_DAYS) {
    localStorage.removeItem(FORM_DRAFT_KEY);
    return;
  }
  
  nameInput.value = draft.name || '';
  emailInput.value = draft.email || '';
}

function saveFormSubmission() {
  if (!persistCheckbox.checked) {
    return;
  }
  
  var savedLog = localStorage.getItem(FORM_LOG_KEY);
  var logArray = savedLog ? JSON.parse(savedLog) : [];
  
  var newEntry = {
    name: nameInput.value,
    email: emailInput.value,
    submittedAt: Date.now()
  };
  
  logArray.push(newEntry);
  localStorage.setItem(FORM_LOG_KEY, JSON.stringify(logArray));
  
  updateSubmissionCounter();
}

function updateSubmissionCounter() {
  var savedLog = localStorage.getItem(FORM_LOG_KEY);
  var logArray = savedLog ? JSON.parse(savedLog) : [];
  
  var validEntries = [];
  var now = Date.now();
  
  for (var i = 0; i < logArray.length; i++) {
    var daysSince = (now - logArray[i].submittedAt) / (1000 * 60 * 60 * 24);
    if (daysSince <= FORM_EXPIRY_DAYS) {
      validEntries.push(logArray[i]);
    }
  }
  
  localStorage.setItem(FORM_LOG_KEY, JSON.stringify(validEntries));
  
  if (submissionCounter) {
    if (validEntries.length > 0) {
      submissionCounter.textContent = 'Practice submissions saved: ' + validEntries.length;
      submissionCounter.style.display = 'block';
    } else {
      submissionCounter.style.display = 'none';
    }
  }
}

function validateEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm() {
  var isValid = true;
  
  nameError.textContent = '';
  emailError.textContent = '';
  
  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Please enter your name';
    isValid = false;
  }
  
  if (emailInput.value.trim() === '') {
    emailError.textContent = 'Please enter your email';
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    emailError.textContent = 'Please enter a valid email address';
    isValid = false;
  }
  
  return isValid;
}

loadFormDraft();
updateSubmissionCounter();

nameInput.addEventListener('input', saveFormDraft);
emailInput.addEventListener('input', saveFormDraft);

persistCheckbox.addEventListener('change', function() {
  if (persistCheckbox.checked) {
    saveFormDraft();
    volunteerFeedback.textContent = 'Form saving is ON';
  } else {
    localStorage.removeItem(FORM_DRAFT_KEY);
    localStorage.removeItem(FORM_LOG_KEY);
    volunteerFeedback.textContent = 'Form saving is OFF. Data cleared.';
    updateSubmissionCounter();
  }
});

volunteerForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  saveFormSubmission();
  volunteerFeedback.textContent = 'Thank you! This is a practice form. Use the Linktree link for real sign-up.';
  volunteerFeedback.setAttribute('role', 'status');
});

clearButton.addEventListener('click', function() {
  volunteerForm.reset();
  localStorage.removeItem(FORM_DRAFT_KEY);
  localStorage.removeItem(FORM_LOG_KEY);
  volunteerFeedback.textContent = 'All saved form data has been cleared.';
  updateSubmissionCounter();
});


// ===== RESOURCE FILTERS =====
var filterForm = document.getElementById('filter-form');
var filterInput = document.getElementById('filter-input');
var deliveryCheckbox = document.getElementById('chk-delivery');
var volunteerCheckbox = document.getElementById('chk-volunteer');
var donateCheckbox = document.getElementById('chk-donate');
var partnersCheckbox = document.getElementById('chk-partners');
var resourceList = document.getElementById('resource-list');
var filterFeedback = document.getElementById('filter-feedback');
var resetFiltersButton = document.getElementById('reset-filters');

var FILTERS_KEY = 'resourceFilters';
var FILTERS_EXPIRY_DAYS = 7;

function saveFilters() {
  var filterData = {
    searchText: filterInput.value,
    delivery: deliveryCheckbox.checked,
    volunteer: volunteerCheckbox.checked,
    donate: donateCheckbox.checked,
    partners: partnersCheckbox.checked,
    savedAt: Date.now()
  };
  
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filterData));
}

function loadFilters() {
  var savedFilters = localStorage.getItem(FILTERS_KEY);
  
  if (!savedFilters) {
    return;
  }
  
  var filters = JSON.parse(savedFilters);
  var daysSinceSaved = (Date.now() - filters.savedAt) / (1000 * 60 * 60 * 24);
  
  if (daysSinceSaved > FILTERS_EXPIRY_DAYS) {
    localStorage.removeItem(FILTERS_KEY);
    return;
  }
  
  filterInput.value = filters.searchText || '';
  deliveryCheckbox.checked = filters.delivery || false;
  volunteerCheckbox.checked = filters.volunteer || false;
  donateCheckbox.checked = filters.donate || false;
  partnersCheckbox.checked = filters.partners || false;
}

function applyFilters() {
  var searchText = filterInput.value.toLowerCase();
  var activeFilters = [];
  
  if (deliveryCheckbox.checked) {
    activeFilters.push('delivery');
  }
  if (volunteerCheckbox.checked) {
    activeFilters.push('volunteer');
  }
  if (donateCheckbox.checked) {
    activeFilters.push('donate');
  }
  if (partnersCheckbox.checked) {
    activeFilters.push('partners');
  }
  
  var cards = resourceList.querySelectorAll('li[data-tags]');
  var visibleCount = 0;
  
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tags = card.getAttribute('data-tags').split(',');
    var cardText = card.textContent.toLowerCase();
    
    var matchesSearch = searchText === '' || cardText.indexOf(searchText) !== -1;
    var matchesFilter = activeFilters.length === 0;
    
    if (!matchesFilter) {
      for (var j = 0; j < tags.length; j++) {
        if (activeFilters.indexOf(tags[j].trim()) !== -1) {
          matchesFilter = true;
          break;
        }
      }
    }
    
    if (matchesSearch && matchesFilter) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  }
  
  filterFeedback.textContent = 'Showing ' + visibleCount + ' result' + (visibleCount === 1 ? '' : 's');
}

loadFilters();
applyFilters();

filterInput.addEventListener('input', function() {
  saveFilters();
  applyFilters();
});

deliveryCheckbox.addEventListener('change', function() {
  saveFilters();
  applyFilters();
});

volunteerCheckbox.addEventListener('change', function() {
  saveFilters();
  applyFilters();
});

donateCheckbox.addEventListener('change', function() {
  saveFilters();
  applyFilters();
});

partnersCheckbox.addEventListener('change', function() {
  saveFilters();
  applyFilters();
});

filterForm.addEventListener('submit', function(event) {
  event.preventDefault();
  saveFilters();
  applyFilters();
});

resetFiltersButton.addEventListener('click', function() {
  localStorage.removeItem(FILTERS_KEY);
  filterInput.value = '';
  deliveryCheckbox.checked = false;
  volunteerCheckbox.checked = false;
  donateCheckbox.checked = false;
  partnersCheckbox.checked = false;
  applyFilters();
});


// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
var anchorLinks = document.querySelectorAll('a[href^="#"]');

for (var i = 0; i < anchorLinks.length; i++) {
  anchorLinks[i].addEventListener('click', function(event) {
    var href = this.getAttribute('href');
    
    if (href === '#' || href === '') {
      return;
    }
    
    var targetElement = document.querySelector(href);
    
    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
      targetElement.focus();
    }
  });
}
