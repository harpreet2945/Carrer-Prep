/* ==========================================================
   CareerPrep app  (plain JavaScript)

   Contains: the AI advisor chat (rule based - it is NOT a real AI),
   the resume builder, interview preparation, coding practice and
   the student dashboard with its 16 screens.

   Everything is attached to CP.App (shortcut: App).
   ========================================================== */
(function () {
  "use strict";

  var CP = window.CP;
  var D = window.CPData;
  var V = CP.Views;
  var esc = CP.esc;
  var icon = CP.icon;
  var $ = CP.$;
  var $$ = CP.$$;
  var App = {};
  CP.App = App;

  // Read every named field of a form into a plain object.
  function formValues(form) {
    var values = {};
    for (var i = 0; i < form.elements.length; i++) {
      var field = form.elements[i];
      if (field.name) {
        values[field.name] = field.value;
      }
    }
    return values;
  }

  // An icon with a fixed size (used inside small buttons).
  function sizedIcon(name, size, extraStyle) {
    var style = "width:" + size + "px;height:" + size + "px;" + (extraStyle || "");
    return icon(name, "").replace("<svg", '<svg style="' + style + '"');
  }

  /* =========================================================
     AI CAREER ADVISOR  (rule based: it looks for key words)
     ========================================================= */

  // Make an HTML bullet list from an array of text.
  function ul(items) {
    var html = "<ul>";
    for (var i = 0; i < items.length; i++) {
      html += "<li>" + items[i] + "</li>";
    }
    return html + "</ul>";
  }

  // A link coloured with the accent colour.
  function link(href, text) {
    return '<a href="' + href + '" style="color:var(--accent)">' + text + "</a>";
  }

  // Each rule: "re" = words to look for, "ans" = function that returns the answer.
  // The FIRST rule that matches the question is used.
  var RULES = [
    {
      re: /web\s*dev|roadmap|front\s*-?end|website|html|css/i,
      ans: function () {
        return "<p>Here is a beginner-friendly <b>web development roadmap</b>:</p>" + ul([
          "<b>Weeks 1–2:</b> HTML5 semantics and CSS fundamentals (box model, flexbox, grid).",
          "<b>Weeks 3–4:</b> JavaScript basics — variables, functions, arrays, DOM events.",
          "<b>Weeks 5–6:</b> Build 2–3 projects: portfolio, to-do app, API-driven weather app.",
          "<b>Weeks 7–8:</b> Learn Git/GitHub, responsive design and accessibility.",
          "<b>Next:</b> A framework (React is common) or a backend (Node/Express + a database)."
        ]) + "<p>Start with the " + link("courses.html", "Web Development course") + " and publish your projects on GitHub.</p>";
      }
    },
    {
      re: /technical interview|coding interview|tech interview|technical round/i,
      ans: function () {
        return "<p>To prepare for a <b>technical interview</b>:</p>" + ul([
          "Revisit core subjects: OOP, DBMS, OS basics, networking basics.",
          "Practise DSA daily: arrays, strings, linked lists, stacks/queues, trees, sorting and searching.",
          "Be ready to explain every project: why you chose the tech, challenges, what you would improve.",
          "Think aloud while solving — interviewers value your approach, not just the answer.",
          "Do 2–3 mock interviews with a friend and review your weak topics."
        ]) + "<p>Try the " + link("dashboard.html#interview", "Interview Preparation") + " questions and " + link("dashboard.html#coding", "Coding Practice") + " quizzes.</p>";
      }
    },
    {
      re: /resume|cv\b|curriculum/i,
      ans: function () {
        return "<p>Tips to <b>improve your resume</b>:</p>" + ul([
          "Keep it to <b>one page</b> as a fresher with a clean, single-column layout.",
          "Start with a 2-line objective tailored to the role you are applying for.",
          "Lead with <b>projects</b>: name, tech stack and one measurable outcome each.",
          "Use action verbs (built, designed, optimised) and avoid long paragraphs.",
          "List skills honestly — only what you can discuss in an interview.",
          "Proofread for spelling, and use a professional email address."
        ]) + "<p>Use the " + link("dashboard.html#resume", "Resume Builder") + " to see a live preview and save it as PDF.</p>";
      }
    },
    {
      re: /placement|campus|prepare for placements?|get placed|drive/i,
      ans: function () {
        return "<p>A simple <b>placement preparation plan</b>:</p>" + ul([
          "<b>Aptitude (daily 30 min):</b> percentages, ratios, time &amp; work, number series, puzzles.",
          "<b>Coding (daily 1 hour):</b> start with arrays and strings, then linked lists and trees.",
          "<b>Core CS:</b> OOP, DBMS (SQL joins!), OS and networks — revise using interview Q&amp;A.",
          "<b>Resume &amp; projects:</b> keep 2–3 solid projects you can explain in depth.",
          "<b>Communication:</b> practise your self-introduction and the STAR method for HR rounds.",
          "<b>Track drives:</b> note eligibility and deadlines so you never miss registration."
        ]) + "<p>Check sample " + link("drives.html", "Placement Drives") + " to see typical eligibility and rounds.</p>";
      }
    },
    {
      re: /skill|learn next|what should i learn|upskill/i,
      ans: function () {
        var profile = CP.profile();
        var mine = (profile.skills || "").toLowerCase();

        var intro;
        if (mine) {
          intro = "<p>I see your profile lists: <b>" + esc(profile.skills) + "</b>. Building on that:</p>";
        } else {
          intro = "<p>Here is a balanced set of <b>skills to learn next</b>:</p>";
        }

        // suggest only the skills the student does not already list
        var picks = [];
        if (!/dsa|algorithm/.test(mine)) {
          picks.push("<b>Data Structures &amp; Algorithms</b> — the most common filter in technical rounds.");
        }
        if (!/sql|dbms/.test(mine)) {
          picks.push("<b>SQL &amp; databases</b> — useful in almost every software and analyst role.");
        }
        if (!/java|python/.test(mine)) {
          picks.push("<b>One main language</b> (Java or Python) learned deeply.");
        }
        if (!/git/.test(mine)) {
          picks.push("<b>Git &amp; GitHub</b> — collaboration basics employers expect.");
        }
        picks.push("<b>Web basics</b> (HTML, CSS, JS) to build visible projects.");
        picks.push("<b>Communication</b> — explaining your work clearly sets you apart.");

        return intro + ul(picks.slice(0, 5)) + "<p>Pick one and start from " + link("courses.html", "Courses") + ".</p>";
      }
    },
    {
      re: /\bhr\b|behaviou?r|tell me about yourself|strength|weakness|self[- ]intro/i,
      ans: function () {
        return "<p>For <b>HR interviews</b>:</p>" + ul([
          "Prepare a 60–90 second self-introduction: present → past → future.",
          "Use <b>STAR</b> (Situation, Task, Action, Result) for behavioural questions.",
          "Research the company and be ready to say why you want to work there.",
          "Prepare 2 thoughtful questions to ask the interviewer.",
          "Be honest, concise and positive — avoid criticising past teams or colleges."
        ]);
      }
    },
    {
      re: /aptitude|reasoning|quant|verbal/i,
      ans: function () {
        return "<p>For <b>aptitude and reasoning</b>:</p>" + ul([
          "Learn shortcuts for percentages, profit &amp; loss, ratios, time-speed-distance and time &amp; work.",
          "Practise in timed sets of 20 questions to build speed.",
          "Review mistakes in a notebook and revisit them weekly.",
          "Do puzzles and number series for logical reasoning."
        ]) + "<p>Try the " + link("dashboard.html#coding", "quiz section") + " to check your level.</p>";
      }
    },
    {
      re: /dsa|data structure|algorithm|leetcode/i,
      ans: function () {
        return "<p>A good <b>DSA study order</b>:</p>" + ul([
          "Time/space complexity (Big-O)",
          "Arrays &amp; strings → two pointers, sliding window",
          "Linked lists, stacks, queues",
          "Recursion → trees &amp; BST",
          "Sorting &amp; binary search",
          "Graphs (BFS/DFS) and basic dynamic programming"
        ]) + "<p>Aim for 1–2 problems a day and always review a cleaner solution afterwards.</p>";
      }
    },
    {
      re: /java\b|python|c\+\+|programming language/i,
      ans: function () {
        return "<p>Pick <b>one language</b> and go deep. Java is common in campus hiring for IT services firms; Python is excellent for beginners, automation and data/AI. " +
          "Learn syntax, OOP, collections/data structures and solve problems in it.</p>" +
          "<p>See the " + link("courses.html", "Java and Python courses") + ".</p>";
      }
    },
    {
      re: /internship|intern\b/i,
      ans: function () {
        return "<p>To land an <b>internship</b>:</p>" + ul([
          "Build 1–2 small projects first — they prove initiative.",
          "Tailor a one-page resume to each role.",
          "Apply early and to many places; track each application.",
          "Check official company careers pages and your college placement cell."
        ]) + "<p>Browse sample " + link("internships.html", "internships") + " to see typical requirements.</p>";
      }
    },
    {
      re: /project/i,
      ans: function () {
        return "<p>Good <b>fresher project ideas</b>:</p>" + ul([
          "Student portal or attendance tracker (CRUD + database)",
          "Expense tracker with charts",
          "Weather or news app using a public API",
          "Personal portfolio website",
          "Quiz app with score tracking"
        ]) + "<p>Host the code on GitHub with a clear README — recruiters notice that.</p>";
      }
    },
    {
      re: /^\s*(hi|hello|hey|hii|good (morning|evening|afternoon))\b/i,
      ans: function () {
        return "<p>Hello " + esc(CP.displayName().split(" ")[0]) + "! 👋 I can help with placements, skills, resumes, interviews and learning roadmaps. What would you like to explore?</p>";
      }
    },
    {
      re: /thank|thanks|thx/i,
      ans: function () {
        return "<p>You're welcome! Keep practising a little every day — consistency beats cramming. 🚀</p>";
      }
    },
    {
      re: /who are you|what can you do|help me\b|are you (an )?ai|real ai/i,
      ans: function () {
        return "<p>I'm a I can share structured guidance on placements, skills, resumes, " +
          "technical &amp; HR interviews, aptitude, DSA and web development. Try one of the suggested questions!</p>";
      }
    }
  ];

  // Shown when no rule matches.
  var FALLBACK = "<p>I'm a simple rule-based advisor, so I may not know that one. I can help with:</p>" + ul([
    "Placement preparation",
    "Skills to learn next",
    "Resume improvement",
    "Technical &amp; HR interviews",
    "Aptitude, DSA and web development roadmaps"
  ]) + "<p>Try rephrasing, or pick a suggested question.</p>";

  var SUGGESTED = [
    "How should I prepare for placements?",
    "Which skills should I learn next?",
    "Help me improve my resume.",
    "How can I prepare for a technical interview?",
    "Suggest a web development learning roadmap."
  ];

  // Find the first rule that matches the text and return its answer.
  App.advisorReply = function (text) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(text)) {
        return RULES[i].ans();
      }
    }
    return FALLBACK;
  };

  // Draw the chat screen into the element "el".
  App.advisor = function (el) {
    var i;

    // suggested-question buttons
    var suggestions = "";
    for (i = 0; i < SUGGESTED.length; i++) {
      suggestions += '<button type="button" data-q="' + esc(SUGGESTED[i]) + '">' +
        sizedIcon("msg", 15, "vertical-align:-2px;margin-right:8px;color:var(--accent)") + esc(SUGGESTED[i]) + "</button>";
    }

    el.innerHTML = '<div class="chat-layout"><aside><h2 style="font-size:1rem;margin-bottom:12px">Suggested questions</h2><div class="suggest" id="sug">' + suggestions + "</div>" +
      '<div class="notice" style="margin-top:16px;font-size:.78rem">Career guidance is general information and should be adapted to your goals.</div></aside>' +
      '<section class="card chat-box" aria-label="Career advisor chat"><div class="chat-head"><span class="avatar" style="width:40px;height:40px">' + sizedIcon("bot", 22) +
      '</span><div><b>CareerPrep Advisor</b><br><small style="color:var(--muted)">Career guidance assistant</small></div></div>' +
      '<div class="chat-log" id="log" role="log" aria-live="polite"></div>' +
      '<form class="chat-form" id="chatForm"><label class="sr-only" for="chatInput">Type your message</label>' +
      '<input class="input" id="chatInput" placeholder="Type your message…" autocomplete="off" maxlength="300">' +
      '<button class="btn btn-primary" type="submit" aria-label="Send message">' + sizedIcon("send", 18) + '<span class="hide-sm"> Send</span></button></form></section></div>';

    var log = $("#log", el);
    var form = $("#chatForm", el);
    var input = $("#chatInput", el);
    var busy = false;   // true while the advisor is "typing"

    // Add a chat bubble ("bot" or "user") and scroll down.
    function add(cls, html) {
      var bubble = document.createElement("div");
      bubble.className = "msg " + cls;
      bubble.innerHTML = html;
      log.appendChild(bubble);
      log.scrollTop = log.scrollHeight;
      return bubble;
    }

    add("bot", "<p>Hi " + esc(CP.displayName().split(" ")[0]) + "! 👋 I'm your <b>CareerPrep Advisor</b>.</p>" +
      "<p>Ask me about placements, skills, resumes or interviews — or tap a suggested question.</p>");

    // Send a question and show the answer after a short pause.
    function ask(q) {
      q = q.trim();
      if (!q || busy) {
        return;
      }
      busy = true;
      add("user", esc(q));
      input.value = "";
      var typing = add("bot", '<span class="typing" aria-label="Advisor is typing"><i></i><i></i><i></i></span>');

      setTimeout(function () {
        typing.innerHTML = App.advisorReply(q);
        log.scrollTop = log.scrollHeight;
        busy = false;
      }, 650);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ask(input.value);
    });
    $("#sug", el).addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]");
      if (b) {
        ask(b.dataset.q);
      }
    });
  };

  /* =========================================================
     RESUME BUILDER
     ========================================================= */
  var RESUME_SAMPLE = {
    name: "Sample Student",
    email: "sample.student@example.com",
    phone: "+91 90000 00000",
    objective: "Motivated final-year computer science student seeking an entry-level software developer role where I can apply my programming skills and keep learning.",
    degree: "B.Tech in Computer Science",
    college: "Sample Institute of Technology",
    year: "2023 – 2027",
    cgpa: "8.2 / 10",
    skills: "Java, Python, SQL, HTML, CSS, JavaScript, Git",
    projects: "Student Attendance Tracker — Built a web app to record and report attendance using HTML, CSS and JavaScript.\nExpense Tracker — Created a budgeting app with charts and local storage.",
    experience: "Web Development Intern (sample) — Assisted in building responsive pages and fixing UI bugs.",
    certs: "Java Programming Fundamentals (sample)\nSQL for Beginners (sample)"
  };

  // Split a text box into a list of non-empty lines.
  function lines(text) {
    var parts = text.split(/\n+/);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].trim() !== "") {
        out.push(parts[i].trim());
      }
    }
    return out;
  }

  // A resume section: heading + body (nothing if the body is empty).
  function sec(title, body) {
    if (!body) {
      return "";
    }
    return "<h2>" + title + "</h2>" + body;
  }

  // A bullet list from lines of text. If bold is true, text before " — " is bold.
  function bulletList(list, bold) {
    if (list.length === 0) {
      return "";
    }
    var html = "<ul>";
    for (var i = 0; i < list.length; i++) {
      var line = list[i];
      var pos = line.indexOf(" — ");
      if (bold && pos > 0) {
        html += "<li><b>" + esc(line.slice(0, pos)) + "</b> — " + esc(line.slice(pos + 3)) + "</li>";
      } else {
        html += "<li>" + esc(line) + "</li>";
      }
    }
    return html + "</ul>";
  }

  App.resume = function (el) {
    // start with empty fields, then fill in what was saved earlier
    var saved = Object.assign({
      name: "", email: "", phone: "", objective: "", degree: "", college: "",
      year: "", cgpa: "", skills: "", projects: "", experience: "", certs: ""
    }, CP.store.get("resume", {}));

    // One labelled form field. type "textarea" makes a big text box.
    function f(id, label, type, placeholder, hint) {
      var html = '<div class="field"><label for="rb-' + id + '">' + label + "</label>";
      if (type === "textarea") {
        html += '<textarea class="textarea" id="rb-' + id + '" name="' + id + '" placeholder="' + esc(placeholder || "") + '">' + esc(saved[id]) + "</textarea>";
      } else {
        html += '<input class="input" id="rb-' + id + '" name="' + id + '" type="' + (type || "text") + '" placeholder="' + esc(placeholder || "") + '" value="' + esc(saved[id]) + '">';
      }
      if (hint) {
        html += '<span class="hint">' + hint + "</span>";
      }
      return html + "</div>";
    }

    var formHtml = '<form class="card resume-form" id="rbForm" novalidate autocomplete="off">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap" class="no-print">' +
      '<button type="button" class="btn btn-sm" id="rbSample">Load sample content</button>' +
      '<button type="button" class="btn btn-sm" id="rbProfile">Use my profile</button>' +
      '<button type="button" class="btn btn-sm btn-danger" id="rbClear">Clear</button></div>';
    formHtml += "<h3>Personal details</h3>" + f("name", "Full name", "text", "e.g. Priya Sharma");
    formHtml += '<div class="form-row">' + f("email", "Email", "email", "you@example.com") + f("phone", "Phone", "tel", "+91 …") + "</div>";
    formHtml += "<h3>Career objective</h3>" + f("objective", "Objective", "textarea", "1–2 lines about the role you want", "Keep it short and specific.");
    formHtml += "<h3>Education</h3>" + f("degree", "Degree / course", "text", "B.Tech in Computer Science") + f("college", "College / university", "text");
    formHtml += '<div class="form-row">' + f("year", "Years", "text", "2023 – 2027") + f("cgpa", "CGPA / percentage", "text", "8.2 / 10") + "</div>";
    formHtml += "<h3>Technical skills</h3>" + f("skills", "Skills", "text", "Java, Python, SQL…", "Separate skills with commas.");
    formHtml += "<h3>Projects</h3>" + f("projects", "Projects", "textarea", "Project name — what you built and the tech used", "One project per line.");
    formHtml += "<h3>Experience</h3>" + f("experience", "Experience / internships", "textarea", "Role — what you did", "One entry per line. Leave blank if none yet.");
    formHtml += "<h3>Certifications</h3>" + f("certs", "Certifications", "textarea", "Certification name — issuer", "One per line.");
    formHtml += '<div class="notice no-print">The resume stays on your device. Nothing is uploaded to employers.</div></form>';

    var previewHtml = '<div><div class="no-print" style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" type="button" id="rbPrint">🖨 Print / Save as PDF</button>' +
      '<span class="hint" style="align-self:center">Tip: choose “Save as PDF” as the destination.</span></div>' +
      '<div class="resume-sheet" id="resumeSheet" aria-label="Resume preview"></div></div>';

    el.innerHTML = '<div class="resume-layout">' + formHtml + previewHtml + "</div>";

    var form = $("#rbForm", el);
    var sheet = $("#resumeSheet", el);

    // Redraw the resume preview from the form, and save the form.
    function draw() {
      var v = formValues(form);
      CP.store.set("resume", v);

      // email | phone
      var contactParts = [];
      if (v.email) {
        contactParts.push(esc(v.email));
      }
      if (v.phone) {
        contactParts.push(esc(v.phone));
      }
      var contact = contactParts.join("  |  ");

      // name
      var html = "<h1>" + (v.name.trim() ? esc(v.name) : '<span class="r-ph">Your Name</span>') + "</h1>";
      html += '<div class="r-contact">' + (contact || '<span class="r-ph">email@example.com | phone</span>') + "</div>";

      // objective
      if (v.objective.trim()) {
        html += sec("Career Objective", "<p>" + esc(v.objective) + "</p>");
      } else {
        html += sec("Career Objective", '<p class="r-ph">Add a short objective…</p>');
      }

      // education
      if (v.degree || v.college) {
        var edu = "<p><b>" + esc(v.degree || "Degree") + "</b>";
        if (v.year) {
          edu += " — " + esc(v.year);
        }
        edu += "<br>" + esc(v.college);
        if (v.cgpa) {
          edu += " · CGPA: " + esc(v.cgpa);
        }
        html += sec("Education", edu + "</p>");
      } else {
        html += sec("Education", '<p class="r-ph">Add your education…</p>');
      }

      // skills (comma separated -> "A · B · C")
      if (v.skills.trim()) {
        var skillList = v.skills.split(",");
        var skillText = [];
        for (var i = 0; i < skillList.length; i++) {
          if (skillList[i].trim() !== "") {
            skillText.push(esc(skillList[i].trim()));
          }
        }
        html += sec("Technical Skills", "<p>" + skillText.join(" · ") + "</p>");
      }

      html += sec("Projects", bulletList(lines(v.projects), true));
      html += sec("Experience", bulletList(lines(v.experience), false));
      html += sec("Certifications", bulletList(lines(v.certs), false));

      sheet.innerHTML = html;
    }

    // Put values from an object into the form boxes.
    function fill(obj) {
      for (var key in obj) {
        if (form.elements[key]) {
          form.elements[key].value = obj[key];
        }
      }
      draw();
    }

    form.addEventListener("input", draw);

    $("#rbSample", el).addEventListener("click", function () {
      fill(RESUME_SAMPLE);
      CP.toast("Sample content loaded — replace it with your own.");
    });

    $("#rbProfile", el).addEventListener("click", function () {
      var p = CP.profile();
      fill({ name: p.name, email: p.email, phone: p.phone, college: p.college, degree: p.degree, skills: p.skills });
      CP.toast("Profile details copied.");
    });

    $("#rbClear", el).addEventListener("click", function () {
      for (var key in saved) {
        form.elements[key].value = "";
      }
      draw();
    });

    $("#rbPrint", el).addEventListener("click", function () {
      CP.log("Printed / saved resume as PDF");
      window.print();
    });

    draw();
  };

  /* =========================================================
     INTERVIEW PREPARATION
     ========================================================= */
  App.interview = function (el) {
    var cats = Object.keys(D.interview);   // topic names
    var current = cats[0];                  // topic that is open now

    // saved progress: { topicName: [question numbers practised] }
    function progress() {
      return CP.store.get("iprog", {});
    }

    // [practised, total] for one topic
    function counts(topic) {
      var practised = progress()[topic] || [];
      return [practised.length, D.interview[topic].length];
    }

    function draw() {
      var i;

      // overall numbers
      var total = 0;
      var done = 0;
      for (i = 0; i < cats.length; i++) {
        total += counts(cats[i])[1];
        done += counts(cats[i])[0];
      }
      var pct = Math.round((done / total) * 100);
      var here = counts(current);

      // progress bar
      var html = '<div class="card" style="margin-bottom:22px"><div class="progress-row"><span>Overall preparation progress</span><span>' +
        done + " of " + total + " questions practised (" + pct + '%)</span></div><div class="progress"><i style="width:' + pct + '%"></i></div></div>';

      // topic buttons
      html += '<div class="chips" role="tablist" aria-label="Interview topics">';
      for (i = 0; i < cats.length; i++) {
        var isCurrent = cats[i] === current;
        html += '<button type="button" role="tab" aria-selected="' + isCurrent + '" class="chip' + (isCurrent ? " active" : "") + '" data-cat="' + esc(cats[i]) + '">' +
          esc(cats[i]) + " (" + counts(cats[i])[0] + "/" + counts(cats[i])[1] + ")</button>";
      }
      html += "</div>";

      html += '<p class="result-count">' + esc(current) + ": " + here[0] + " of " + here[1] + " practised. Try answering aloud before opening the model answer.</p>";

      // questions (each one opens to show the answer)
      html += '<div style="display:flex;flex-direction:column;gap:12px">';
      var practisedList = progress()[current] || [];
      for (i = 0; i < D.interview[current].length; i++) {
        var qa = D.interview[current][i];
        var on = practisedList.indexOf(i) >= 0;
        html += '<details class="qa-item"><summary><span>' + esc(qa[0]) + "</span>" + (on ? '<span class="badge ok">Practised</span>' : "") + "</summary>" +
          '<div class="ans"><p>' + esc(qa[1]) + "</p>" +
          '<label style="display:flex;gap:8px;align-items:center;margin-top:12px;color:var(--text);font-size:.85rem;cursor:pointer">' +
          '<input type="checkbox" data-practised="' + i + '"' + (on ? " checked" : "") + "> Mark as practised</label></div></details>";
      }
      html += "</div>";

      el.innerHTML = html;
    }

    // click on a topic button
    el.addEventListener("click", function (e) {
      var topicButton = e.target.closest("[data-cat]");
      if (topicButton) {
        current = topicButton.dataset.cat;
        draw();
      }
    });

    // tick / untick "Mark as practised"
    el.addEventListener("change", function (e) {
      if (e.target.dataset.practised === undefined) {
        return;
      }
      var all = progress();
      var number = +e.target.dataset.practised;
      all[current] = all[current] || [];

      if (e.target.checked && all[current].indexOf(number) < 0) {
        all[current].push(number);
      } else if (!e.target.checked) {
        var kept = [];
        for (var i = 0; i < all[current].length; i++) {
          if (all[current][i] !== number) {
            kept.push(all[current][i]);
          }
        }
        all[current] = kept;
      }
      CP.store.set("iprog", all);

      // redraw, but keep the questions that were open still open
      var wasOpen = [];
      var boxes = $$("details", el);
      for (var j = 0; j < boxes.length; j++) {
        wasOpen.push(boxes[j].open);
      }
      draw();
      boxes = $$("details", el);
      for (var k = 0; k < boxes.length; k++) {
        boxes[k].open = wasOpen[k];
      }

      if (e.target.checked) {
        CP.log("Practised an interview question (" + current + ")");
      }
    });

    draw();
  };

  /* =========================================================
     CODING PRACTICE (multiple-choice quiz + JavaScript problems)
     ========================================================= */

  // Run the student's code against the problem's tests.
  // Returns { error: "..." }  or  { res: [ {ok, out, err}, ... ] }
  // Note: the code runs right here in the page, so an endless loop
  // (like while(true) with no break) would freeze this tab.
  function runTests(problem, code) {
    var fn;

    // 1) turn the student's text into a real function
    try {
      fn = new Function(code + "\nreturn " + problem.fn + ";")();
    } catch (err) {
      return { error: String(err) };
    }

    // 2) call it once for every test
    var results = [];
    for (var i = 0; i < problem.tests.length; i++) {
      var test = problem.tests[i];       // [ [inputs], expectedOutput ]
      try {
        var out = fn.apply(null, test[0]);
        results.push({
          ok: JSON.stringify(out) === JSON.stringify(test[1]),
          out: out === undefined ? "undefined" : out
        });
      } catch (err2) {
        results.push({ ok: false, err: String(err2) });
      }
    }
    return { res: results };
  }

  App.coding = function (el) {
    var tab = "quiz";   // "quiz" or "code"

    // saved quiz answers: { questionId: chosenOptionNumber }
    function qs() {
      return CP.store.get("quiz", {});
    }
    // ids of solved problems
    function sol() {
      return CP.store.get("solved", []);
    }

    // numbers for the score banner
    function overall() {
      var answers = qs();
      var answered = Object.keys(answers).length;
      var correct = 0;
      for (var i = 0; i < D.mcqs.length; i++) {
        if (answers[D.mcqs[i].id] === D.mcqs[i].a) {
          correct++;
        }
      }
      var solved = sol().length;
      var total = D.mcqs.length + D.problems.length;
      var pct = Math.round(((answered + solved) / total) * 100);
      return { answered: answered, correct: correct, solved: solved, pct: pct };
    }

    function header() {
      var o = overall();
      return '<div class="card" style="margin-bottom:22px"><div class="score-banner">' +
        '<div><div class="big">' + o.correct + "/" + D.mcqs.length + '</div><small style="color:var(--muted)">Quiz score</small></div>' +
        '<div><div class="big">' + o.solved + "/" + D.problems.length + '</div><small style="color:var(--muted)">Problems solved</small></div>' +
        '<div style="flex:1;min-width:200px"><div class="progress-row"><span>Practice progress</span><span>' + o.pct + '%</span></div><div class="progress"><i style="width:' + o.pct + '%"></i></div></div>' +
        '<button class="btn btn-sm btn-danger" data-reset type="button">Reset progress</button></div></div>';
    }

    // the multiple-choice questions
    function quizHTML() {
      var answers = qs();
      var html = '<div class="grid grid-2">';

      for (var q = 0; q < D.mcqs.length; q++) {
        var m = D.mcqs[q];
        var chosen = answers[m.id];
        var answered = chosen !== undefined;

        html += '<article class="card q-card" data-q="' + m.id + '"><div class="card-badge-row"><span class="badge">Question ' + (q + 1) + "</span>";
        if (answered) {
          html += '<span class="badge ' + (chosen === m.a ? "ok" : "danger") + '">' + (chosen === m.a ? "Correct" : "Incorrect") + "</span>";
        }
        html += "</div><h3>" + esc(m.q) + '</h3><div class="opts" role="group" aria-label="Answer options">';

        // the four answer buttons
        for (var i = 0; i < m.opts.length; i++) {
          var cls = "opt";
          if (answered && i === m.a) {
            cls += " correct";
          }
          if (answered && i === chosen && chosen !== m.a) {
            cls += " wrong";
          }
          html += '<button type="button" class="' + cls + '" data-opt="' + i + '"' + (answered ? " disabled" : "") + "><b>" + "ABCD".charAt(i) + ".</b> <span>" + esc(m.opts[i]) + "</span></button>";
        }
        html += "</div>";

        if (answered) {
          html += '<div class="explain"><b>' + (chosen === m.a ? "✓ " : "✗ ") + "Explanation:</b> " + esc(m.why) + "</div>";
        } else {
          html += '<button type="button" class="btn btn-sm btn-ghost" data-hint="' + m.id + '">💡 Show hint</button><div class="explain hidden" data-hint-box>' + esc(m.hint) + "</div>";
        }
        html += "</article>";
      }
      return html + "</div>";
    }

    // the coding problems
    function probHTML() {
      var solvedIds = sol();
      var html = '<div style="display:flex;flex-direction:column;gap:22px">';

      for (var i = 0; i < D.problems.length; i++) {
        var p = D.problems[i];
        var solved = solvedIds.indexOf(p.id) >= 0;
        var code = CP.store.get("code_" + p.id, p.starter);   // the student's last code

        html += '<article class="card" data-p="' + p.id + '"><div class="card-badge-row"><h3>' + esc(p.title) + '</h3><span class="badge ' + (solved ? "ok" : "") + '">' + (solved ? "Solved ✓" : p.level) + "</span></div>";
        html += "<p>" + p.prompt + '</p><label class="sr-only" for="code-' + p.id + '">Your code</label>';
        html += '<textarea class="textarea" id="code-' + p.id + '" spellcheck="false" style="font-family:Consolas,monospace;min-height:150px;font-size:.84rem;tab-size:2">' + esc(code) + "</textarea>";
        html += '<div class="card-actions" style="flex:none"><button class="btn btn-primary btn-sm" type="button" data-run="' + p.id + '" style="flex:none">▶ Run tests</button>';
        html += '<button class="btn btn-sm" type="button" data-phint="' + p.id + '" style="flex:none">💡 Hint</button>';
        html += '<button class="btn btn-sm" type="button" data-sol="' + p.id + '" style="flex:none">Show sample solution</button></div><div data-out></div></article>';
      }
      return html + "</div>";
    }

    function draw() {
      var html = header();
      html += '<div class="tabs" role="tablist">' +
        '<button type="button" role="tab" class="tab' + (tab === "quiz" ? " active" : "") + '" data-tab="quiz" aria-selected="' + (tab === "quiz") + '">Multiple-choice quiz</button>' +
        '<button type="button" role="tab" class="tab' + (tab === "code" ? " active" : "") + '" data-tab="code" aria-selected="' + (tab === "code") + '">Coding problems (JavaScript)</button></div>';
      html += (tab === "quiz") ? quizHTML() : probHTML();
      el.innerHTML = html;
    }

    // Show the test results under a problem.
    function showResults(card, p, r) {
      var out = $("[data-out]", card);

      if (r.error) {
        out.innerHTML = '<div class="explain" style="margin-top:12px;border-color:var(--danger)"><b>Error:</b> ' + esc(r.error) + "</div>";
        return false;
      }

      var passed = 0;
      for (var i = 0; i < r.res.length; i++) {
        if (r.res[i].ok) {
          passed++;
        }
      }
      var allPassed = passed === r.res.length;

      var html = '<div style="margin-top:12px"><b>' + (allPassed ? "✅ All tests passed!" : "❌ " + passed + " of " + r.res.length + " tests passed") + '</b><div class="lesson-list">';
      for (var t = 0; t < r.res.length; t++) {
        var x = r.res[t];
        var args = [];
        for (var a = 0; a < p.tests[t][0].length; a++) {
          args.push(JSON.stringify(p.tests[t][0][a]));
        }
        html += '<div class="lesson' + (x.ok ? " done" : "") + '" style="cursor:default"><span class="num">' + (x.ok ? "✓" : "✗") + "</span>" +
          '<span style="flex:1;font-size:.84rem"><code class="inline">' + esc(p.fn + "(" + args.join(", ") + ")") + "</code> → expected " +
          '<code class="inline">' + esc(JSON.stringify(p.tests[t][1])) + "</code>";
        if (!x.ok) {
          html += ', got <code class="inline">' + esc(x.err || JSON.stringify(x.out)) + "</code>";
        }
        html += "</span></div>";
      }
      out.innerHTML = html + "</div></div>";
      return allPassed;
    }

    el.addEventListener("click", function (e) {
      var t = e.target;
      var i;

      // switch between Quiz and Coding tabs
      var tabButton = t.closest("[data-tab]");
      if (tabButton) {
        tab = tabButton.dataset.tab;
        draw();
        return;
      }

      // reset everything
      if (t.closest("[data-reset]")) {
        if (confirm("Reset your quiz answers and solved problems?")) {
          CP.store.set("quiz", {});
          CP.store.set("solved", []);
          for (i = 0; i < D.problems.length; i++) {
            CP.store.remove("code_" + D.problems[i].id);
          }
          draw();
        }
        return;
      }

      // choose an answer in the quiz
      var optButton = t.closest("[data-opt]");
      if (optButton) {
        var qid = optButton.closest("[data-q]").dataset.q;
        var answers = qs();
        answers[qid] = +optButton.dataset.opt;
        CP.store.set("quiz", answers);
        var question = null;
        for (i = 0; i < D.mcqs.length; i++) {
          if (D.mcqs[i].id === qid) {
            question = D.mcqs[i];
          }
        }
        CP.log((answers[qid] === question.a ? "Answered correctly: " : "Attempted: ") + "quiz question");
        draw();
        return;
      }

      // show a quiz hint
      var hintButton = t.closest("[data-hint]");
      if (hintButton) {
        $("[data-hint-box]", hintButton.closest("article")).classList.remove("hidden");
        hintButton.remove();
        return;
      }

      // everything below belongs to a coding problem card
      var card = t.closest("[data-p]");
      if (!card) {
        return;
      }
      var p = null;
      for (i = 0; i < D.problems.length; i++) {
        if (D.problems[i].id === card.dataset.p) {
          p = D.problems[i];
        }
      }
      var out = $("[data-out]", card);
      var textarea = $("textarea", card);

      if (t.closest("[data-phint]")) {
        out.innerHTML = '<div class="explain" style="margin-top:12px">💡 ' + esc(p.hint) + "</div>";
      } else if (t.closest("[data-sol]")) {
        out.innerHTML = '<div style="margin-top:12px"><b style="font-size:.85rem">Sample solution</b><pre><code>' + esc(p.solution) + "</code></pre></div>";
      } else if (t.closest("[data-run]")) {
        CP.store.set("code_" + p.id, textarea.value);
        var result = runTests(p, textarea.value);
        var allPassed = showResults(card, p, result);

        // first time solved: remember it and refresh the banner
        if (allPassed && sol().indexOf(p.id) < 0) {
          var solved = sol();
          solved.push(p.id);
          CP.store.set("solved", solved);
          CP.log("Solved coding problem: " + p.title);
          CP.toast("Problem solved! 🎉");
          setTimeout(function () {
            var y = window.scrollY;
            draw();
            window.scrollTo(0, y);
          }, 900);
        }
      }
    });

    // Pressing Tab inside the code box types two spaces
    el.addEventListener("keydown", function (e) {
      var box = e.target;
      if (e.key === "Tab" && box.tagName === "TEXTAREA" && box.id.indexOf("code-") === 0 && !e.shiftKey) {
        e.preventDefault();
        var start = box.selectionStart;
        box.value = box.value.slice(0, start) + "  " + box.value.slice(box.selectionEnd);
        box.selectionStart = start + 2;
        box.selectionEnd = start + 2;
      }
    });

    draw();
  };

  /* =========================================================
     DASHBOARD
     ========================================================= */

  // [url name, label, icon]  - the sidebar menu
  var ROUTES = [
    ["overview", "Overview", "home"],
    ["applications", "My Applications", "file"],
    ["saved", "Saved Jobs", "bookmark"],
    ["courses", "Courses", "book"],
    ["internships", "Internships", "cap"],
    ["jobs", "Jobs", "brief"],
    ["companies", "Companies", "building"],
    ["drives", "Placement Drives", "cal"],
    ["resume", "Resume Builder", "layers"],
    ["interview", "Interview Preparation", "users"],
    ["coding", "Coding Practice", "code"],
    ["feedback", "Student Feedback", "msg"],
    ["notifications", "Notifications", "bell"],
    ["profile", "Profile", "user"],
    ["settings", "Settings", "cog"],
    ["help", "Help & Support", "help"]
  ];

  // How many notifications are still unread?
  function unread() {
    var read = CP.store.get("notifRead", []);
    var count = 0;
    for (var i = 0; i < D.notifications.length; i++) {
      if (read.indexOf(D.notifications[i].id) < 0) {
        count++;
      }
    }
    return count;
  }

  function greeting() {
    var hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    }
    if (hour < 17) {
      return "Good Afternoon";
    }
    return "Good Evening";
  }

  // A card with a title and some inner HTML.
  function card(title, inner, extra) {
    return '<section class="card" ' + (extra || "") + '><div class="card-badge-row"><h3>' + title + "</h3></div>" + inner + "</section>";
  }

  // A progress bar with a label and a percentage.
  function bar(label, pct) {
    return '<div style="margin-top:6px"><div class="progress-row"><span>' + esc(label) + "</span><span>" + pct + '%</span></div>' +
      '<div class="progress"><i style="width:' + pct + '%"></i></div></div>';
  }

  // A friendly "nothing here yet" box with an optional button.
  function emptyBox(title, text, linkHref, linkText) {
    var html = '<div class="empty"><h3>' + title + "</h3>";
    if (text) {
      html += "<p>" + text + "</p>";
    }
    if (linkHref) {
      html += '<a class="btn btn-primary btn-sm" href="' + linkHref + '" style="margin-top:14px">' + linkText + "</a>";
    }
    return html + "</div>";
  }

  // Courses sorted so the furthest-along course comes first.
  function coursesByProgress() {
    return D.courses.slice().sort(function (a, b) {
      return CP.courseProgress(b) - CP.courseProgress(a);
    });
  }

  // Sample drives that are still open for registration, nearest deadline first.
  function upcomingDrives() {
    var list = [];
    for (var i = 0; i < D.drives.length; i++) {
      if (D.drives[i].regOffset >= 0) {
        list.push(D.drives[i]);
      }
    }
    return list.sort(function (a, b) {
      return a.regOffset - b.regOffset;
    });
  }

  // The dashboard screens. Each one receives "c", the content area.
  var VIEWS = {};

  VIEWS.overview = function (c) {
    var name = CP.displayName();
    var appCount = CP.apps.all().length;
    var savedCount = CP.saved.count();
    var i;

    // average course progress
    var sum = 0;
    for (i = 0; i < D.courses.length; i++) {
      sum += CP.courseProgress(D.courses[i]);
    }
    var avg = Math.round(sum / D.courses.length);

    var deadlines = upcomingDrives();
    var activity = CP.store.get("activity", []);

    // up to 3 courses that are not finished
    var recs = [];
    var sorted = coursesByProgress();
    for (i = 0; i < sorted.length; i++) {
      if (CP.courseProgress(sorted[i]) < 100 && recs.length < 3) {
        recs.push(sorted[i]);
      }
    }

    // one of the four number boxes at the top
    function kpi(ic, number, label, href) {
      return '<a class="card kpi" href="' + href + '"><span class="ico">' + icon(ic) + "</span><div><b>" + number + "</b><span>" + label + "</span></div></a>";
    }

    var html = "<h1>" + greeting() + ", " + esc(name.split(" ")[0]) + '! 👋</h1><p class="lead">Keep going — your hard work today builds your dream career tomorrow.</p>';
    html += '<div class="dash-grid-4">' + kpi("file", appCount, "Applications", "#applications") + kpi("bookmark", savedCount, "Saved opportunities", "#saved") +
      kpi("chart", avg + "%", "Learning progress", "#courses") + kpi("cal", deadlines.length, "Upcoming deadlines (sample)", "#drives") + "</div>";

    // Learning progress card
    var progressHtml = "";
    for (i = 0; i < sorted.length && i < 4; i++) {
      progressHtml += bar(sorted[i].title, CP.courseProgress(sorted[i]));
    }
    progressHtml += '<a class="view-all" href="#courses" style="margin-top:6px">View all courses →</a>';

    // Upcoming deadlines card
    var deadlineHtml = "";
    for (i = 0; i < deadlines.length && i < 4; i++) {
      var d = deadlines[i];
      var badge = "muted";
      if (d.status === "Closing Soon") {
        badge = "warn";
      } else if (d.status === "Registration Open") {
        badge = "ok";
      }
      deadlineHtml += '<div class="list-row"><span class="logo-tile" style="width:38px;height:38px;border-radius:11px;font-size:.78rem;background:' + (D.colors[d.company] || "#0d9488") + '">' +
        esc(CP.initials(d.company)) + '</span><div class="grow"><b>' + esc(d.company) + " drive</b><small>Register by " + CP.fmtDate(CP.dayOffset(d.regOffset)) +
        '</small></div><span class="badge ' + badge + '">' + esc(d.status) + "</span></div>";
    }
    if (deadlineHtml === "") {
      deadlineHtml = "<p>No upcoming deadlines.</p>";
    }

    html += '<div class="dash-grid-2">' + card("Learning Progress", progressHtml) + card("Upcoming Deadlines <span class='badge sample'>Sample</span>", deadlineHtml) + "</div>";

    // Recommended courses card
    var recHtml = '<div class="grid grid-3" style="gap:12px">';
    for (i = 0; i < recs.length; i++) {
      var x = recs[i];
      recHtml += '<div class="card" style="padding:14px;box-shadow:none"><b style="font-size:.88rem">' + esc(x.title) + '</b><small style="color:var(--muted)">' + esc(x.level) + " · " + esc(x.duration) +
        '</small><button class="btn btn-primary btn-sm" data-action="course" data-id="' + x.id + '" style="margin-top:auto">' + (CP.courseProgress(x) ? "Continue" : "Start Learning") + "</button></div>";
    }
    recHtml += "</div>";

    // Recent activity card
    var activityHtml = "";
    for (i = 0; i < activity.length && i < 5; i++) {
      activityHtml += '<div class="list-row"><div class="grow">' + esc(activity[i].text) + "<small>" + CP.ago(activity[i].ts) + "</small></div></div>";
    }
    if (activityHtml === "") {
      activityHtml = "<p>No activity yet. Apply to a sample job, save an internship or complete a lesson and it will show up here.</p>";
    }

    html += '<div class="dash-grid-2" style="grid-template-columns:1.3fr 1fr">' + card("Recommended For You", recHtml) + card("Recent Activity", activityHtml) + "</div>";
    c.innerHTML = html;
  };

  VIEWS.applications = function (c) {
    var apps = CP.apps.all();
    var regs = CP.store.get("driveRegs", []);
    var i;

    var html = '<h1>My Applications</h1><p class="lead">Your applications saved in this browser.</p>';

    if (apps.length > 0) {
      html += '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th>Ref</th><th>Role</th><th>Company</th><th>Type</th><th>Applied</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>';
      for (i = 0; i < apps.length; i++) {
        var a = apps[i];
        html += "<tr><td>" + esc(a.id) + "</td><td><b>" + esc(a.title) + "</b></td><td>" + esc(a.company) + "</td><td>" + esc(a.type) + "</td><td>" + CP.fmtDate(a.date) +
          '</td><td><span class="badge warn">' + esc(a.status) + '</span></td><td><button class="btn btn-sm btn-danger" data-withdraw="' + esc(a.id) + '">Withdraw</button></td></tr>';
      }
      html += "</tbody></table></div></div>";
    } else {
      html += emptyBox("No applications yet", "Browse available listings to get started.", "#jobs", "Browse jobs");
    }

    html += '<h2 style="font-size:1.15rem;margin:30px 0 14px">Placement drive registrations</h2>';
    if (regs.length > 0) {
      html += '<div class="card"><div class="table-wrap"><table class="tbl"><thead><tr><th>Company</th><th>Drive</th><th>Registered</th></tr></thead><tbody>';
      for (i = 0; i < regs.length; i++) {
        html += "<tr><td>" + esc(regs[i].company) + "</td><td>" + esc(regs[i].title) + "</td><td>" + CP.fmtDate(regs[i].date) + "</td></tr>";
      }
      html += "</tbody></table></div></div>";
    } else {
      html += '<div class="empty"><p>No placement drive registrations yet.</p></div>';
    }
    c.innerHTML = html;

    // Withdraw button: remove that application
    c.onclick = function (e) {
      var button = e.target.closest("[data-withdraw]");
      if (!button) {
        return;
      }
      var keep = [];
      var all = CP.apps.all();
      for (var j = 0; j < all.length; j++) {
        if (all[j].id !== button.dataset.withdraw) {
          keep.push(all[j]);
        }
      }
      CP.store.set("apps", keep);
      CP.toast("Application withdrawn.");
      VIEWS.applications(c);
      document.dispatchEvent(new CustomEvent("cp:state"));
    };
  };

  VIEWS.saved = function (c) {
    var s = CP.saved.all();
    var jobs = [];
    var interns = [];
    var i;
    for (i = 0; i < D.jobs.length; i++) {
      if (s.jobs.indexOf(D.jobs[i].id) >= 0) {
        jobs.push(D.jobs[i]);
      }
    }
    for (i = 0; i < D.internships.length; i++) {
      if (s.internships.indexOf(D.internships[i].id) >= 0) {
        interns.push(D.internships[i]);
      }
    }

    var html = '<h1>Saved Jobs</h1><p class="lead">Opportunities you bookmarked. Unsave them any time.</p>';

    html += '<h2 style="font-size:1.15rem;margin-bottom:14px">Saved jobs (' + jobs.length + ")</h2>";
    if (jobs.length > 0) {
      html += '<div class="grid grid-3">';
      for (i = 0; i < jobs.length; i++) {
        html += V.cards.job(jobs[i]);
      }
      html += "</div>";
    } else {
      html += emptyBox("No saved jobs", "Tap “Save Job” on any listing.", "#jobs", "Browse jobs");
    }

    html += '<h2 style="font-size:1.15rem;margin:30px 0 14px">Saved internships (' + interns.length + ")</h2>";
    if (interns.length > 0) {
      html += '<div class="grid grid-3">';
      for (i = 0; i < interns.length; i++) {
        html += V.cards.intern(interns[i]);
      }
      html += "</div>";
    } else {
      html += emptyBox("No saved internships", "", "#internships", "Browse internships");
    }
    c.innerHTML = html;
  };

  // The next few screens just show a page title and one of the shared lists.
  VIEWS.courses = function (c) {
    c.innerHTML = '<h1>Courses</h1><p class="lead">Structured lessons with sample content. Your progress is saved in this browser.</p><div id="m"></div>';
    var list = V.courses($("#m", c));
    V.refreshCourses = function () {
      list.redraw();
    };
  };

  VIEWS.internships = function (c) {
    c.innerHTML = '<h1>Internships</h1><p class="lead">Explore internship opportunities.</p><div id="m"></div>';
    V.internships($("#m", c));
  };

  VIEWS.jobs = function (c) {
    c.innerHTML = '<h1>Jobs</h1><p class="lead">Explore jobs. Use “★ Saved only” to see your saved jobs.</p><div id="m"></div>';
    V.jobs($("#m", c));
  };

  VIEWS.companies = function (c) {
    c.innerHTML = '<h1>Companies</h1><p class="lead">Explore company profiles.</p><div id="m"></div>';
    V.companies($("#m", c));
  };

  VIEWS.drives = function (c) {
    c.innerHTML = '<h1>Placement Drives</h1><p class="lead">Explore placement drives.</p><div id="m"></div>';
    V.drives($("#m", c));
  };

  VIEWS.resume = function (c) {
    c.innerHTML = '<h1 class="no-print">Resume Builder</h1><p class="lead no-print">Fill in your details and watch the preview update live. Your draft is saved in this browser.</p><div id="m"></div>';
    App.resume($("#m", c));
  };

  VIEWS.interview = function (c) {
    c.innerHTML = '<h1>Interview Preparation</h1><p class="lead">Common questions with model answers across eight topics. Track what you\'ve practised.</p><div id="m"></div>';
    App.interview($("#m", c));
  };

  VIEWS.coding = function (c) {
    c.innerHTML = '<h1>Coding Practice</h1><p class="lead">Quick multiple-choice checks and runnable JavaScript problems with hints and sample solutions.</p><div id="m"></div>';
    App.coding($("#m", c));
  };

  VIEWS.feedback = function (c) {
    c.innerHTML = '<h1>Student Feedback</h1><p class="lead">Example testimonials and a form to share your feedback.</p>' +
      '<div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start" id="fbl"><div id="fl" class="grid grid-2"></div><div id="ff"></div></div>' +
      "<style>@media(max-width:1000px){#fbl{grid-template-columns:1fr!important}#fl{grid-template-columns:1fr}}</style>";

    function showCards() {
      V.testimonials($("#fl", c));
    }
    V.feedbackForm($("#ff", c), showCards);
    showCards();
  };

  VIEWS.notifications = function (c) {
    function readList() {
      return CP.store.get("notifRead", []);
    }

    function draw() {
      var read = readList();
      var html = '<h1>Notifications</h1><p class="lead">Example notifications to preview the feature.</p>' +
        '<div style="margin-bottom:14px"><button class="btn btn-sm" id="markAll">Mark all as read</button></div><div class="card">';

      for (var i = 0; i < D.notifications.length; i++) {
        var n = D.notifications[i];
        var isRead = read.indexOf(n.id) >= 0;
        html += '<div class="list-row"><span class="badge ' + (isRead ? "muted" : "ok") + '">' + (isRead ? "Read" : "New") + "</span>" +
          '<div class="grow">' + esc(n.text) + "<small>" + esc(n.ago) + "</small></div>" +
          '<button class="btn btn-sm btn-ghost" data-toggle-read="' + n.id + '">' + (isRead ? "Mark unread" : "Mark read") + "</button></div>";
      }
      c.innerHTML = html + "</div>";
      App.refreshChrome();
    }
    draw();

    c.onclick = function (e) {
      var toggle = e.target.closest("[data-toggle-read]");
      if (toggle) {
        var id = toggle.dataset.toggleRead;
        var read = readList();
        var position = read.indexOf(id);
        if (position >= 0) {
          read.splice(position, 1);     // was read -> mark unread
        } else {
          read.push(id);                // was unread -> mark read
        }
        CP.store.set("notifRead", read);
        draw();
      }

      if (e.target.closest("#markAll")) {
        var everyId = [];
        for (var i = 0; i < D.notifications.length; i++) {
          everyId.push(D.notifications[i].id);
        }
        CP.store.set("notifRead", everyId);
        draw();
      }
    };
  };

  VIEWS.profile = function (c) {
    var p = CP.profile();
    var i;

    // <option> list with one option selected
    function options(list, selected) {
      var html = "";
      for (var k = 0; k < list.length; k++) {
        html += "<option" + (selected === list[k] ? " selected" : "") + ">" + list[k] + "</option>";
      }
      return html;
    }

    // a normal text box that shows the saved value
    function f(id, label, type) {
      return V.inputField("p-" + id, id, label, false, ' type="' + (type || "text") + '" value="' + esc(p[id]) + '"');
    }

    var signedIn = CP.auth.user();
    var html = '<h1>Profile</h1><p class="lead">Edit your details. They prefill application forms and the resume builder.</p>';
    html += '<div class="grid" style="grid-template-columns:280px 1fr;align-items:start" id="pg">';

    // left card: avatar and name
    html += '<div class="card" style="align-items:center;text-align:center"><span class="avatar" style="width:96px;height:96px;font-size:2rem" id="bigAv">' + esc(CP.initials(CP.displayName())) + "</span>" +
      '<b id="pn">' + esc(CP.displayName()) + '</b><small style="color:var(--muted)">' + esc(p.degree) + " · " + esc(p.year) + "</small>" +
      '<p style="font-size:.78rem">' + (signedIn ? "Signed in" : "Guest mode — <a href='signin.html' style='color:var(--accent)'>sign in</a> to keep your name across visits") + "</p></div>";

    // right card: the form
    html += '<form class="card" id="pf" novalidate>';
    html += '<div class="form-row">' + f("name", "Full name") + f("email", "Email", "email") + "</div>";
    html += '<div class="form-row">' + f("phone", "Phone", "tel") + f("college", "College / university") + "</div>";
    html += '<div class="form-row"><div class="field"><label for="p-degree">Degree</label><select class="select" id="p-degree" name="degree">' +
      options(["B.Tech", "B.E", "BCA", "B.Sc", "MCA", "M.Tech", "Other"], p.degree) + "</select></div>" +
      '<div class="field"><label for="p-year">Year</label><select class="select" id="p-year" name="year">' +
      options(["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"], p.year) + "</select></div></div>";
    html += f("skills", "Skills (comma separated)");
    html += '<div><button class="btn btn-primary" type="submit">Save profile</button></div></form></div>';
    html += "<style>@media(max-width:860px){#pg{grid-template-columns:1fr!important}}</style>";
    c.innerHTML = html;

    $("#pf", c).addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      var good = CP.validate(form, {
        name: { required: true, min: 2 },
        email: { email: true },
        phone: { phone: true }
      });
      if (!good) {
        return;
      }

      // read the form and trim every value
      var values = formValues(form);
      for (var key in values) {
        values[key] = values[key].trim();
      }
      CP.store.set("profile", Object.assign(CP.store.get("profile", {}), values));

      var session = CP.auth.user();
      if (session) {
        session.name = values.name;
        CP.store.set("session", session);
      }

      CP.toast("Profile saved.");
      $("#bigAv", c).textContent = CP.initials(values.name);
      $("#pn", c).textContent = values.name;
      App.refreshChrome();
    });
  };

  VIEWS.settings = function (c) {
    var theme = CP.theme.get();
    var sets = Object.assign({ collapsed: false, emailN: true, driveN: true }, CP.store.get("settings", {}));

    // one row with an on/off switch
    function row(key, title, text) {
      return '<div class="list-row"><div class="grow"><b>' + title + "</b><small>" + text + '</small></div>' +
        '<label class="switch"><input type="checkbox" data-set="' + key + '"' + (sets[key] ? " checked" : "") + ' aria-label="' + title + '"><i></i></label></div>';
    }

    var appearance = '<div class="list-row"><div class="grow"><b>Theme</b><small>Applies to every page.</small></div><div style="display:flex;gap:8px">' +
      '<button class="chip' + (theme === "dark" ? " active" : "") + '" data-theme-set="dark">Dark</button>' +
      '<button class="chip' + (theme === "light" ? " active" : "") + '" data-theme-set="light">Light</button></div></div>' +
      row("collapsed", "Collapse sidebar by default", "Slim icon-only sidebar on desktop.");

    var notifications = row("emailN", "Email updates", "Email notifications are currently unavailable.") +
      row("driveN", "Placement drive reminders", "Preferences are stored locally.");

    var data = "<p>Everything lives in your browser’s localStorage.</p>" +
      '<div class="card-actions"><button class="btn btn-sm" id="exp" style="flex:none">Download my data (JSON)</button>' +
      '<button class="btn btn-sm btn-danger" id="rst" style="flex:none">Reset my data</button></div>';

    c.innerHTML = '<h1>Settings</h1><p class="lead">Preferences are stored in this browser only.</p><div class="grid grid-2" style="align-items:start">' +
      card("Appearance", appearance) + card("Notifications", notifications) + card("Your data", data) + "</div>";

    // Download all saved demo data as a .json file
    function downloadData() {
      var out = {};
      try {
        for (var key in localStorage) {
          if (key.indexOf("cp_") === 0 && key !== "cp_accounts") {
            out[key] = JSON.parse(localStorage.getItem(key));
          }
        }
      } catch (err) {
        // ignore
      }
      var link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
      link.download = "careerprep-data.json";
      link.click();
    }

    // Delete every saved item except the theme, then reload.
    function resetEverything() {
      try {
        var keys = Object.keys(localStorage);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].indexOf("cp_") === 0 && keys[i] !== "cp_theme") {
            localStorage.removeItem(keys[i]);
          }
        }
      } catch (err) {
        // ignore
      }
      location.hash = "#overview";
      location.reload();
    }

    c.onclick = function (e) {
      var themeButton = e.target.closest("[data-theme-set]");
      if (themeButton) {
        CP.theme.set(themeButton.dataset.themeSet);
        VIEWS.settings(c);
      }

      if (e.target.closest("#exp")) {
        downloadData();
      }

      if (e.target.closest("#rst")) {
        CP.modal.open({
          title: "Reset my data?",
          sub: "This clears applications, saved items, progress, feedback, resume draft and your account from this browser.",
          body: '<div class="modal-actions"><button class="btn" data-modal-close>Cancel</button><button class="btn btn-danger" id="rstGo">Yes, reset everything</button></div>',
          onOpen: function (root) {
            $("#rstGo", root).onclick = resetEverything;
          }
        });
      }
    };

    // the on/off switches
    c.onchange = function (e) {
      var key = e.target.dataset.set;
      if (!key) {
        return;
      }
      sets[key] = e.target.checked;
      CP.store.set("settings", sets);
      if (key === "collapsed") {
        $("#app").classList.toggle("collapsed", sets.collapsed);
      }
      CP.toast("Setting saved.");
    };
  };

  VIEWS.help = function (c) {
    c.innerHTML = '<h1>Help &amp; Support</h1><p class="lead">Answers to common questions and a contact form preview.</p>' +
      '<div class="grid" style="grid-template-columns:1.2fr 1fr;align-items:start" id="hg"><div class="faq" style="max-width:none" id="hf"></div>' +
      '<form class="card" id="hform" novalidate><h3>Contact support</h3><p>No one receives this message — it is saved locally so you can see the flow.</p>' +
      V.inputField("h-email", "email", "Your email", true, ' type="email" value="' + esc(CP.profile().email) + '"') +
      '<div class="field"><label for="h-msg">How can we help? <span class="req">*</span></label><textarea class="textarea" id="h-msg" name="msg"></textarea><span class="err" data-err="msg"></span></div>' +
      '<button class="btn btn-primary" type="submit">Send message</button></form></div>' +
      "<style>@media(max-width:1000px){#hg{grid-template-columns:1fr!important}}</style>";

    V.faq($("#hf", c));

    $("#hform", c).addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      var good = CP.validate(form, {
        email: { required: true, email: true },
        msg: { required: true, min: 10, msg: "Please describe your question." }
      });
      if (!good) {
        return;
      }
      var tickets = CP.store.get("tickets", []);
      tickets.push({ email: form.email.value, msg: form.msg.value, date: Date.now() });
      CP.store.set("tickets", tickets);
      form.msg.value = "";
      CP.toast("Message saved locally. Nothing was sent.");
    });
  };

  // Update the unread count, name and avatar in the sidebar and top bar.
  App.refreshChrome = function () {
    var root = $("#app");
    if (!root) {
      return;
    }
    var i;
    var count = unread();
    var badges = $$("[data-unread]", root);
    for (i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      badges[i].classList.toggle("hidden", !count);
    }
    var names = $$("[data-pname]", root);
    for (i = 0; i < names.length; i++) {
      names[i].textContent = CP.displayName();
    }
    var avatars = $$("[data-pav]", root);
    for (i = 0; i < avatars.length; i++) {
      avatars[i].textContent = CP.initials(CP.displayName());
    }
  };

  // Build the whole dashboard (sidebar + top bar + content) inside "root".
  App.dashboard = function (root) {
    var settings = Object.assign({ collapsed: false }, CP.store.get("settings", {}));
    var p = CP.profile();
    var user = CP.auth.user();
    var i;

    root.className = "app-shell" + (settings.collapsed ? " collapsed" : "");
    root.id = "app";

    // sidebar menu links
    var menu = "";
    for (i = 0; i < ROUTES.length; i++) {
      var r = ROUTES[i];
      menu += '<a href="#' + r[0] + '" data-route="' + r[0] + '" title="' + r[1] + '">' + icon(r[2]) + '<span class="label">' + r[1] + "</span>" +
        (r[0] === "notifications" ? '<span class="dot" data-unread></span>' : "") + "</a>";
    }

    // buttons at the bottom of the sidebar
    var footer = '<button class="btn btn-sm btn-block" type="button" data-theme-toggle="label"></button>' +
      '<a class="btn btn-sm btn-block" href="index.html" title="Back to website">' + icon("home") + '<span class="label">Website</span></a>';
    if (user) {
      footer += '<button class="btn btn-sm btn-block" type="button" id="dSignOut" title="Sign out">' + icon("logout") + '<span class="label">Sign out</span></button>';
    } else {
      footer += '<a class="btn btn-sm btn-primary btn-block" href="signin.html">Sign in</a>';
    }

    var sidebar = '<div class="side-backdrop" id="sideBack"></div><aside class="sidebar" id="sidebar" aria-label="Dashboard">' + CP.logo("index.html") +
      '<a class="side-profile" href="#profile"><span class="avatar" data-pav></span><div><b data-pname></b><small>' + esc(p.degree) + " · " + esc(p.year) + "</small></div></a>" +
      '<nav class="side-nav" aria-label="Dashboard sections">' + menu + "</nav>" +
      '<div class="side-foot">' + footer + "</div></aside>";

    var bellStyle = "position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;border-radius:9px;background:var(--danger);color:#fff;font-size:.65rem;display:grid;place-items:center;font-weight:700";
    var topbar = '<header class="topbar"><button class="icon-btn" type="button" id="sideToggle" aria-label="Toggle sidebar" aria-controls="sidebar">' + icon("sidebar") + "</button>" +
      '<form class="search" id="gSearch" role="search">' + icon("search") + '<label class="sr-only" for="gq">Search jobs, companies, courses</label>' +
      '<input class="input" id="gq" type="search" placeholder="Search jobs, companies, courses…"></form><span class="spacer"></span>' +
      '<button class="icon-btn" type="button" data-theme-toggle></button>' +
      '<a class="icon-btn" href="#notifications" aria-label="Notifications">' + icon("bell") + '<span class="dot" data-unread style="' + bellStyle + '"></span></a>' +
      '<a href="#profile" aria-label="Profile"><span class="avatar" data-pav></span></a></header>';

    root.innerHTML = sidebar + '<div class="app-main">' + topbar + '<main class="app-content" id="main" tabindex="-1"></main></div>';

    var content = $("#main", root);
    var phone = window.matchMedia("(max-width: 860px)");   // true on small screens

    // Show the screen that matches the # part of the address.
    function route() {
      var id = (location.hash || "#overview").slice(1);

      // find the matching route (or use the first one)
      var found = ROUTES[0];
      for (var k = 0; k < ROUTES.length; k++) {
        if (ROUTES[k][0] === id) {
          found = ROUTES[k];
        }
      }

      // highlight the active menu link
      var links = $$("[data-route]", root);
      for (var m = 0; m < links.length; m++) {
        if (links[m].dataset.route === found[0]) {
          links[m].classList.add("active");
          links[m].setAttribute("aria-current", "page");
        } else {
          links[m].classList.remove("active");
          links[m].removeAttribute("aria-current");
        }
      }

      content.onclick = null;
      content.onchange = null;
      V.refreshCourses = null;

      VIEWS[found[0]](content);
      document.title = found[1] + " | CareerPrep Dashboard";
      window.scrollTo(0, 0);
      root.classList.remove("mobile-open");
      document.body.classList.remove("no-scroll");
      App.refreshChrome();
      CP.theme.sync();
    }

    window.addEventListener("hashchange", route);

    // when saved items change, refresh the screens that show them
    document.addEventListener("cp:state", function () {
      var id = (location.hash || "#overview").slice(1);
      if (id === "saved") {
        VIEWS.saved(content);
      }
      if (id === "overview") {
        VIEWS.overview(content);
      }
      App.refreshChrome();
    });

    // the sidebar button: slide in on phones, collapse on desktop
    $("#sideToggle", root).addEventListener("click", function () {
      if (phone.matches) {
        var isOpen = root.classList.toggle("mobile-open");
        document.body.classList.toggle("no-scroll", isOpen);
      } else {
        var isCollapsed = root.classList.toggle("collapsed");
        CP.store.set("settings", Object.assign(CP.store.get("settings", {}), { collapsed: isCollapsed }));
      }
    });

    function closeMobileSidebar() {
      root.classList.remove("mobile-open");
      document.body.classList.remove("no-scroll");
    }
    $("#sideBack", root).addEventListener("click", closeMobileSidebar);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMobileSidebar();
      }
    });

    var signOutButton = $("#dSignOut", root);
    if (signOutButton) {
      signOutButton.addEventListener("click", function () {
        CP.auth.signOut();
        location.href = "index.html";
      });
    }

    // top search box: go to Jobs and type the words into its search box
    $("#gSearch", root).addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("#gq", root).value.trim();
      if (!q) {
        return;
      }
      var alreadyOnJobs = location.hash === "#jobs";
      location.hash = "#jobs";
      if (alreadyOnJobs) {
        route();
      }
      setTimeout(function () {
        var box = $('input[type="search"]', content);
        if (box) {
          box.value = q;
          box.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, 30);
    });

    route();
  };
})();
