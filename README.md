# CareerPrep — Student Career Platform

A complete, responsive CareerPrep website built with **only HTML5, CSS3 and vanilla JavaScript**.
No frameworks, no npm, no build step. Navy-and-teal design with falling golden spheres, dark/light themes,
a student dashboard, resume builder, interview prep, coding practice and a rule-based AI advisor.

> **Everything is demo data.** Jobs, internships, companies, placement drives, statistics and testimonials are
> illustrative samples. No real openings, partnerships, deadlines, student endorsements or placement results are implied.

## Run it (VS Code Live Server)

1. Open the `Sem3_Team` folder in VS Code.
2. Install the **Live Server** extension (Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server** (or click **Go Live** in the status bar).
4. The site opens at `http://127.0.0.1:5500/`.

You can also just double-click `index.html`; everything works from `file://`.
(Other options: `python3 -m http.server` in this folder, then open `http://localhost:8000`.)

Google Fonts (Poppins) load from the internet; offline, the site falls back to system fonts.

## Pages

| Page | File |
|---|---|
| Home (hero, stats, 6 preview sections, feedback, FAQ) | `index.html` |
| Courses (search + category/level filters, learning modal) | `courses.html` |
| Internships (search, location, work mode, sorting, apply, save) | `internships.html` |
| Jobs (search, filters, sorting, **demo Apply Now**, save, "Saved only") | `jobs.html` |
| Companies (Explore Jobs → company-specific list) | `companies.html` |
| Placement Drives (details modal, demo registration) | `drives.html` |
| Student Feedback (sample testimonials + validated form) | `feedback.html` |
| AI Career Advisor (chat) | `advisor.html` |
| Sign In / Sign Up (demo auth) | `signin.html`, `signup.html` |
| Student Dashboard with collapsible sidebar | `dashboard.html` |

The dashboard is one page with hash routes: `#overview #applications #saved #courses #internships #jobs #companies #drives #resume #interview #coding #feedback #notifications #profile #settings #help`.

Your original page names still work: `resume.html`, `interview.html`, `aptitude.html`, `application.html`, `saved.html` and `login.html` redirect to the matching new screen.

## Project structure

```
index.html … (public pages)      dashboard.html
css/style.css                    design system, both themes, print styles
js/theme-init.js                 applies saved theme before first paint (no flash)
js/data.js                       ALL sample data (edit here to change listings)
js/core.js                       storage, icons, theme, header/footer, spheres, modal, toast, demo auth
js/views.js                      cards, search/filters, apply/register/course modals, feedback, FAQ
js/app.js                        dashboard, resume builder, interview prep, coding practice, advisor
assets/reference-design.png      the design reference you supplied
legacy/                          your ORIGINAL files, untouched (old pages, style.css, script.js, image, video)
```

## Feature summary

- **Design:** navy/teal gradient, turquoise accents, glowing bordered cards, inline-SVG logo and student illustration (no image files to break).
- **Golden spheres:** 7–12 CSS-animated spheres (radial-gradient, highlight, glow, shadow), varied size/speed/delay, gentle sway, some fade out and reappear. Fixed layer behind all content, `pointer-events: none`, and disabled (static) under `prefers-reduced-motion`.
- **Themes:** global dark/light toggle, saved in localStorage, applied to every page, modal, form and the dashboard.
- **Apply Now (jobs & internships):** modal with the selected job/company, validated fields (name, email, phone, CGPA, college, consent), confirmation, stored in localStorage and listed in **My Applications** (with withdraw). Clearly labelled as demo — nothing is sent anywhere.
- **Save Job / Save Internship:** toggles everywhere, shown in **Saved Jobs**.
- **Courses:** 8 courses with 3 real lessons each (explanations + code). Lesson completion updates progress.
- **Companies / Drives:** company modal with that company's sample jobs and internships; drive details and validated demo registration.
- **Feedback:** validated form with star rating; entries persist locally and appear on the page.
- **Dashboard:** slim collapsible sidebar (slide-out on mobile), editable profile, KPI cards (max 4 per row), learning progress, deadlines, recommendations, activity feed, notifications, settings (theme, data export, reset), help.
- **Resume Builder:** all required fields, live preview, draft autosave, **Print / Save as PDF** via `window.print()` with print CSS that outputs only the resume.
- **Interview Prep:** 8 topics (Java, Python, OOP, DBMS, DSA, Web, HR, Aptitude) with model answers and progress tracking.
- **Coding Practice:** 8 multiple-choice questions (hints, explanations, score) and 5 runnable JavaScript problems (tests run in a Web Worker with a 2.5 s timeout; hints; sample solutions; solved tracking).
- **AI Advisor:** rule-based replies for placements, skills, resume, technical/HR interviews, aptitude, DSA, web roadmap, internships, projects. It says plainly that it is **not** a real AI model.
- **Accessibility:** semantic landmarks, skip link, labelled form fields, `aria-live` regions, focus-trapped modals closing on Esc, visible focus rings.

## Frontend-only limitations (please read)

- **Demo authentication is not secure.** Accounts live only in this browser's localStorage. Passwords are never stored in plain text (PBKDF2-SHA-256 with a per-user salt where the browser supports it), but there is no server, no sessions and no real security — don't reuse a real password.
- **Applications, registrations and feedback are not sent anywhere.** They are saved locally so you can see the flow.
- **No real data.** Replace `js/data.js` content with verified listings and official application URLs when you have them; never invent URLs.
- **The AI Advisor is keyword-based.** Plug a real model in via a backend if you want true AI.
- Clearing site data (or the *Reset all demo data* button in Settings) wipes everything.
- Your original `.mp4` loader and `loading.html` were archived in `legacy/` because they belonged to the old blue design.

## Testing performed

Automated browser tests (headless Chromium via Playwright, run against a local server) covered: all pages loading with no JavaScript errors; search, filters and sorting; apply flow (validation → success → appears in My Applications); save/unsave; course lessons; company, drive and feedback flows; sign-up/sign-in including wrong-password rejection and a check that no plaintext password is stored; theme persistence across pages; all 16 dashboard routes; collapsible and mobile sidebar; resume live preview and print layout; quiz scoring; coding-problem runner (pass, fail and infinite-loop cases); advisor replies; horizontal overflow at 390 px and 820 px; and reduced-motion behaviour. Not tested: Safari/Firefox, real printers, and screen readers (only structural accessibility was checked).
