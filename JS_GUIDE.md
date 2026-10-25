# JavaScript guide (simple version)

All JavaScript is plain, beginner-level code: `function` declarations, `for` loops, `if / else`,
and string building. There are no arrow functions, no `async/await`, no Promises and no libraries.

| File | What it does |
|---|---|
| `js/theme-init.js` | Applies the saved dark/light theme before the page is drawn. |
| `js/data.js` | **All sample data** (jobs, courses, drives, questions...). Edit the lists to change content. |
| `js/core.js` | Tools used everywhere: `CP.store` (save data), `CP.theme`, `CP.modal`, `CP.toast`, `CP.validate`, `CP.auth` (demo sign-in), header/footer, falling spheres. |
| `js/views.js` | Cards, search + filter lists, and the pop-ups: apply, register, course lessons, company. |
| `js/app.js` | AI advisor, Resume Builder, Interview Prep, Coding Practice and the 16 dashboard screens. |

## How a page starts
Each HTML page loads the scripts at the bottom and then calls one or two functions, for example `jobs.html`:

```js
CP.boot({ active: "jobs.html" });          // draws header, footer and spheres
CP.Views.jobs(document.getElementById("list"));   // draws the searchable job list
```

## Reading tips
- `CP.store.get("saved", {})` / `CP.store.set("saved", data)` read and write the browser's saved data.
- `CP.esc(text)` makes text safe before it goes into HTML.
- Buttons use `data-action="apply"` etc. One listener at the end of `views.js` handles all of them.
- The dashboard is one page: the part after `#` in the address (`dashboard.html#jobs`) picks the screen (see `VIEWS` in `app.js`).

## Two honest limits of the simple version
1. **Sign-in is a demo.** Passwords are salted and scrambled with a small hash function in `core.js`
   (`hashPw`) before saving, never stored as plain text. It is not strong security. A real site must
   check passwords on a server.
2. **Coding-practice code runs in the page.** If a student writes an endless loop
   (for example `while (true) {}` with no `break`), the browser tab will freeze until it is closed or reloaded.
