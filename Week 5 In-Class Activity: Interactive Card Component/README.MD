Overview
Apply today's Flexbox and JavaScript skills to create a simple interactive card component that demonstrates user agency principles.

Your Challenge
Build an interactive card that users can expand/collapse to control how much information they see.

Requirements
Technical:

Use Flexbox for card layout
Add JavaScript click functionality
Toggle between summary and full content views
User Agency:

User controls when to see more information
Clear visual feedback for interactions
Accessible to keyboard users
Starter Code
HTML:

html
<div class="card">
  <div class="card-header">
    <h3>Community Garden Project</h3>
    <button class="expand-btn" aria-label="Expand card">+</button>
  </div>
  <div class="card-content">
    <p class="summary">Join neighbors in creating a shared growing space...</p>
    <div class="details hidden">
      <p>Meeting every Saturday at 10am. Tools provided. All skill levels welcome.</p>
      <p>Contact: garden@community.org</p>
    </div>
  </div>
</div>
Step-by-Step Guide
Phase 1: Flexbox Layout (5 minutes)
Style the card header:
Use display: flex
Add justify-content: space-between
Align items center
Style the expand button:
Make it circular and clickable
Add hover states
Phase 2: JavaScript Interaction (5 minutes)
Add toggle functionality:
javascript
const expandBtn = document.querySelector('.expand-btn');
const details = document.querySelector('.details');

// Your code here
Update button text and ARIA label when toggling
Phase 3: Polish & Test (5 minutes)
Add smooth transitions with CSS
Test keyboard navigation
Success Criteria
Card header uses Flexbox layout
Button toggles detail visibility
Button text changes (+ to -)
Works with keyboard (Tab + Enter)
Quick Discussion (Final 5 minutes)
Partner Check: Trade with someone nearby and test their card.

Post-Activity Reflection
Write 1-2 paragraphs (6-10 sentences total) analyzing how this simple expandable card component relates to user agency and power dynamics in digital interfaces. In your first paragraph, examine the specific technical choices you made and how they affect user control: How does the Flexbox layout support or constrain different users' experiences? What does it mean that users must actively click to reveal information, rather than having everything displayed by default? Consider how this interaction pattern might serve different user needs—who benefits from collapsed content, and who might be disadvantaged by having to take extra actions to access information?

In your second paragraph, connect this micro-interaction to broader questions about digital power and agency. How does the simple act of hiding and revealing content reflect larger design philosophies about user autonomy versus designer control? What assumptions are embedded in the decision to make some information immediately visible and other information hidden behind a click? Think about how this pattern might scale up in your Community Resource project: What kinds of information deserve immediate visibility, and what can be tucked away? How do these seemingly small interface decisions contribute to who feels welcomed and empowered by digital spaces, and who might feel excluded or frustrated? Consider both the benefits of reducing cognitive load and the potential harm of creating additional barriers to access.