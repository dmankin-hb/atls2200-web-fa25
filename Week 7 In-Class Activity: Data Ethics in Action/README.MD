Overview
In this activity, you'll apply responsive design principles and localStorage implementation to your Project 2 community resource site while critically examining the ethical implications of data collection decisions.

Part 1: Responsive Testing & Storage Implementation (18 minutes)
Step 1: Responsive Design Testing (5 minutes)
Open your Project 2 site
Access Developer Tools (F12 or right-click → Inspect)
Test at these screen sizes using the device toolbar:
Mobile: 375px wide (iPhone SE)
Tablet: 768px wide (iPad)
Desktop: 1200px wide
Bonus: Try a very narrow screen (320px)
Document your findings:

Does navigation work on mobile?
Is text readable at all sizes?
Are interactive elements accessible with touch?
Step 2: localStorage Implementation (10 minutes)
Choose ONE of these features to implement:

Option A: Theme Preference

// Save user's theme choice
function setTheme(theme) {
    localStorage.setItem('userTheme', theme);
    document.body.className = theme;
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});
Option B: Language Preference

// Save language choice
function setLanguage(lang) {
    localStorage.setItem('userLanguage', lang);
    // Update page content based on language
}

// Load on page visit
const userLang = localStorage.getItem('userLanguage') || 'en';
Option C: Accessibility Preferences

// Save accessibility settings
function saveA11ySettings(settings) {
    localStorage.setItem('a11yPrefs', JSON.stringify(settings));
    applyA11ySettings(settings);
}

// Example: Font size preference
const fontSize = localStorage.getItem('fontSize') || 'medium';
document.documentElement.style.fontSize = fontSize;
Option D: Form Data Persistence

// Save form data as user types
document.getElementById('myForm').addEventListener('input', function(e) {
    localStorage.setItem('formData', JSON.stringify({
        [e.target.name]: e.target.value
    }));
});

// Restore form data on page load
const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
Step 3: Document Your Choice (3 minutes)
Write brief answers to:

What localStorage feature did you implement and why?
What user problem does this solve?
What data are you storing exactly?
Part 2: Privacy Impact Discussion (12 minutes)
Pair Discussion (8 minutes)
Find a partner and share your localStorage implementations.

For each person's implementation, discuss:

Data Collection Analysis

What specific data are you collecting?
How sensitive is this data?
Who else might find this data valuable?
User Perspective

How would you explain this data collection to a non-technical user?
What would you include in a privacy notice?
How could users control or delete this data?
Ethical Considerations

Does the user benefit more than your site/organization?
What could go wrong if this data were accessed by others?
Are there less invasive ways to achieve the same goal?
Design Alternatives

Could you achieve the same user experience without storing data?
How might you minimize data collection while maintaining functionality?
What would happen if localStorage weren't available?
Whole Class Debrief (4 minutes)
Be prepared to share:

One insight about balancing functionality with privacy
A specific design decision you'd change after the discussion
A question about data ethics that came up in your conversation
Discussion prompts:

"What surprised you about your partner's approach to data collection?"
"How do these considerations change when data leaves the user's device?" (Preview of API work)
"What would responsible data collection look like for your community resource site?"
Deliverables
Individual Reflection (5-7 sentences)
Answer these questions based on your activity experience:

Technical: What responsive design issue did you discover that you hadn't noticed before?
Implementation: How does your localStorage feature improve the user experience?
Ethics: What ethical consideration about data collection hadn't occurred to you before today?
Community Impact: How might your data collection decisions affect different users in your target community differently?
Code Snippet
Include the localStorage code you implemented, with brief comments explaining:

What data you're storing
Why this data is necessary
How users could control this data
Resources
MDN localStorage documentation: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
Chrome DevTools Device Mode: https://developers.google.com/web/tools/chrome-devtools/device-mode
GDPR compliance basics: https://gdpr.eu/what-is-gdpr/
Troubleshooting
If localStorage isn't working:

Check if you're using http:// (localStorage requires https:// or localhost)
Verify you're not in private/incognito mode
Check browser console for errors
If responsive testing is unclear:

Focus on navigation usability first
Test with actual mobile device if possible
Ask a classmate to test your site on their phone