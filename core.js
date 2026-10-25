/* ==========================================================
   CareerPrep core  (plain JavaScript, no libraries)

   This file holds the small tools used by every page:
   storage, icons, theme, header/footer, falling spheres,
   pop-up windows (modal), toast messages and demo sign-in.

   Reading tip: everything is attached to one object called CP,
   for example CP.store.get(...) or CP.toast(...).
   The (function () { ... })(); wrapper just keeps our
   variables private to this file.
   ========================================================== */
(function () {
  "use strict";

  var CP = window.CP;
  if (!CP) {
    CP = {};
    window.CP = CP;
  }

  /* ---------- storage (saves data in the browser) ---------- */
  // If localStorage is blocked, we fall back to this plain object.
  var memory = {};

  CP.store = {
    // Read a saved value. If nothing is saved, return the fallback.
    get: function (key, fallback) {
      try {
        var text = localStorage.getItem("cp_" + key);
        if (text === null) {
          return fallback;
        }
        return JSON.parse(text);
      } catch (e) {
        if (key in memory) {
          return memory[key];
        }
        return fallback;
      }
    },

    // Save a value (numbers, text, lists and objects all work).
    set: function (key, value) {
      memory[key] = value;
      try {
        localStorage.setItem("cp_" + key, JSON.stringify(value));
      } catch (e) {
        // storage is not available - the memory copy is still used
      }
    },

    // Delete a saved value.
    remove: function (key) {
      delete memory[key];
      try {
        localStorage.removeItem("cp_" + key);
      } catch (e) {
        // ignore
      }
    }
  };

  /* ---------- small helper functions ---------- */

  // Make text safe to put inside HTML (stops "<script>" tricks).
  CP.esc = function (s) {
    if (s === null || s === undefined) {
      s = "";
    }
    s = String(s);
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/"/g, "&quot;");
    s = s.replace(/'/g, "&#39;");
    return s;
  };

  // "Priya Sharma" -> "PS"
  CP.initials = function (name) {
    var words = String(name || "?").trim().split(/\s+/);
    var letters = "";
    for (var i = 0; i < words.length && i < 2; i++) {
      letters += words[i].charAt(0);
    }
    if (letters === "") {
      letters = "?";
    }
    return letters.toUpperCase();
  };

  // Find one element / many elements on the page.
  CP.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  CP.$$ = function (selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  };

  // A unique id made from the time and a random number.
  CP.uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  // Show a date like "12 Nov 2026".
  CP.fmtDate = function (d) {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // The date that is n days from today (n can be negative).
  CP.dayOffset = function (n) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d;
  };

  // Is this a valid-looking email address?
  CP.emailOk = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
  };

  // Five stars, n of them filled.
  CP.stars = function (n) {
    var html = '<span class="stars" role="img" aria-label="' + n + ' out of 5 stars">';
    for (var i = 1; i <= 5; i++) {
      if (i <= n) {
        html += '<span class="">★</span>';
      } else {
        html += '<span class="off">★</span>';
      }
    }
    html += "</span>";
    return html;
  };

  /* ---------- icons (little SVG pictures) ---------- */
  var P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
    building: '<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 9h6v12h-6M8 7h2M8 11h2M8 15h2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 14h.01M15 14h.01M9 17h6"/><circle cx="12" cy="3.5" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    bell: '<path d="M6 9a6 6 0 0112 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 004 0"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14 3h-4l-.4 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2L10 21h4l.4-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.2-.8.2-1.2z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.6-2.5 2-2.5 4M12 17h.01"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    msg: '<path d="M4 5h16v11H9l-5 4z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.8M6.6 6.6A17 17 0 002 12s4 7 10 7a9.700 9.700 0 004-.9"/>',
    logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
    sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.500 3-5 7-5s7 1.500 7 5M16 4.500a3.500 3.500 0 010 7M22 20c0-2.500-1.500-4-4-4.600"/>',
    pin: '<path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.500"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.500 14L7 22l5-3 5 3-1.500-8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.500 3 3 6 3s6-1.500 6-3v-5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'
  };

  // Build an icon: CP.icon("home") gives an <svg> picture.
  CP.icon = function (name, cls) {
    var path = P[name] || "";
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  };

  /* ---------- logo (drawn with SVG, so there is no image file to break) ---------- */
  CP.logoSVG = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#14b8a6"/></linearGradient></defs>' +
    '<path d="M24 3l17 9.800v19.400L24 42 7 32.200V12.800z" fill="url(#lg1)"/>' +
    '<path d="M24 3l17 9.800L24 22.600 7 12.800z" fill="#fff" opacity=".28"/>' +
    '<path d="M24 22.600V42M7 12.800l17 9.800 17-9.800" stroke="#04141f" stroke-opacity=".35" stroke-width="1.500" fill="none"/>' +
    '<path d="M13 15.500l11 6.300 11-6.300-11-6.300z" fill="#04141f" opacity=".55"/><path d="M33 17.800v6" stroke="#f6c453" stroke-width="1.600" stroke-linecap="round"/></svg>';
  CP.logo = function (href) {
    return '<a class="logo" href="' + (href || "index.html") + '" aria-label="CareerPrep home">' +
      CP.logoSVG + '<span class="word">Career<b>Prep</b></span></a>';
  };

  /* ---------- theme (dark / light) ---------- */
  CP.theme = {
    // Which theme is on right now? "dark" or "light"
    get: function () {
      return document.documentElement.getAttribute("data-theme") || "dark";
    },

    // Switch to a theme and remember the choice.
    set: function (t) {
      document.documentElement.setAttribute("data-theme", t);
      CP.store.set("theme", t);
      CP.theme.sync();
    },

    // Dark -> light, light -> dark.
    toggle: function () {
      if (CP.theme.get() === "dark") {
        CP.theme.set("light");
      } else {
        CP.theme.set("dark");
      }
    },

    // Update the icon/text on every theme button.
    sync: function () {
      var isDark = CP.theme.get() === "dark";
      var buttons = CP.$$("[data-theme-toggle]");
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        var html = CP.icon(isDark ? "sun" : "moon");
        if (b.dataset.themeToggle === "label") {
          html += '<span class="label">' + (isDark ? "Light mode" : "Dark mode") + "</span>";
        }
        b.innerHTML = html;
        b.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        b.title = isDark ? "Switch to light mode" : "Switch to dark mode";
      }
    }
  };

  // Any click on a theme button toggles the theme.
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-theme-toggle]")) {
      CP.theme.toggle();
    }
  });

  /* ---------- toast (small message at the bottom) ---------- */
  CP.toast = function (msg, type) {
    var area = CP.$(".toast-area");
    if (!area) {
      area = document.createElement("div");
      area.className = "toast-area";
      area.setAttribute("role", "status");
      area.setAttribute("aria-live", "polite");
      document.body.appendChild(area);
    }
    var t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.textContent = msg;
    area.appendChild(t);

    // fade out after 3.2 seconds, then remove
    setTimeout(function () {
      t.style.opacity = "0";
      t.style.transition = "opacity .3s";
      setTimeout(function () {
        t.remove();
      }, 320);
    }, 3200);
  };

  /* ---------- modal (pop-up window) ---------- */
  var lastFocus = null;   // the button that opened the modal
  var modalRoot = null;   // the modal element while it is open

  CP.modal = {
    // Open a modal. opts = { title, sub, body, wide, onOpen }
    open: function (opts) {
      CP.modal.close(true);
      lastFocus = document.activeElement;

      modalRoot = document.createElement("div");
      modalRoot.className = "modal-backdrop open";

      var html = '<div class="modal ' + (opts.wide ? "wide" : "") + '" role="dialog" aria-modal="true" aria-labelledby="modalTitle">';
      html += '<button class="icon-btn modal-close" type="button" aria-label="Close dialog" data-modal-close>' + CP.icon("close") + "</button>";
      html += '<h2 id="modalTitle">' + CP.esc(opts.title || "") + "</h2>";
      if (opts.sub) {
        html += '<p class="modal-sub">' + CP.esc(opts.sub) + "</p>";
      }
      html += '<div class="modal-body"></div></div>';
      modalRoot.innerHTML = html;

      var body = CP.$(".modal-body", modalRoot);
      if (typeof opts.body === "string") {
        body.innerHTML = opts.body;
      } else if (opts.body) {
        body.appendChild(opts.body);
      }

      document.body.appendChild(modalRoot);
      document.body.classList.add("no-scroll");

      // Click on the dark background closes the modal
      modalRoot.addEventListener("mousedown", function (e) {
        if (e.target === modalRoot) {
          CP.modal.close();
        }
      });
      // Any button with data-modal-close closes it too
      modalRoot.addEventListener("click", function (e) {
        if (e.target.closest("[data-modal-close]")) {
          CP.modal.close();
        }
      });

      // Put the cursor in the first field
      var first = CP.$("input, select, textarea", modalRoot) || CP.$("[data-modal-close]", modalRoot);
      setTimeout(function () {
        if (first) {
          first.focus();
        }
      }, 30);

      if (opts.onOpen) {
        opts.onOpen(modalRoot);
      }
      return modalRoot;
    },

    // Close the modal (silent = true skips returning focus).
    close: function (silent) {
      if (!modalRoot) {
        return;
      }
      modalRoot.remove();
      modalRoot = null;
      document.body.classList.remove("no-scroll");
      if (!silent && lastFocus && lastFocus.focus) {
        try {
          lastFocus.focus();
        } catch (e) {
          // ignore
        }
      }
    },

    // The modal element (or null when closed).
    el: function () {
      return modalRoot;
    }
  };

  document.addEventListener("keydown", function (e) {
    // Esc closes the modal
    if (e.key === "Escape") {
      CP.modal.close();
    }

    // Tab key stays inside the modal while it is open
    if (e.key === "Tab" && modalRoot) {
      var all = CP.$$('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])', modalRoot);
      var usable = [];
      for (var i = 0; i < all.length; i++) {
        if (!all[i].disabled && all[i].offsetParent !== null) {
          usable.push(all[i]);
        }
      }
      if (usable.length === 0) {
        return;
      }
      var firstEl = usable[0];
      var lastEl = usable[usable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });

  /* ---------- form validation ----------
     rules look like:  { email: { required: true, email: true } }
     Error text is written into <span data-err="email"> in the form. */
  CP.validate = function (form, rules) {
    var allGood = true;
    var firstBad = null;

    for (var name in rules) {
      var el = form.elements[name];
      if (!el) {
        continue;
      }
      var val = (el.value || "").trim();
      var rule = rules[name];
      var msg = "";

      if (rule.required && !val) {
        msg = rule.msg || "This field is required.";
      } else if (val && rule.email && !CP.emailOk(val)) {
        msg = "Enter a valid email address.";
      } else if (val && rule.min && val.length < rule.min) {
        msg = "Please enter at least " + rule.min + " characters.";
      } else if (val && rule.phone && !/^[+()\d\s-]{7,16}$/.test(val)) {
        msg = "Enter a valid phone number.";
      } else if (rule.custom) {
        msg = rule.custom(val) || "";
      }

      var errBox = form.querySelector('[data-err="' + name + '"]');
      if (errBox) {
        errBox.textContent = msg;
      }
      if (el.classList) {
        el.classList.toggle("invalid", msg !== "");
      }
      if (el.setAttribute) {
        el.setAttribute("aria-invalid", msg ? "true" : "false");
      }
      if (msg) {
        allGood = false;
        if (!firstBad) {
          firstBad = el;
        }
      }
    }

    if (firstBad && firstBad.focus) {
      firstBad.focus();
    }
    return allGood;
  };

  /* ---------- demo sign-in (NOT real security) ----------
     Accounts are saved only in this browser. We never save the
     password itself - only a "hash" (a scrambled version) mixed
     with a random "salt". A real website would do this on a server. */

  // Turn text into a scrambled string. Same input -> same output.
  function hashPw(password, salt) {
    var text = salt + "::" + password;
    var h1 = 5381;
    var h2 = 52711;
    for (var round = 0; round < 500; round++) {
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        h1 = (h1 * 33 + code) % 4294967291;
        h2 = (h2 * 31 + code + i) % 4294967279;
      }
    }
    return h1.toString(16) + h2.toString(16);
  }

  CP.auth = {
    // The signed-in user (or null).
    user: function () {
      return CP.store.get("session", null);
    },

    // Create an account. Throws an Error if the email is already used.
    signUp: function (name, email, password) {
      var accounts = CP.store.get("accounts", {});
      var key = email.trim().toLowerCase();
      if (accounts[key]) {
        throw new Error("An account with this email already exists in this browser. Try signing in.");
      }

      var salt = CP.uid() + CP.uid();
      accounts[key] = { name: name.trim(), email: key, salt: salt, hash: hashPw(password, salt) };
      CP.store.set("accounts", accounts);
      CP.store.set("session", { name: name.trim(), email: key });

      var profile = CP.store.get("profile", {});
      profile.name = name.trim();
      profile.email = key;
      CP.store.set("profile", profile);
    },

    // Sign in. Throws an Error if the email/password is wrong.
    signIn: function (email, password) {
      var accounts = CP.store.get("accounts", {});
      var acc = accounts[email.trim().toLowerCase()];
      if (!acc || hashPw(password, acc.salt) !== acc.hash) {
        throw new Error("Email or password is incorrect.");
      }

      CP.store.set("session", { name: acc.name, email: acc.email });
      var profile = CP.store.get("profile", {});
      if (!profile.name) {
        profile.name = acc.name;
        profile.email = acc.email;
        CP.store.set("profile", profile);
      }
    },

    signOut: function () {
      CP.store.remove("session");
    }
  };

  // The saved profile, with empty defaults for anything missing.
  CP.profile = function () {
    var defaults = { name: "", email: "", phone: "", college: "", degree: "B.Tech", year: "3rd Year", skills: "" };
    return Object.assign(defaults, CP.store.get("profile", {}));
  };

  // The name to show in the page ("Student" if we do not know it).
  CP.displayName = function () {
    var user = CP.auth.user();
    var profile = CP.profile();
    var name = profile.name || (user && user.name) || "Student";
    return name.trim();
  };

  /* ---------- navigation menu ---------- */
  // [page file, label, id]
  CP.nav = [
    ["index.html", "Home", "home"],
    ["courses.html", "Courses", "courses"],
    ["internships.html", "Internships", "internships"],
    ["jobs.html", "Jobs", "jobs"],
    ["companies.html", "Companies", "companies"],
    ["drives.html", "Placement Drives", "drives"],
    ["advisor.html", "AI Advisor", "advisor"]
  ];

  // Draw the top bar into <div id="site-header">.
  CP.renderHeader = function (active) {
    var host = CP.$("#site-header");
    if (!host) {
      return;
    }
    var user = CP.auth.user();

    // menu links
    var links = "";
    for (var i = 0; i < CP.nav.length; i++) {
      var item = CP.nav[i];
      if (item[0] === active || item[2] === active) {
        links += '<a href="' + item[0] + '" class="active" aria-current="page">' + item[1] + "</a>";
      } else {
        links += '<a href="' + item[0] + '">' + item[1] + "</a>";
      }
    }
    if (!user) {
      links += '<a class="show-sm-only" href="signin.html">Sign In</a><a class="show-sm-only" href="signup.html">Sign Up</a>';
    }

    // buttons on the right
    var actions = '<button class="icon-btn" type="button" data-theme-toggle></button>';
    if (user) {
      actions += '<a class="user-chip hide-sm" href="dashboard.html" title="Open dashboard">' +
        '<span class="avatar">' + CP.esc(CP.initials(CP.displayName())) + "</span>" +
        CP.esc(CP.displayName().split(" ")[0]) + "</a>";
      actions += '<button class="btn btn-sm hide-sm" type="button" id="signOutBtn">Sign Out</button>';
    } else {
      actions += '<a class="btn btn-sm hide-sm" href="signin.html">Sign In</a>';
      actions += '<a class="btn btn-sm btn-primary hide-sm" href="signup.html">Sign Up</a>';
    }
    actions += '<button class="icon-btn hamburger" type="button" id="hamburger" aria-label="Open menu" ' +
      'aria-expanded="false" aria-controls="navLinks">' + CP.icon("menu") + "</button>";

    host.outerHTML = '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="nav">' + CP.logo("index.html") +
      '<nav class="nav-links" id="navLinks" aria-label="Main">' + links + "</nav>" +
      '<div class="nav-actions">' + actions + "</div></div></header>";

    CP.theme.sync();

    // hamburger button (small screens)
    var linkBox = CP.$("#navLinks");
    var burger = CP.$("#hamburger");

    function setOpen(isOpen) {
      linkBox.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", isOpen);
      burger.innerHTML = CP.icon(isOpen ? "close" : "menu");
      burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    burger.addEventListener("click", function () {
      setOpen(!linkBox.classList.contains("open"));
    });
    linkBox.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    });

    var signOutBtn = CP.$("#signOutBtn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", function () {
        CP.auth.signOut();
        CP.toast("Signed out successfully.");
        setTimeout(function () {
          location.href = "index.html";
        }, 500);
      });
    }
  };

  // Two helper classes: show some links only on small screens.
  var smallScreenStyle = document.createElement("style");
  smallScreenStyle.textContent = ".show-sm-only{display:none}@media(max-width:1080px){.show-sm-only{display:block}}";
  document.head.appendChild(smallScreenStyle);

  // Draw the footer into <div id="site-footer">.
  CP.renderFooter = function () {
    var host = CP.$("#site-footer");
    if (!host) {
      return;
    }
    host.outerHTML = '<footer><div class="container"><div class="footer-grid"><div>' + CP.logo("index.html") +
      "<p>A student career-prep platform: courses, opportunities, resume tools and practice, all in one place.</p></div>" +
      '<div><h4>Explore</h4><ul><li><a href="courses.html">Courses</a></li><li><a href="internships.html">Internships</a></li><li><a href="jobs.html">Jobs</a></li><li><a href="companies.html">Companies</a></li></ul></div>' +
      '<div><h4>Prepare</h4><ul><li><a href="drives.html">Placement Drives</a></li><li><a href="dashboard.html#resume">Resume Builder</a></li><li><a href="dashboard.html#interview">Interview Prep</a></li><li><a href="advisor.html">AI Advisor</a></li></ul></div>' +
      '<div><h4>Account</h4><ul><li><a href="signin.html">Sign In</a></li><li><a href="signup.html">Sign Up</a></li><li><a href="dashboard.html">Dashboard</a></li><li><a href="feedback.html">Student Feedback</a></li></ul></div></div>' +
      '<div class="footer-bottom"><span>© <span id="yr"></span> CareerPrep — student project demo.</span>' +
      "<span>All listings, companies, drives and testimonials are illustrative sample data. No real partnerships or openings are implied.</span></div></div></footer>";
    CP.$("#yr").textContent = new Date().getFullYear();
  };

  /* ---------- golden spheres (falling background decoration) ---------- */
  CP.spheres = function (count) {
    if (CP.$(".spheres")) {
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "spheres";
    wrap.setAttribute("aria-hidden", "true");

    // random number between a and b
    function random(a, b) {
      return a + Math.random() * (b - a);
    }

    var n = count;
    if (!n) {
      n = window.innerWidth < 700 ? 7 : 12;
    }

    var html = "";
    for (var i = 0; i < n; i++) {
      var size = (i % 5 === 0) ? random(26, 38) : random(9, 22);   // every 5th sphere is bigger
      var duration = random(16, 34);
      var extraClass = (i % 3 === 1) ? " dip" : "";

      html += '<div class="sphere-wrap' + extraClass + '" style="' +
        "--x:" + random(2, 96).toFixed(1) + "%;" +
        "--s:" + size.toFixed(0) + "px;" +
        "--dur:" + duration.toFixed(1) + "s;" +
        "--delay:-" + random(0, duration).toFixed(1) + "s;" +
        "--sway:" + random(4, 9).toFixed(1) + "s;" +
        "--drift:" + random(10, 38).toFixed(0) + "px;" +
        "--o:" + random(0.55, 0.95).toFixed(2) + ";" +
        "--y:" + random(6, 88).toFixed(0) + '%"><div class="sphere"></div></div>';
    }
    wrap.innerHTML = html;
    document.body.insertBefore(wrap, document.body.firstChild);
  };

  /* ---------- boot: call this once on every public page ---------- */
  CP.boot = function (opts) {
    opts = opts || {};
    CP.spheres();
    if (opts.header !== false) {
      CP.renderHeader(opts.active);
    }
    CP.renderFooter();
    CP.theme.sync();
  };
})();
