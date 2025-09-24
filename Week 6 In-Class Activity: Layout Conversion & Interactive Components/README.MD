Part 1: Flexbox to Grid Conversion (15 minutes)
Your Task
You'll convert an existing Flexbox layout into a CSS Grid layout to see the differences in approach and capability.

Starting Code - Flexbox Layout
html
<div class="gallery-container">
  <header class="gallery-header">Photo Gallery</header>
  <nav class="gallery-nav">
    <button>All</button>
    <button>Nature</button>
    <button>Architecture</button>
  </nav>
  <main class="gallery-grid">
    <div class="photo-card">Photo 1</div>
    <div class="photo-card">Photo 2</div>
    <div class="photo-card">Photo 3</div>
    <div class="photo-card featured">Featured Photo</div>
    <div class="photo-card">Photo 5</div>
    <div class="photo-card">Photo 6</div>
  </main>
  <aside class="gallery-sidebar">Filter Options</aside>
</div>
css
/* Current Flexbox CSS */
.gallery-container { display: flex; flex-direction: column; }
.gallery-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.photo-card { flex: 1 1 300px; height: 200px; }
.featured { flex: 1 1 100%; height: 300px; }
Step-by-Step Instructions
Step 1 (5 min): Convert the main layout to Grid

Change .gallery-container to use CSS Grid
Create a grid template with areas for: header, nav, main, sidebar
Use this template:
"header header"
"nav    sidebar"
"main   sidebar"
Step 2 (5 min): Convert the photo grid

Change .gallery-grid from Flexbox to Grid
Use repeat(auto-fit, minmax(250px, 1fr)) for responsive columns
Keep the same gap
Step 3 (5 min): Position the featured photo

Make the featured photo span 2 columns using grid-column: span 2
Compare how much easier this is than the Flexbox approach
Part 2: Interactive Grid Components (15 minutes)
Your Task
Add JavaScript interactivity to your new Grid layout to create a filterable photo gallery.

Step-by-Step Instructions
Step 1 (3 min): Add data attributes to HTML Add data-category attributes to each photo card:

html
<div class="photo-card" data-category="nature">Photo 1</div>
<div class="photo-card" data-category="architecture">Photo 2</div>
<div class="photo-card" data-category="nature">Photo 3</div>
<!-- etc. -->
Step 2 (5 min): Add event listeners to filter buttons

javascript
// Get all filter buttons and photo cards
const filterButtons = document.querySelectorAll('.gallery-nav button');
const photoCards = document.querySelectorAll('.photo-card');

// Add click event to each button
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
  });
});
Step 3 (5 min): Write the filter function

javascript
function filterPhotos(category) {
  photoCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
Step 4 (2 min): Test your interaction

Click different filter buttons
Watch how CSS Grid automatically adjusts the layout as items hide/show
Notice how the responsive grid behavior is maintained
Bonus Challenges (if you finish early)
Add a smooth transition when items appear/disappear
Add an "active" state to the current filter button
Add a counter showing how many photos are currently visible
Submission Requirements
What to Submit:
Code Files (HTML, CSS, JavaScript)
Written Reflection (300-400 words)
Code Submission:
Create a folder named week6-activity-[your-last-name]
Include all working code files:
index.html (with both original Flexbox and converted Grid versions commented)
styles.css (with clear comments showing Grid conversion)
script.js (with event handling code)
Zip the folder and submit via course portal
Reflection Prompt:
Write a 300-400 word reflection addressing the following questions. Use specific examples from your code to support your analysis:

Technical Analysis (150-200 words):

Compare the process of creating layouts with Flexbox versus CSS Grid. Which felt more intuitive for this particular design challenge and why?
Analyze the responsiveness of your Grid layout. How does CSS Grid handle dynamic content changes (showing/hiding items) compared to what you observed with Flexbox?
Evaluate the JavaScript event handling implementation. What challenges did you encounter when connecting user interactions to layout changes?
Design and User Experience Considerations (150-200 words):

Assess the user experience of your filtering interaction. What visual feedback does the user receive, and how could it be improved?
Consider accessibility implications: How would a keyboard-only user or screen reader user interact with your filtering system? Identify at least two specific improvements you could make.
Reflect on the relationship between layout method choice and interactivity. How does choosing Grid versus Flexbox impact the types of interactive patterns you can easily implement?
Submission Format:

Save reflection as reflection-week6-[your-last-name].pdf
Use 12pt font, double-spaced
Include your name and date at the top
Submit both code and reflection by [due date] at 11:59 PM
Grading Criteria:
Code Functionality (40%): Working Grid conversion and JavaScript filtering
Code Quality (20%): Clear comments and organization
Reflection Depth (40%): Thoughtful analysis with specific examples from your implementation