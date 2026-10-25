/* ==========================================================
   CareerPrep views  (plain JavaScript)

   Shared by the public pages and the dashboard.
   Contains: saved/applied helpers, the cards for courses, jobs,
   internships, companies and drives, the search + filter lists,
   and the pop-ups (apply, register, course lessons, company).

   Everything is attached to CP.Views (shortcut: V).
   Sample data lives in data.js (shortcut: D).
   ========================================================== */
(function () {
  "use strict";

  var CP = window.CP;
  var D = window.CPData;
  var esc = CP.esc;
  var icon = CP.icon;
  var V = {};
  CP.Views = V;

  /* ---------- saved things: activity, saved jobs, applications ---------- */

  // Add a line to the "Recent activity" list (keeps the latest 25).
  CP.log = function (text) {
    var list = CP.store.get("activity", []);
    list.unshift({ text: text, ts: Date.now() });
    CP.store.set("activity", list.slice(0, 25));
  };

  // Turn a time stamp into text like "5 min ago".
  CP.ago = function (ts) {
    var seconds = Math.max(1, Math.round((Date.now() - ts) / 1000));
    if (seconds < 60) {
      return "Just now";
    }
    if (seconds < 3600) {
      return Math.round(seconds / 60) + " min ago";
    }
    if (seconds < 86400) {
      return Math.round(seconds / 3600) + " hr ago";
    }
    var days = Math.round(seconds / 86400);
    return days + " day" + (seconds >= 172800 ? "s" : "") + " ago";
  };

  // Saved jobs and internships. We only store their ids.
  CP.saved = {
    // { jobs: [ids], internships: [ids] }
    all: function () {
      var data = CP.store.get("saved", {});
      return {
        jobs: data.jobs || [],
        internships: data.internships || []
      };
    },

    // Is this one saved? type is "jobs" or "internships".
    has: function (type, id) {
      return CP.saved.all()[type].indexOf(id) >= 0;
    },

    // Save it if not saved, un-save it if saved. Returns true if now saved.
    toggle: function (type, id) {
      var data = CP.saved.all();
      var position = data[type].indexOf(id);
      var nowSaved;
      if (position >= 0) {
        data[type].splice(position, 1);
        nowSaved = false;
      } else {
        data[type].push(id);
        nowSaved = true;
      }
      CP.store.set("saved", data);
      return nowSaved;
    },

    // How many things are saved in total.
    count: function () {
      var data = CP.saved.all();
      return data.jobs.length + data.internships.length;
    }
  };

  // Demo applications.
  CP.apps = {
    all: function () {
      return CP.store.get("apps", []);
    },
    add: function (app) {
      var list = CP.apps.all();
      list.unshift(app);
      CP.store.set("apps", list);
    }
  };

  // Which lesson numbers of a course are finished, e.g. [0, 2].
  CP.courseDone = function (id) {
    var all = CP.store.get("lessons", {});
    return all[id] || [];
  };

  // Course progress as a percentage (starts at the sample value in data.js).
  CP.courseProgress = function (c) {
    var done = CP.courseDone(c.id).length;
    var own = Math.round((done / c.lessons.length) * 100);
    return Math.max(c.progress, own);
  };

  /* ---------- small helpers ---------- */

  // Colour for a company's logo tile.
  function color(company) {
    return D.colors[company] || "#0d9488";
  }

  // Coloured square with the company's initials.
  function logoTile(company) {
    return '<span class="logo-tile" style="background:' + color(company) + '" aria-hidden="true">' +
      esc(CP.initials(company)) + "</span>";
  }

  // A row of small skill tags.
  function tags(list) {
    var html = '<div class="tags">';
    for (var i = 0; i < list.length; i++) {
      html += '<span class="tag">' + esc(list[i]) + "</span>";
    }
    return html + "</div>";
  }

  function saveLabel(type) {
    return type === "jobs" ? "Save Job" : "Save Internship";
  }

  // The Save / Saved button.
  function saveBtn(type, id) {
    var on = CP.saved.has(type, id);
    return '<button type="button" class="btn btn-sm save-btn' + (on ? " saved" : "") + '" data-action="save" ' +
      'data-type="' + type + '" data-id="' + id + '" aria-pressed="' + on + '">' +
      icon("bookmark") + "<span>" + (on ? "Saved" : saveLabel(type)) + "</span></button>";
  }

  // After saving, update every Save button on the page.
  function refreshSaves() {
    var buttons = CP.$$(".save-btn");
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var on = CP.saved.has(b.dataset.type, b.dataset.id);
      b.classList.toggle("saved", on);
      b.setAttribute("aria-pressed", on);
      b.querySelector("span").textContent = on ? "Saved" : saveLabel(b.dataset.type);
    }
    document.dispatchEvent(new CustomEvent("cp:state"));
  }

  // Find one item in a list by its id.
  function find(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return null;
  }

  // Jobs or internships list, depending on the type text.
  function listFor(type) {
    return type === "jobs" ? D.jobs : D.internships;
  }

  var sampleBadge = '';

  // The yellow "Demo data" notice box.
  V.sampleNotice = function (txt) {
    return txt ? '<div class="notice" role="note">' + txt + "</div>" : '';
  };

  // Build one labelled text box (used by the forms).
  // attrs = extra attributes such as ' type="email" value="a@b.com"'
  function inputField(id, name, label, required, attrs) {
    return '<div class="field"><label for="' + id + '">' + label + (required ? ' <span class="req">*</span>' : "") + "</label>" +
      '<input class="input" id="' + id + '" name="' + name + '"' + (attrs || "") + ">" +
      '<span class="err" data-err="' + name + '"></span></div>';
  }
  V.inputField = inputField;

  // The "I understand this is a demo" checkbox row.
  function consentField(text) {
    return '<div class="field"><label style="display:flex;gap:10px;align-items:flex-start;font-weight:500">' +
      '<input type="checkbox" name="consent" style="margin-top:4px"> <span>' + text + ' <span class="req">*</span></span></label>' +
      '<span class="err" data-err="consent"></span></div>';
  }

  // Validation rule for a CGPA box (0 to 10).
  function cgpaRule(v) {
    if (isNaN(v) || +v < 0 || +v > 10) {
      return "Enter a CGPA between 0 and 10.";
    }
    return "";
  }

  /* ---------- search + filter list ----------
     filterable() draws a search box, filters, a sort menu and a grid of cards.
     cfg tells it what to show:
        items       the list of things (jobs, courses ...)
        render      function that turns one item into card HTML
        text        function that returns the words the search looks in
        chips       category buttons (optional)   chipTest decides if an item matches
        selects     drop-down filters (optional)  each has key, label, options, test
        sorts       sort choices (optional)       each has v, label, fn
        limit       show only this many cards, no controls (used on the home page)
     It returns { redraw } so you can refresh the list later. */
  function filterable(el, cfg) {
    // what the visitor has chosen so far
    var state = { q: "", chip: "All", sort: "", sel: {}, onlySaved: false };
    if (cfg.sorts) {
      state.sort = cfg.sorts[0].v;
    }
    var limit = cfg.limit;
    var selects = cfg.selects || [];
    var html = "";
    var i, j;

    // ----- draw the controls (not on the home page) -----
    if (!limit) {
      var savedButton = '<button type="button" class="chip" data-savedonly="1">★ Saved only</button>';

      if (cfg.chips) {
        html += '<div class="chips" role="group" aria-label="Category">';
        var names = ["All"].concat(cfg.chips);
        for (i = 0; i < names.length; i++) {
          html += '<button type="button" class="chip' + (names[i] === "All" ? " active" : "") + '" data-chip="' + esc(names[i]) + '">' + esc(names[i]) + "</button>";
        }
        if (cfg.savedChip) {
          html += savedButton;
        }
        html += "</div>";
      } else if (cfg.savedChip) {
        html += '<div class="chips">' + savedButton + "</div>";
      }

      html += '<div class="toolbar"><div class="search">' + icon("search") +
        '<label class="sr-only" for="q-' + cfg.id + '">Search</label>' +
        '<input id="q-' + cfg.id + '" class="input" type="search" placeholder="' + esc(cfg.placeholder) + '" autocomplete="off"></div>';

      for (i = 0; i < selects.length; i++) {
        var s = selects[i];
        html += '<label class="sr-only" for="s-' + cfg.id + s.key + '">' + esc(s.label) + "</label>" +
          '<select id="s-' + cfg.id + s.key + '" class="select" data-sel="' + s.key + '"><option value="">' + esc(s.label) + "</option>";
        for (j = 0; j < s.options.length; j++) {
          html += "<option>" + esc(s.options[j]) + "</option>";
        }
        html += "</select>";
      }

      if (cfg.sorts) {
        html += '<label class="sr-only" for="so-' + cfg.id + '">Sort</label><select id="so-' + cfg.id + '" class="select" data-sort>';
        for (i = 0; i < cfg.sorts.length; i++) {
          html += '<option value="' + cfg.sorts[i].v + '">' + esc(cfg.sorts[i].label) + "</option>";
        }
        html += "</select>";
      }
      html += '</div><p class="result-count" aria-live="polite"></p>';
    }

    html += '<div class="grid ' + (cfg.gridClass || "grid-3") + '" data-list></div>';
    el.innerHTML = html;

    var listBox = CP.$("[data-list]", el);
    var countBox = CP.$(".result-count", el);

    // Does one item pass the search and every filter?
    function matches(item) {
      if (state.q && cfg.text(item).toLowerCase().indexOf(state.q) < 0) {
        return false;
      }
      if (state.chip !== "All" && cfg.chipTest && !cfg.chipTest(item, state.chip)) {
        return false;
      }
      if (state.onlySaved && !cfg.isSaved(item)) {
        return false;
      }
      for (var k = 0; k < selects.length; k++) {
        var chosen = state.sel[selects[k].key];
        if (chosen && !selects[k].test(item, chosen)) {
          return false;
        }
      }
      return true;
    }

    // Work out which items to show and draw them.
    function draw() {
      var items = [];
      for (var n = 0; n < cfg.items.length; n++) {
        if (matches(cfg.items[n])) {
          items.push(cfg.items[n]);
        }
      }

      if (cfg.sorts) {
        for (var m = 0; m < cfg.sorts.length; m++) {
          if (cfg.sorts[m].v === state.sort && cfg.sorts[m].fn) {
            items.sort(cfg.sorts[m].fn);
          }
        }
      }

      var total = items.length;
      if (limit) {
        items = items.slice(0, limit);
      }
      if (countBox) {
        countBox.textContent = total + " result" + (total === 1 ? "" : "s") + " found";
      }

      if (items.length === 0) {
        listBox.innerHTML = '<div class="empty"><h3>Nothing matches your filters</h3><p>Try clearing the search or choosing different filters.</p></div>';
        return;
      }
      var cards = "";
      for (var c = 0; c < items.length; c++) {
        cards += cfg.render(items[c]);
      }
      listBox.innerHTML = cards;
    }

    // ----- react to the visitor (not on the home page) -----
    if (!limit) {
      // typing in the search box
      el.addEventListener("input", function (e) {
        if (e.target.type === "search") {
          state.q = e.target.value.trim().toLowerCase();
          draw();
        }
      });

      // choosing from a drop-down
      el.addEventListener("change", function (e) {
        if (e.target.dataset.sel) {
          state.sel[e.target.dataset.sel] = e.target.value;
        }
        if (e.target.hasAttribute("data-sort")) {
          state.sort = e.target.value;
        }
        draw();
      });

      // clicking a category chip or the "Saved only" chip
      el.addEventListener("click", function (e) {
        var chip = e.target.closest("[data-chip]");
        var savedOnly = e.target.closest("[data-savedonly]");
        if (chip) {
          state.chip = chip.dataset.chip;
          var allChips = CP.$$("[data-chip]", el);
          for (var a = 0; a < allChips.length; a++) {
            allChips[a].classList.toggle("active", allChips[a] === chip);
          }
          draw();
        }
        if (savedOnly) {
          state.onlySaved = !state.onlySaved;
          savedOnly.classList.toggle("active", state.onlySaved);
          draw();
        }
      });

      // when something is saved/unsaved, refresh the "Saved only" view
      document.addEventListener("cp:state", function () {
        if (state.onlySaved) {
          draw();
        }
      });
    }

    draw();
    return { redraw: draw };
  }

  /* ---------- cards (one function per kind) ---------- */

  function courseCard(c) {
    var p = CP.courseProgress(c);
    var started = p > 0;

    var html = '<article class="card"><div class="card-badge-row"><span class="badge">' + esc(c.level) + "</span>" + sampleBadge + "</div>";
    html += "<h3>" + esc(c.title) + "</h3><p>" + esc(c.desc) + "</p>";
    html += '<div class="meta"><span>' + icon("clock") + esc(c.duration) + "</span><span>" + icon("layers") + esc(c.category) + "</span></div>";
    html += tags(c.skills);
    html += '<div><div class="progress-row"><span>' + (started ? "Progress" : "Not started") + ' <em style="opacity:.7">(sample)</em></span><span>' + p + "%</span></div>";
    html += '<div class="progress" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + esc(c.title) + ' progress"><i style="width:' + p + '%"></i></div></div>';
    html += '<div class="card-actions"><button type="button" class="btn btn-primary btn-sm" data-action="course" data-id="' + c.id + '">' + (started ? "Continue Learning" : "Start Learning") + "</button></div></article>";
    return html;
  }

  function jobCard(j) {
    var html = '<article class="card"><div class="card-top">' + logoTile(j.company) + '<div style="min-width:0;flex:1">';
    html += '<div class="card-badge-row"><small style="color:var(--muted)">' + esc(j.company) + "</small>" + sampleBadge + "</div>";
    html += "<h3>" + esc(j.title) + "</h3></div></div>";
    html += "<p>" + esc(j.desc) + "</p>";
    html += '<div class="meta"><span>' + icon("pin") + esc(j.location) + "</span><span>" + icon("brief") + esc(j.mode) + "</span><span>" + icon("award") + esc(j.exp) + "</span></div>";
    html += tags(j.skills);
    html += '<div class="card-actions"><button type="button" class="btn btn-primary btn-sm" data-action="apply" data-type="jobs" data-id="' + j.id + '">Apply Now</button>' + saveBtn("jobs", j.id) + "</div></article>";
    return html;
  }

  // "₹30,000/month" or a message when there is no stipend.
  function stipendText(i) {
    if (i.stipend) {
      return "₹" + i.stipend.toLocaleString("en-IN") + "/month";
    }
    return "Unpaid / not specified";
  }

  function internCard(i) {
    var html = '<article class="card"><div class="card-top">' + logoTile(i.company) + '<div style="min-width:0;flex:1">';
    html += '<div class="card-badge-row"><small style="color:var(--muted)">' + esc(i.company) + "</small>" + sampleBadge + "</div>";
    html += "<h3>" + esc(i.title) + "</h3></div></div>";
    html += '<div class="meta"><span>' + icon("pin") + esc(i.location) + "</span><span>" + icon("brief") + esc(i.mode) + "</span>";
    html += "<span>" + icon("clock") + esc(i.duration) + "</span><span>" + esc(stipendText(i)) + "</span></div>";
    html += '<p><b style="color:var(--text)">Eligibility:</b> ' + esc(i.elig) + "</p>";
    html += tags(i.skills);
    html += '<div class="card-actions"><button type="button" class="btn btn-primary btn-sm" data-action="apply" data-type="internships" data-id="' + i.id + '">Apply Now</button>' + saveBtn("internships", i.id) + "</div></article>";
    return html;
  }

  function companyCard(c) {
    var html = '<article class="card"><div class="card-top">' + logoTile(c.name) + '<div style="flex:1">';
    html += '<div class="card-badge-row"><h3>' + esc(c.name) + "</h3>" + sampleBadge + "</div>";
    html += '<small style="color:var(--muted)">' + esc(c.industry) + "</small></div></div>";
    html += "<p>" + esc(c.desc) + "</p>" + tags(c.skills);
    html += '<div class="card-actions"><button type="button" class="btn btn-primary btn-sm" data-action="explore" data-id="' + esc(c.name) + '">Explore Jobs</button></div></article>';
    return html;
  }

  // Which badge colour a drive's status gets.
  function driveStatus(d) {
    if (d.status === "Registration Open") {
      return "ok";
    }
    if (d.status === "Closing Soon") {
      return "warn";
    }
    if (d.status === "Upcoming") {
      return "";
    }
    if (d.status === "Registration Closed") {
      return "danger";
    }
    return "muted";
  }

  function driveCard(d) {
    var closed = d.status === "Registration Closed";
    var html = '<article class="card"><div class="card-top">' + logoTile(d.company) + '<div style="min-width:0;flex:1">';
    html += '<div class="card-badge-row"><small style="color:var(--muted)">' + esc(d.company) + '</small><span class="badge ' + driveStatus(d) + '">' + esc(d.status) + "</span></div>";
    html += "<h3>" + esc(d.title) + "</h3></div></div>";
    html += '<div class="meta"><span>' + icon("cal") + "Event: " + CP.fmtDate(CP.dayOffset(d.eventOffset)) + "</span>";
    html += "<span>" + icon("clock") + "Register by: " + CP.fmtDate(CP.dayOffset(d.regOffset)) + "</span></div>";
    html += '<p><b style="color:var(--text)">Eligibility:</b> ' + esc(d.elig) + "</p>" + tags(d.skills);
    html += '<p style="font-size:.74rem">' + sampleBadge + " Sample dates — not a verified drive.</p>";
    html += '<div class="card-actions"><button type="button" class="btn btn-sm" data-action="drive-details" data-id="' + d.id + '">View Details</button>';
    html += '<button type="button" class="btn btn-primary btn-sm" data-action="drive-register" data-id="' + d.id + '"' + (closed ? " disabled" : "") + ">" + (closed ? "Closed" : "Register") + "</button></div></article>";
    return html;
  }

  V.cards = { course: courseCard, job: jobCard, intern: internCard, company: companyCard, drive: driveCard };

  /* ---------- the five list pages ---------- */

  // Sorted list of the different values in an array (no repeats).
  function uniq(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (out.indexOf(list[i]) < 0) {
        out.push(list[i]);
      }
    }
    return out.sort();
  }

  // Pick one field from every item: pluck(D.jobs, "location")
  function pluck(items, field) {
    var out = [];
    for (var i = 0; i < items.length; i++) {
      out.push(items[i][field]);
    }
    return out;
  }

  // "6 weeks" -> 6,  "3 months" -> 12   (so durations can be compared)
  function durationInWeeks(text) {
    var number = parseFloat(text);
    if (/week/.test(text)) {
      return number;
    }
    return number * 4;
  }

  // Merge the page's own options (like { limit: 3 }) into the settings.
  function withOptions(cfg, o) {
    return Object.assign(cfg, o);
  }

  V.courses = function (el, o) {
    var cfg = {
      id: "courses",
      items: D.courses,
      render: courseCard,
      placeholder: "Search courses, skills or topics…",
      text: function (c) {
        return [c.title, c.desc, c.category, c.level, c.skills.join(" ")].join(" ");
      },
      chips: uniq(pluck(D.courses, "category")),
      chipTest: function (c, v) {
        return c.category === v;
      },
      selects: [
        { key: "level", label: "All levels", options: ["Beginner", "Intermediate", "Advanced"], test: function (c, v) { return c.level === v; } }
      ]
    };
    return filterable(el, withOptions(cfg, o));
  };

  V.internships = function (el, o) {
    var cfg = {
      id: "intern",
      items: D.internships,
      render: internCard,
      placeholder: "Search internships, companies or skills…",
      savedChip: true,
      text: function (i) {
        return [i.title, i.company, i.location, i.skills.join(" "), i.elig].join(" ");
      },
      isSaved: function (i) {
        return CP.saved.has("internships", i.id);
      },
      selects: [
        { key: "loc", label: "All locations", options: uniq(pluck(D.internships, "location")), test: function (i, v) { return i.location === v; } },
        { key: "mode", label: "Work mode", options: ["Remote", "Hybrid", "Onsite"], test: function (i, v) { return i.mode === v; } }
      ],
      sorts: [
        { v: "def", label: "Sort: Featured" },
        { v: "stip", label: "Stipend: High to low", fn: function (a, b) { return (b.stipend || 0) - (a.stipend || 0); } },
        { v: "az", label: "Company: A–Z", fn: function (a, b) { return a.company.localeCompare(b.company); } },
        { v: "dur", label: "Duration: Short first", fn: function (a, b) { return durationInWeeks(a.duration) - durationInWeeks(b.duration); } }
      ]
    };
    return filterable(el, withOptions(cfg, o));
  };

  V.jobs = function (el, o) {
    var cfg = {
      id: "jobs",
      items: D.jobs,
      render: jobCard,
      placeholder: "Search jobs, companies or skills…",
      savedChip: true,
      text: function (j) {
        return [j.title, j.company, j.location, j.skills.join(" "), j.desc].join(" ");
      },
      isSaved: function (j) {
        return CP.saved.has("jobs", j.id);
      },
      selects: [
        { key: "co", label: "All companies", options: uniq(pluck(D.jobs, "company")), test: function (j, v) { return j.company === v; } },
        { key: "loc", label: "All locations", options: uniq(pluck(D.jobs, "location")), test: function (j, v) { return j.location === v; } },
        { key: "mode", label: "Work mode", options: ["Remote", "Hybrid", "Onsite"], test: function (j, v) { return j.mode === v; } }
      ],
      sorts: [
        { v: "def", label: "Sort: Featured" },
        { v: "co", label: "Company: A–Z", fn: function (a, b) { return a.company.localeCompare(b.company); } },
        { v: "title", label: "Title: A–Z", fn: function (a, b) { return a.title.localeCompare(b.title); } }
      ]
    };
    return filterable(el, withOptions(cfg, o));
  };

  V.companies = function (el, o) {
    var cfg = {
      id: "co",
      items: D.companies,
      render: companyCard,
      placeholder: "Search companies, industries or skills…",
      text: function (c) {
        return [c.name, c.industry, c.desc, c.skills.join(" ")].join(" ");
      },
      selects: [
        { key: "ind", label: "All industries", options: uniq(pluck(D.companies, "industry")), test: function (c, v) { return c.industry === v; } }
      ]
    };
    return filterable(el, withOptions(cfg, o));
  };

  V.drives = function (el, o) {
    var cfg = {
      id: "drives",
      items: D.drives,
      render: driveCard,
      placeholder: "Search drives, companies or skills…",
      text: function (d) {
        return [d.company, d.title, d.skills.join(" "), d.elig].join(" ");
      },
      selects: [
        { key: "st", label: "All statuses", options: ["Registration Open", "Closing Soon", "Upcoming", "Registration Closed"], test: function (d, v) { return d.status === v; } }
      ]
    };
    return filterable(el, withOptions(cfg, o));
  };

  /* ---------- apply pop-up (jobs and internships) ---------- */
  V.applyModal = function (type, item) {
    var p = CP.profile();

    // Did the visitor already apply to this one?
    var already = null;
    var apps = CP.apps.all();
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].refId === item.id && apps[i].type === type) {
        already = apps[i];
      }
    }

    var body = '<div class="summary-box">' + logoTile(item.company) + "<div><b>" + esc(item.title) + '</b><br><small style="color:var(--muted)">' +
      esc(item.company) + " · " + esc(item.location) + " · " + esc(item.mode) + "</small></div></div>";
    body += '<div class="notice" style="margin-bottom:16px">This is a <b>demo</b> application. It is saved only in your browser — it is <b>not</b> sent to ' + esc(item.company) + ".</div>";
    if (already) {
      body += '<div class="notice" style="margin-bottom:16px;border-color:var(--ok)">You already submitted an application for this listing on ' + CP.fmtDate(already.date) + ".</div>";
    }

    body += '<form novalidate id="applyForm">';
    body += '<div class="form-row">' +
      inputField("a-name", "name", "Full name", true, ' autocomplete="name" value="' + esc(p.name) + '"') +
      inputField("a-email", "email", "Email", true, ' type="email" autocomplete="email" value="' + esc(p.email) + '"') + "</div>";
    body += '<div class="form-row">' +
      inputField("a-phone", "phone", "Phone", true, ' type="tel" autocomplete="tel" value="' + esc(p.phone) + '"') +
      inputField("a-cgpa", "cgpa", "CGPA (out of 10)", true, ' inputmode="decimal" placeholder="e.g. 8.2"') + "</div>";
    body += inputField("a-college", "college", "College / University", true, ' value="' + esc(p.college) + '"');
    body += inputField("a-skills", "skills", "Relevant skills", false, ' value="' + esc(p.skills) + '" placeholder="e.g. Java, SQL, Teamwork"');
    body += '<div class="field"><label for="a-note">Why are you a good fit? <span class="hint">(optional, max 400 characters)</span></label>' +
      '<textarea class="textarea" id="a-note" name="note" maxlength="400"></textarea></div>';
    body += consentField("I understand that this application is saved in this browser and will not be sent to the company.");
    body += '<div class="modal-actions"><button type="button" class="btn" data-modal-close>Cancel</button>' +
      '<button class="btn btn-primary" type="submit">Submit Application</button></div></form>';

    var title = (type === "jobs" ? "Apply for " : "Apply for internship: ") + item.title;

    CP.modal.open({
      title: title,
      sub: "Fields marked * are required.",
      body: body,
      onOpen: function (root) {
        var form = CP.$("#applyForm", root);
        form.addEventListener("submit", function (e) {
          e.preventDefault();

          var good = CP.validate(form, {
            name: { required: true, min: 2 },
            email: { required: true, email: true },
            phone: { required: true, phone: true },
            college: { required: true, min: 3 },
            cgpa: { required: true, custom: cgpaRule },
            consent: {
              custom: function () {
                return form.elements.consent.checked ? "" : "Please confirm you understand how this application is processed.";
              }
            }
          });
          if (!good) {
            return;
          }

          // build the application record
          var f = form.elements;
          var app = {
            id: "APP-" + CP.uid().toUpperCase().slice(-6),
            type: type === "jobs" ? "Job" : "Internship",
            refId: item.id,
            company: item.company,
            title: item.title,
            name: f.name.value.trim(),
            email: f.email.value.trim(),
            phone: f.phone.value.trim(),
            college: f.college.value.trim(),
            cgpa: f.cgpa.value.trim(),
            skills: f.skills.value.trim(),
            note: f.note.value.trim(),
            date: Date.now(),
            status: "Submitted"
          };
          CP.apps.add(app);

          // remember the details in the profile (only fill empty ones)
          var prof = CP.profile();
          CP.store.set("profile", Object.assign({}, prof, {
            name: prof.name || app.name,
            email: prof.email || app.email,
            phone: prof.phone || app.phone,
            college: prof.college || app.college,
            skills: prof.skills || app.skills
          }));

          CP.log("You applied for " + item.title + " at " + item.company);
          document.dispatchEvent(new CustomEvent("cp:state"));

          // show the thank-you message
          CP.$(".modal-body", root).innerHTML = '<div class="success-box"><div class="tick" aria-hidden="true">✓</div>' +
            "<h3>Application submitted</h3>" +
            '<p style="color:var(--muted);margin:8px 0 4px">Reference <b>' + esc(app.id) + "</b> for <b>" + esc(item.title) + "</b> at " + esc(item.company) + ".</p>" +
            '<p style="color:var(--muted);font-size:.85rem">This was saved only in your browser. It was <b>not</b> sent to the company.</p>' +
            '<div class="modal-actions" style="justify-content:center;margin-top:18px"><button class="btn" data-modal-close>Close</button>' +
            '<a class="btn btn-primary" href="dashboard.html#applications">View My Applications</a></div></div>';
          CP.$("h2", root).textContent = "Application received";
        });
      }
    });
  };

  /* ---------- course pop-up (lessons) ---------- */
  V.courseModal = function (id, startIdx) {
    var c = find(D.courses, id);
    if (!c) {
      return;
    }

    // Draw the lesson list. "open" is the lesson number that is expanded.
    function render(open) {
      var done = CP.courseDone(id);
      var p = CP.courseProgress(c);

      var html = '<div class="meta" style="margin-bottom:12px"><span class="badge">' + esc(c.level) + "</span><span>" + icon("clock") + esc(c.duration) +
        "</span><span>" + icon("layers") + esc(c.category) + "</span></div>" + tags(c.skills);
      html += '<div style="margin:16px 0"><div class="progress-row"><span>Course progress (includes sample starting progress)</span><span>' + p + "%</span></div>" +
        '<div class="progress"><i style="width:' + p + '%"></i></div></div>';
      html += '<h3 style="font-size:.95rem">Lessons</h3><div class="lesson-list">';

      for (var i = 0; i < c.lessons.length; i++) {
        var lesson = c.lessons[i];
        var isDone = done.indexOf(i) >= 0;

        html += '<button type="button" class="lesson' + (isDone ? " done" : "") + '" data-lesson="' + i + '" aria-expanded="' + (open === i) + '">' +
          '<span class="num">' + (isDone ? "✓" : i + 1) + '</span><span style="flex:1">' + esc(lesson.t) + "</span>" +
          '<span style="color:var(--muted);font-size:.78rem">' + (isDone ? "Completed" : "Open") + "</span></button>";

        // the open lesson shows its text, code and buttons
        if (open === i) {
          html += '<div class="lesson-body"><h4>' + esc(lesson.t) + "</h4><p>" + lesson.b + "</p><pre><code>" + esc(lesson.code) + "</code></pre>";
          html += '<div class="modal-actions" style="justify-content:flex-start"><button type="button" class="btn btn-primary btn-sm" data-complete="' + i + '">' +
            (isDone ? "Completed ✓" : "Mark lesson complete") + "</button>";
          if (i < c.lessons.length - 1) {
            html += '<button type="button" class="btn btn-sm" data-lesson="' + (i + 1) + '">Next lesson →</button>';
          }
          html += "</div></div>";
        }
      }
      html += "</div>";

      CP.$(".modal-body", CP.modal.el()).innerHTML = html;
    }

    var modal = CP.modal.open({ title: c.title, sub: c.desc, wide: true, body: "<div></div>" });

    // start on the first lesson that is not finished yet
    var first = startIdx;
    if (first === undefined || first === null) {
      first = 0;
      var done = CP.courseDone(id);
      for (var i = 0; i < c.lessons.length; i++) {
        if (done.indexOf(i) < 0) {
          first = i;
          break;
        }
      }
    }
    render(first);
    CP.log("Opened course: " + c.title);

    modal.addEventListener("click", function (e) {
      var lessonBtn = e.target.closest("[data-lesson]");
      var completeBtn = e.target.closest("[data-complete]");

      if (lessonBtn) {
        render(+lessonBtn.dataset.lesson);
      }

      if (completeBtn) {
        var n = +completeBtn.dataset.complete;
        var all = CP.store.get("lessons", {});
        all[id] = all[id] || [];
        if (all[id].indexOf(n) < 0) {
          all[id].push(n);
          CP.store.set("lessons", all);
          CP.log("Completed lesson “" + c.lessons[n].t + "” in " + c.title);
          CP.toast("Lesson marked complete.");
        }
        render(n);
        document.dispatchEvent(new CustomEvent("cp:state"));
        if (V.refreshCourses) {
          V.refreshCourses();
        }
      }
    });
  };

  /* ---------- company pop-up ---------- */
  V.companyModal = function (name) {
    var c = null;
    var i;
    for (i = 0; i < D.companies.length; i++) {
      if (D.companies[i].name === name) {
        c = D.companies[i];
      }
    }
    if (!c) {
      return;
    }

    // this company's jobs and internships
    var jobs = [];
    var interns = [];
    for (i = 0; i < D.jobs.length; i++) {
      if (D.jobs[i].company === name) {
        jobs.push(D.jobs[i]);
      }
    }
    for (i = 0; i < D.internships.length; i++) {
      if (D.internships[i].company === name) {
        interns.push(D.internships[i]);
      }
    }

    // one row: title, small text and an Apply button
    function row(type, item, subText) {
      return '<div class="list-row"><div class="grow"><b>' + esc(item.title) + "</b><small>" + subText + "</small></div>" +
        '<button class="btn btn-primary btn-sm" data-action="apply-from-co" data-type="' + type + '" data-id="' + item.id + '">Apply Now</button></div>';
    }

    var body = '<div class="notice" style="margin-bottom:14px"><b>Not an official partner.</b> CareerPrep has no partnership with ' + esc(name) +
      ". Check their official careers page for real openings.</div>";

    body += '<h3 style="font-size:.95rem;margin-bottom:4px">Jobs (' + jobs.length + ")</h3>";
    if (jobs.length === 0) {
      body += "<p style='color:var(--muted)'>No sample jobs for this company.</p>";
    }
    for (i = 0; i < jobs.length; i++) {
      body += row("jobs", jobs[i], esc(jobs[i].location) + " · " + esc(jobs[i].mode) + " · " + esc(jobs[i].exp));
    }

    body += '<h3 style="font-size:.95rem;margin:16px 0 4px">Internships (' + interns.length + ")</h3>";
    if (interns.length === 0) {
      body += "<p style='color:var(--muted)'>No sample internships for this company.</p>";
    }
    for (i = 0; i < interns.length; i++) {
      body += row("internships", interns[i], esc(interns[i].location) + " · " + esc(interns[i].mode) + " · " + esc(interns[i].duration));
    }

    CP.modal.open({
      title: name + " — sample opportunities",
      sub: "Listings and opportunities are provided for career exploration. Not affiliated with " + name + ".",
      wide: true,
      body: body
    });
  };

  /* ---------- placement drive pop-ups ---------- */

  // Has the visitor demo-registered for this drive?
  function findRegistration(id) {
    var regs = CP.store.get("driveRegs", []);
    for (var i = 0; i < regs.length; i++) {
      if (regs[i].id === id) {
        return regs[i];
      }
    }
    return null;
  }

  V.driveModal = function (id) {
    var d = find(D.drives, id);
    if (!d) {
      return;
    }
    var registered = findRegistration(id);
    var closed = d.status === "Registration Closed";

    var body = '<div class="notice" style="margin-bottom:14px">Dates and criteria are provided for planning purposes and are not an announcement by ' + esc(d.company) + ".</div>";
    body += '<p style="margin-bottom:14px">' + esc(d.desc) + "</p>";
    body += '<div class="grid grid-2" style="gap:12px">' +
      '<div class="summary-box" style="margin:0;display:block"><small style="color:var(--muted)">Event date (sample)</small><br><b>' + CP.fmtDate(CP.dayOffset(d.eventOffset)) + "</b></div>" +
      '<div class="summary-box" style="margin:0;display:block"><small style="color:var(--muted)">Registration deadline (sample)</small><br><b>' + CP.fmtDate(CP.dayOffset(d.regOffset)) + "</b></div></div>";
    body += '<h3 style="font-size:.95rem;margin:16px 0 6px">Eligibility</h3><p style="color:var(--muted)">' + esc(d.elig) + "</p>";
    body += '<h3 style="font-size:.95rem;margin:16px 0 8px">Skills to prepare</h3>' + tags(d.skills);
    body += '<h3 style="font-size:.95rem;margin:16px 0 6px">Typical process</h3>' +
      '<ol style="margin-left:20px;color:var(--muted);font-size:.9rem"><li>Online assessment</li><li>Technical interview</li><li>HR interview</li></ol>';

    body += '<div class="modal-actions" style="margin-top:20px"><button class="btn" data-modal-close>Close</button>';
    if (registered) {
      body += '<span class="badge ok" style="align-self:center">Registered ✓</span>';
    } else {
      body += '<button class="btn btn-primary" data-action="drive-register" data-id="' + d.id + '"' + (closed ? " disabled" : "") + ">Register</button>";
    }
    body += "</div>";

    CP.modal.open({ title: d.title, sub: d.company + " · " + d.status + " (sample)", body: body });
  };

  V.registerModal = function (id) {
    var d = find(D.drives, id);
    if (!d || d.status === "Registration Closed") {
      return;
    }
    if (findRegistration(id)) {
      CP.toast("You are already registered for this drive.");
      return;
    }
    var p = CP.profile();

    var body = '<div class="notice" style="margin-bottom:16px">Registration is stored only in this browser and <b>not</b> sent to ' + esc(d.company) + ".</div>";
    body += '<form id="regForm" novalidate>';
    body += '<div class="form-row">' +
      inputField("r-name", "name", "Full name", true, ' value="' + esc(p.name) + '" autocomplete="name"') +
      inputField("r-email", "email", "Email", true, ' type="email" value="' + esc(p.email) + '" autocomplete="email"') + "</div>";
    body += '<div class="form-row">' +
      inputField("r-college", "college", "College", true, ' value="' + esc(p.college) + '"') +
      '<div class="field"><label for="r-branch">Branch <span class="req">*</span></label><select class="select" id="r-branch" name="branch">' +
      '<option value="">Select branch</option><option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option><option>Mechanical</option><option>Civil</option><option>Other</option></select>' +
      '<span class="err" data-err="branch"></span></div></div>';
    body += '<div class="form-row">' +
      inputField("r-cgpa", "cgpa", "CGPA", true, ' inputmode="decimal" placeholder="e.g. 7.8"') +
      '<div class="field"><label for="r-back">Active backlogs <span class="req">*</span></label><select class="select" id="r-back" name="back">' +
      '<option value="">Select</option><option>0</option><option>1</option><option>2 or more</option></select>' +
      '<span class="err" data-err="back"></span></div></div>';
    body += consentField("I understand this registration is saved in this browser only.");
    body += '<div class="modal-actions"><button type="button" class="btn" data-modal-close>Cancel</button>' +
      '<button class="btn btn-primary" type="submit">Confirm Registration</button></div></form>';

    CP.modal.open({
      title: "Register for " + d.company + " drive",
      sub: d.title + "",
      body: body,
      onOpen: function (root) {
        var form = CP.$("#regForm", root);
        form.addEventListener("submit", function (e) {
          e.preventDefault();

          var good = CP.validate(form, {
            name: { required: true, min: 2 },
            email: { required: true, email: true },
            college: { required: true, min: 3 },
            branch: { required: true, msg: "Choose your branch." },
            cgpa: { required: true, custom: cgpaRule },
            back: { required: true, msg: "Select an option." },
            consent: {
              custom: function () {
                return form.elements.consent.checked ? "" : "Please confirm to continue.";
              }
            }
          });
          if (!good) {
            return;
          }

          var f = form.elements;
          var list = CP.store.get("driveRegs", []);
          list.push({ id: id, company: d.company, title: d.title, name: f.name.value.trim(), email: f.email.value.trim(), date: Date.now() });
          CP.store.set("driveRegs", list);
          CP.log("Registered for " + d.company + " drive");
          document.dispatchEvent(new CustomEvent("cp:state"));

          CP.$("h2", root).textContent = "Registration confirmed";
          CP.$(".modal-body", root).innerHTML = '<div class="success-box"><div class="tick" aria-hidden="true">✓</div><h3>Registration confirmed</h3>' +
            '<p style="color:var(--muted);margin-top:8px">' + esc(f.name.value.trim()) + ", your registration for <b>" + esc(d.title) +
            "</b> is saved in this browser. It was not sent to " + esc(d.company) + ".</p>" +
            '<div class="modal-actions" style="justify-content:center;margin-top:18px"><button class="btn btn-primary" data-modal-close>Done</button></div></div>';
        });
      }
    });
  };

  /* ---------- student feedback ---------- */

  // One feedback card. mine = true for feedback the visitor wrote.
  function fbCard(t, mine) {
    return '<article class="card"><div class="card-badge-row">' + CP.stars(t.rating) +
      '<span class="badge ' + (mine ? "ok" : "sample") + '">' + (mine ? "Your feedback" : "Student profile") + "</span></div>" +
      '<p class="quote">“' + esc(t.text) + "”</p>" +
      '<div class="person"><span class="avatar">' + esc(CP.initials(t.name)) + "</span><div><b>" + esc(t.name) + "</b><small>" + esc(t.cat) + "</small></div></div></article>";
  }

  // Show the feedback cards (the visitor's own first, then the samples).
  V.testimonials = function (el, limit) {
    var mine = CP.store.get("feedback", []);
    var cards = [];
    var i;
    for (i = 0; i < mine.length; i++) {
      cards.push(fbCard(mine[i], true));
    }
    for (i = 0; i < D.testimonials.length; i++) {
      cards.push(fbCard(D.testimonials[i], false));
    }
    el.innerHTML = cards.slice(0, limit || cards.length).join("");
  };

  // The "Share your feedback" form. onSubmit runs after a successful submit.
  V.feedbackForm = function (el, onSubmit) {
    var p = CP.profile();
    var i;

    // course / category drop-down
    var options = '<option value="">Select</option>';
    for (i = 0; i < D.courses.length; i++) {
      options += "<option>" + esc(D.courses[i].title) + "</option>";
    }
    var extra = ["Jobs & Internships", "Resume Builder", "AI Career Advisor", "Overall experience"];
    for (i = 0; i < extra.length; i++) {
      options += "<option>" + extra[i] + "</option>";
    }

    // star rating (5 down to 1, so the CSS can highlight them)
    var stars = "";
    for (i = 5; i >= 1; i--) {
      stars += '<input type="radio" name="rating" id="star' + i + '" value="' + i + '">' +
        '<label for="star' + i + '" title="' + i + " star" + (i > 1 ? "s" : "") + '"><span class="sr-only">' + i + " stars</span>★</label>";
    }

    var html = '<form id="fbForm" class="card" novalidate style="gap:0"><h3 style="margin-bottom:4px">Share your feedback</h3>' +
      '<p style="margin-bottom:16px">Your feedback is stored only in this browser and shown on this page.</p>';
    html += '<div class="form-row">' + inputField("f-name", "name", "Name", true, ' value="' + esc(p.name) + '" autocomplete="name"') +
      '<div class="field"><label for="f-cat">Course or category <span class="req">*</span></label><select class="select" id="f-cat" name="cat">' + options +
      '</select><span class="err" data-err="cat"></span></div></div>';
    html += '<div class="field"><span style="font-size:.83rem;font-weight:600" id="rate-lbl">Rating <span class="req">*</span></span>' +
      '<div class="star-input" role="radiogroup" aria-labelledby="rate-lbl">' + stars + '</div><span class="err" data-err="rating"></span></div>';
    html += '<div class="field"><label for="f-text">Written feedback <span class="req">*</span></label>' +
      '<textarea class="textarea" id="f-text" name="text" maxlength="500" placeholder="What worked well? What could be better?"></textarea>' +
      '<span class="err" data-err="text"></span></div>';
    html += '<button class="btn btn-primary" type="submit">Submit Feedback</button></form>';
    el.innerHTML = html;

    var form = CP.$("#fbForm", el);
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var rated = form.querySelector('input[name="rating"]:checked');
      var good = CP.validate(form, {
        name: { required: true, min: 2 },
        cat: { required: true, msg: "Please choose a course or category." },
        text: { required: true, min: 15, msg: "Please write your feedback." }
      });
      CP.$('[data-err="rating"]', form).textContent = rated ? "" : "Please choose a star rating.";
      if (!good || !rated) {
        return;
      }

      var list = CP.store.get("feedback", []);
      list.unshift({
        name: form.elements.name.value.trim(),
        cat: form.elements.cat.value,
        rating: +rated.value,
        text: form.elements.text.value.trim(),
        date: Date.now()
      });
      CP.store.set("feedback", list);
      CP.log("Submitted feedback for " + form.elements.cat.value);
      form.reset();
      CP.toast("Thank you! Your feedback was added.");
      if (onSubmit) {
        onSubmit();
      }
    });
  };

  // The FAQ list (each question opens like an accordion).
  V.faq = function (el) {
    var html = "";
    for (var i = 0; i < D.faqs.length; i++) {
      html += "<details><summary>" + esc(D.faqs[i].q) + "</summary><p>" + esc(D.faqs[i].a) + "</p></details>";
    }
    el.innerHTML = html;
  };

  /* ---------- one click listener for every [data-action] button ---------- */
  document.addEventListener("click", function (e) {
    var button = e.target.closest("[data-action]");
    if (!button || button.disabled) {
      return;
    }
    var action = button.dataset.action;
    var id = button.dataset.id;
    var type = button.dataset.type;

    if (action === "apply" || action === "apply-from-co") {
      V.applyModal(type, find(listFor(type), id));
    } else if (action === "save") {
      var nowSaved = CP.saved.toggle(type, id);
      var item = find(listFor(type), id);
      refreshSaves();
      CP.toast(nowSaved ? "Saved: " + item.title : "Removed from saved");
      if (nowSaved) {
        CP.log("Saved " + item.title + " at " + item.company);
      }
    } else if (action === "course") {
      V.courseModal(id);
    } else if (action === "explore") {
      V.companyModal(id);
    } else if (action === "drive-details") {
      V.driveModal(id);
    } else if (action === "drive-register") {
      V.registerModal(id);
    }
  });
})();
