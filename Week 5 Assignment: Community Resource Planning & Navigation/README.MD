PART 1: Community Research & Planning (30 minutes)
Phase 1: Community Identification (10 minutes)
Your Challenge: Identify a real community that could benefit from a digital resource.

Brainstorming Categories:

Local Communities: Neighborhood groups, local nonprofits, community gardens, food banks
Interest Communities: Hobby groups, gaming communities, book clubs, maker spaces
Identity Communities: Cultural organizations, support groups, professional associations
Educational Communities: Study groups, tutoring networks, skill-sharing circles
Service Communities: Volunteer organizations, mutual aid networks, community care groups
Individual Reflection (5 minutes):

List 3 communities you're connected to or interested in
For each, write one sentence about what they do
Circle the one that interests you most for this project
Partner Discussion (5 minutes): Share your chosen community with a partner and explain:

What this community does
Why you chose them
What you already know about their needs
Phase 2: Needs Assessment Research (15 minutes)
Research Methods:

Direct Observation: What challenges do you see this community facing?
Existing Resources: What tools/websites do they currently use? What's missing?
Community Voice: Can you find forums, social media, or other places where this community discusses their needs?
Research Questions to Explore:

What information does this community need quick access to?
What tasks do community members need to accomplish online?
What barriers prevent community members from accessing existing resources?
How does this community currently communicate and share information?
What would make their lives easier or their community stronger?
Documentation (10 minutes): Create a brief research summary:

Community: [Name and brief description]
Primary Needs: [2-3 key needs you identified]
Current Gaps: [What's missing from existing resources]
Target Users: [Who would use your site? Consider different user types]
Success Metric: [How would you know your site is helpful?]
Group Share (5 minutes): In groups of 4, quickly share your community and one key need you identified. Listen for patterns or interesting approaches.

Phase 3: Resource Planning (5 minutes)
Define Your Resource: Based on your research, complete this statement: "My community resource site will help [community] by [specific function] so that they can [user goal]."

Initial Feature Planning: List 3-5 features your site might include:

Information pages (what topics?)
Interactive tools (calculators, forms, search?)
Community features (events, directory, messaging?)
Resource databases (links, documents, contacts?)
PART 2: Navigation Implementation (35 minutes)
Context Connection: Now that you know your community and their needs, you'll build a navigation system that could work for your resource site. Think about how your navigation choices will impact your community's ability to find what they need.

Phase 1: Flexbox Foundation (10 minutes)
HTML (provided):

html

<nav class="main-nav">
  <div class="nav-brand">Community Hub</div>
  <button class="nav-toggle" aria-label="Toggle navigation menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
  <ul class="nav-menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#events">Events</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

CSS Tasks:

Style the nav container (3 minutes):
Use display: flex
Add justify-content: space-between
Include responsive padding and background color
Style the nav menu (4 minutes):
Make it a flex container
Space items appropriately with gap
Style links with padding and hover states
Hide hamburger button on desktop (display: none)
Quick test (3 minutes):
Resize browser window
Test hover states
Check that hamburger is hidden on wide screens
Phase 2: Mobile Responsiveness (10 minutes)
Add media query for mobile (max-width: 768px) (5 minutes):
Hide nav menu by default (display: none)
Show hamburger button (display: block)
Position menu for toggle reveal (consider position: absolute)
Style the hamburger button (3 minutes):
Create three-line hamburger icon using the spans
Add hover/focus states for feedback
Ensure it's accessible (minimum 44px touch target)
Add show/hide classes (2 minutes):
Create .nav-menu.show class that displays the menu
Style the revealed menu (full width, proper positioning)
Phase 3: JavaScript Interactivity (10 minutes)
JavaScript Starter:

javascript

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
// Your implementation here

Add toggle functionality (6 minutes):
Add click event listener to hamburger button
Toggle .show class on nav menu
Update ARIA attributes (aria-expanded) for accessibility
Add visual feedback to hamburger (rotation/transformation)
Enhanced accessibility (4 minutes):
Add keyboard support (Enter and Space keys)
Close menu when clicking outside (optional challenge)
Ensure focus management works properly
Phase 4: Community Context Integration (5 minutes)
Customize for Your Community:

Update the brand name to reflect your community resource
Modify navigation items to match your planned site sections
Consider: Does your navigation prioritize what your community needs most?
Quick Questions:

Are your navigation labels clear to your community?
Is the most important information easily accessible?
Would your target users understand how to use this interface?
PART 3: Testing & Reflection (10 minutes)
Testing Phase (5 minutes)
Testing Checklist:

Resize your browser - Does the layout adapt smoothly?
Use keyboard only - Can you navigate without a mouse?
Test the toggle - Does it provide clear feedback?
Partner test - Ask someone else to try using it
Screen reader simulation - Turn on your screen reader or use voice-over
Critical Reflection (5 minutes)
Discussion Questions:

Agency: How does your navigation give users control over their experience?
Inclusion: Who might struggle with this interface, and how could you improve it?
Community Impact: How might different users in your chosen community (varying ages, technical skills, abilities) experience your navigation differently?
Choices: What design decisions did you make that prioritize user empowerment over developer convenience?
Documentation: Write a brief reflection connecting your navigation choices to your community research:

How does your navigation design serve your community's specific needs?
What accessibility considerations are most important for your target users?
What would you change based on your testing?
Success Criteria
Technical Success:

Navigation displays horizontally on desktop
Navigation collapses to hamburger on mobile
JavaScript toggle works smoothly with keyboard and mouse
ARIA attributes update appropriately
No console errors
User Agency Success:

Users can navigate with keyboard only
Screen reader users receive appropriate feedback
Visual feedback confirms user actions
Works across different device sizes
Menu items reflect community priorities
Research Success:

Clear identification of target community and their needs
Thoughtful connection between community research and navigation design
Consideration of diverse user needs within the community