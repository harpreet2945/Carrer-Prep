/* ==========================================================
   CareerPrep — Illustrative Example Data
   Nothing here is a verified opening, partnership, deadline,
   testimonial or placement result. Company names are used only
   as examples of typical employers.
   ========================================================== */
/* How to edit: change the text/numbers inside the lists below.
   Every other file reads this data through window.CPData. */
window.CPData = (function () {
  const colors = {
    TCS: "#e11d48", Infosys: "#0ea5e9", Wipro: "#7c3aed", Accenture: "#a21caf", Cognizant: "#2563eb",
    Microsoft: "#0f766e", Amazon: "#f59e0b", Deloitte: "#16a34a"
  };

  /* ---------------- Courses ---------------- */
  const courses = [
    { id: "java", title: "Java Programming", category: "Programming", level: "Beginner", duration: "6 weeks", progress: 45,
      desc: "Core Java from syntax to OOP, collections and exceptions — the language most campus tests start with.",
      skills: ["Syntax", "OOP", "Collections", "Exceptions"],
      lessons: [
        { t: "Variables, types & operators", b: "Java is statically typed: every variable has a declared type. Primitive types include <code class='inline'>int</code>, <code class='inline'>double</code>, <code class='inline'>boolean</code> and <code class='inline'>char</code>.", code: "int marks = 85;\ndouble cgpa = 8.4;\nboolean placed = false;\nSystem.out.println(\"Marks: \" + marks);" },
        { t: "Classes & objects", b: "A class is a blueprint; an object is an instance. Encapsulation means keeping fields private and exposing behaviour through methods.", code: "class Student {\n  private String name;\n  Student(String name) { this.name = name; }\n  String greet() { return \"Hi, \" + name; }\n}\nStudent s = new Student(\"Asha\");" },
        { t: "Collections: ArrayList & HashMap", b: "Collections store groups of objects. Use <code class='inline'>ArrayList</code> for ordered lists and <code class='inline'>HashMap</code> for key-value lookups in O(1) average time.", code: "List<String> skills = new ArrayList<>();\nskills.add(\"Java\");\nMap<String,Integer> score = new HashMap<>();\nscore.put(\"Java\", 90);" }
      ] },
    { id: "python", title: "Python Programming", category: "Programming", level: "Beginner", duration: "5 weeks", progress: 20,
      desc: "Readable, beginner-friendly Python: data types, functions, files and the libraries behind data and AI work.",
      skills: ["Syntax", "Functions", "Lists & dicts", "File I/O"],
      lessons: [
        { t: "Python basics", b: "Python uses indentation instead of braces. Variables are dynamically typed.", code: "name = \"Asha\"\nmarks = [78, 85, 92]\nprint(name, sum(marks) / len(marks))" },
        { t: "Functions & comprehensions", b: "Functions package reusable logic. List comprehensions build lists in one expressive line.", code: "def square(n):\n    return n * n\n\nevens = [square(n) for n in range(10) if n % 2 == 0]" },
        { t: "Dictionaries & files", b: "Dictionaries map keys to values. Use <code class='inline'>with open()</code> so files close automatically.", code: "profile = {\"name\": \"Asha\", \"skills\": [\"Python\"]}\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(profile[\"name\"])" }
      ] },
    { id: "dsa", title: "Data Structures and Algorithms", category: "Programming", level: "Intermediate", duration: "8 weeks", progress: 30,
      desc: "Arrays, linked lists, stacks, queues, trees, sorting and searching — the backbone of technical interviews.",
      skills: ["Arrays", "Trees", "Sorting", "Complexity"],
      lessons: [
        { t: "Big-O notation", b: "Big-O describes how runtime grows with input size. Binary search is O(log n); a nested loop over n items is O(n²).", code: "// O(n): one pass\nfor (let i = 0; i < n; i++) { /* work */ }\n// O(n^2): nested\nfor (let i = 0; i < n; i++)\n  for (let j = 0; j < n; j++) { /* work */ }" },
        { t: "Binary search", b: "On a sorted array, halve the search range each step.", code: "function bsearch(a, x) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (a[mid] === x) return mid;\n    a[mid] < x ? lo = mid + 1 : hi = mid - 1;\n  }\n  return -1;\n}" },
        { t: "Stacks & queues", b: "A stack is last-in-first-out (undo history, bracket matching). A queue is first-in-first-out (task scheduling, BFS).", code: "const stack = [];\nstack.push(1); stack.push(2);\nstack.pop(); // 2\nconst queue = [1, 2, 3];\nqueue.shift(); // 1" }
      ] },
    { id: "web", title: "Web Development", category: "Web", level: "Beginner", duration: "7 weeks", progress: 0,
      desc: "Build responsive sites with HTML, CSS and JavaScript — semantic markup, flexbox, grid and DOM interaction.",
      skills: ["HTML5", "CSS3", "JavaScript", "Responsive design"],
      lessons: [
        { t: "Semantic HTML", b: "Use elements for their meaning: <code class='inline'>header</code>, <code class='inline'>nav</code>, <code class='inline'>main</code>, <code class='inline'>section</code>, <code class='inline'>footer</code>. It helps accessibility and SEO.", code: "<main>\n  <section>\n    <h1>My Portfolio</h1>\n    <p>Hello!</p>\n  </section>\n</main>" },
        { t: "Flexbox & Grid", b: "Flexbox lays out items in one dimension; Grid handles rows and columns together.", code: ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 20px;\n}" },
        { t: "DOM events", b: "JavaScript reacts to user actions by listening for events.", code: "document.querySelector('#btn')\n  .addEventListener('click', () => {\n    alert('Hello!');\n  });" }
      ] },
    { id: "dbms", title: "Database Management Systems", category: "Core CS", level: "Intermediate", duration: "6 weeks", progress: 60,
      desc: "Relational modelling, normalisation, SQL queries, joins, indexing and transactions explained for interviews.",
      skills: ["SQL", "Normalisation", "Joins", "Transactions"],
      lessons: [
        { t: "SQL SELECT essentials", b: "<code class='inline'>SELECT</code> reads rows; <code class='inline'>WHERE</code> filters; <code class='inline'>ORDER BY</code> sorts; <code class='inline'>GROUP BY</code> aggregates.", code: "SELECT dept, COUNT(*) AS total\nFROM students\nWHERE cgpa >= 7.5\nGROUP BY dept\nORDER BY total DESC;" },
        { t: "Joins", b: "INNER JOIN keeps matching rows only; LEFT JOIN keeps every row from the left table.", code: "SELECT s.name, c.title\nFROM students s\nLEFT JOIN enrollments e ON e.student_id = s.id\nLEFT JOIN courses c ON c.id = e.course_id;" },
        { t: "ACID properties", b: "Atomicity, Consistency, Isolation, Durability — the guarantees that make transactions reliable.", code: "BEGIN;\nUPDATE accounts SET bal = bal - 500 WHERE id = 1;\nUPDATE accounts SET bal = bal + 500 WHERE id = 2;\nCOMMIT;" }
      ] },
    { id: "aiml", title: "Artificial Intelligence and Machine Learning", category: "AI & Data", level: "Advanced", duration: "10 weeks", progress: 10,
      desc: "From linear regression to neural networks: understand the models, the maths and how to evaluate them.",
      skills: ["Regression", "Classification", "Neural nets", "Evaluation"],
      lessons: [
        { t: "Supervised vs unsupervised", b: "Supervised learning learns from labelled examples (predict salary, classify spam). Unsupervised learning finds structure in unlabelled data (clustering).", code: "# scikit-learn style\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npreds = model.predict(X_test)" },
        { t: "Overfitting", b: "A model that memorises training data performs poorly on new data. Use train/test splits, regularisation and more data to fight it.", code: "from sklearn.model_selection import train_test_split\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)" },
        { t: "Evaluation metrics", b: "Accuracy can mislead on imbalanced data. Precision, recall and F1 give a fuller picture.", code: "precision = TP / (TP + FP)\nrecall    = TP / (TP + FN)\nf1 = 2 * precision * recall / (precision + recall)" }
      ] },
    { id: "aptitude", title: "Aptitude and Logical Reasoning", category: "Aptitude", level: "Beginner", duration: "4 weeks", progress: 75,
      desc: "Percentages, ratios, time & work, number series and puzzles — the first round of most campus drives.",
      skills: ["Percentages", "Ratios", "Time & work", "Puzzles"],
      lessons: [
        { t: "Percentages shortcut", b: "x% of y = y% of x. To increase a number by 20%, multiply by 1.2. A 25% discount means you pay 0.75 of the price.", code: "20% of 50 = 50% of 20 = 10\nPrice after 25% off 800 = 800 × 0.75 = 600" },
        { t: "Time & work", b: "If A finishes in a days and B in b days, together they take (a×b)/(a+b) days.", code: "A = 10 days, B = 15 days\nTogether = (10×15)/(10+15) = 6 days" },
        { t: "Number series", b: "Look for constant differences, constant ratios, squares/cubes or alternating patterns.", code: "2, 6, 12, 20, 30, ?\nDifferences: 4, 6, 8, 10 → next +12 = 42" }
      ] },
    { id: "interview", title: "Interview Preparation", category: "Career", level: "Beginner", duration: "3 weeks", progress: 0,
      desc: "HR and technical interview strategy: the STAR method, self-introduction, project stories and mock rounds.",
      skills: ["STAR method", "Self-intro", "Communication", "Mock rounds"],
      lessons: [
        { t: "Crafting your self-introduction", b: "Keep it to 60–90 seconds: who you are, what you studied, one or two strongest projects, and what role you want.", code: "Present → Past → Future\n\"I'm a 3rd-year CSE student... built X... aiming for a backend role.\"" },
        { t: "The STAR method", b: "Answer behavioural questions with Situation, Task, Action, Result. Spend most time on Action and Result.", code: "S: Team project deadline at risk\nT: I owned the login module\nA: Broke work into tasks, paired with a teammate\nR: Delivered 2 days early" },
        { t: "Questions to ask the interviewer", b: "Ask about the team's tech stack, onboarding, and how success is measured in the first six months.", code: "• What does a typical first project look like?\n• How does the team do code review?" }
      ] }
  ];

  /* ---------------- Jobs ---------------- */
  // J(...) builds one job object. Fields in order:
  // id, company, title, location, mode, experience, skills, description
  function J(id, company, title, location, mode, exp, skills, desc, type) {
    return {
      id: id,
      company: company,
      title: title,
      location: location,
      mode: mode,
      exp: exp,
      skills: skills,
      desc: desc,
      type: type || "Full-time"
    };
  }
  const jobs = [
    J("j1", "TCS", "Systems Engineer (Fresher)", "Chennai", "Onsite", "0–1 yrs · B.E/B.Tech, 60%+", ["Java", "SQL", "Aptitude"], "Entry-level role building and testing enterprise applications with a mentor-led onboarding track."),
    J("j2", "Infosys", "Java Developer", "Bengaluru", "Hybrid", "0–2 yrs · Any engineering branch", ["Java", "Spring Boot", "SQL"], "Develop backend services and REST APIs for client projects in a hybrid team."),
    J("j3", "Wipro", "Python Software Engineer", "Hyderabad", "Remote", "0–1 yrs · CS/IT preferred", ["Python", "Django", "Problem Solving"], "Write clean Python services and automation scripts; collaborate with distributed teams."),
    J("j4", "Accenture", "Associate Software Engineer", "Pune", "Onsite", "0–1 yrs · Any graduate", ["Communication", "Cloud basics", "Coding"], "Join delivery teams working on cloud and application modernisation projects."),
    J("j5", "Cognizant", "Programmer Analyst Trainee", "Coimbatore", "Hybrid", "0–1 yrs · B.E/B.Tech", ["Java", "Testing", "Agile"], "Training programme followed by project work in application development and QA."),
    J("j6", "Microsoft", "Software Development Engineer", "Hyderabad", "Hybrid", "1–3 yrs · Strong DSA", ["DSA", "C#", "System Design"], "Design, build and ship features for large-scale cloud services with strong engineering practices."),
    J("j7", "Amazon", "Data Analyst", "Bengaluru", "Onsite", "1–2 yrs · Analytical skills", ["SQL", "Excel", "Python"], "Turn operational data into dashboards and insights that guide business decisions."),
    J("j8", "Deloitte", "Technology Analyst", "Mumbai", "Hybrid", "0–2 yrs · Any engineering branch", ["Consulting", "SQL", "Communication"], "Support technology consulting engagements across data, cloud and cyber domains."),
    J("j9", "Infosys", "Frontend Developer", "Mysuru", "Remote", "0–2 yrs · Portfolio preferred", ["HTML", "CSS", "JavaScript"], "Build responsive, accessible interfaces for enterprise web applications."),
    J("j10", "Amazon", "Cloud Support Associate", "Chennai", "Onsite", "0–1 yrs · Networking basics", ["Linux", "Networking", "Troubleshooting"], "Help customers diagnose and resolve cloud infrastructure issues."),
    J("j11", "Microsoft", "Machine Learning Engineer", "Bengaluru", "Hybrid", "2–4 yrs · ML fundamentals", ["Python", "ML", "Statistics"], "Prototype and evaluate machine-learning models for product features."),
    J("j12", "TCS", "QA Test Engineer", "Kolkata", "Onsite", "0–2 yrs · Any graduate", ["Testing", "SQL", "Selenium"], "Plan and execute manual and automated tests for client applications.")
  ];

  /* ---------------- Internships ---------------- */
  // I(...) builds one internship object. Fields in order:
  // id, company, title, location, mode, duration, stipend (null = unpaid), eligibility, skills
  function I(id, company, title, location, mode, duration, stipend, elig, skills, category) {
    return {
      id: id,
      company: company,
      title: title,
      location: location,
      mode: mode,
      duration: duration,
      stipend: stipend,
      elig: elig,
      skills: skills,
      category: category
    };
  }
  const internships = [
    I("i1", "Microsoft", "Software Development Intern", "Hyderabad", "Remote", "2 months", 20000, "Pre-final year B.Tech", ["Python", "JavaScript", "Azure"]),
    I("i2", "Amazon", "Data Science Intern", "Bengaluru", "Hybrid", "3 months", 25000, "B.Tech/M.Tech, 7+ CGPA", ["Python", "ML", "Data Analysis"]),
    I("i3", "Accenture", "Marketing Technology Intern", "Pune", "Onsite", "2 months", 15000, "Any final-year student", ["Communication", "MS Office", "Creativity"]),
    I("i4", "TCS", "Java Development Intern", "Chennai", "Onsite", "6 weeks", 10000, "2nd–3rd year CSE/IT", ["Java", "OOP", "SQL"]),
    I("i5", "Infosys", "Web Development Intern", "Remote", "Remote", "3 months", 12000, "Any engineering student", ["HTML", "CSS", "JavaScript"]),
    I("i6", "Wipro", "Cloud Operations Intern", "Hyderabad", "Hybrid", "2 months", 14000, "3rd-year students", ["Linux", "Networking", "Cloud basics"]),
    I("i7", "Deloitte", "Business Analyst Intern", "Mumbai", "Hybrid", "2 months", null, "Final-year students", ["Excel", "SQL", "Presentation"]),
    I("i8", "Cognizant", "QA Automation Intern", "Coimbatore", "Onsite", "3 months", 12000, "Pre-final year B.E/B.Tech", ["Testing", "Selenium", "Java"])
  ];

  /* ---------------- Companies ---------------- */
  const companies = [
    { name: "TCS", industry: "IT Services & Consulting", desc: "Large IT services organisation with broad fresher hiring across development, testing and support.", skills: ["Java", "SQL", "Testing", "Aptitude"] },
    { name: "Infosys", industry: "IT Services & Consulting", desc: "Global technology services company known for structured training programmes for new graduates.", skills: ["Java", "Spring Boot", "Frontend", "Python"] },
    { name: "Wipro", industry: "IT Services", desc: "Technology services and consulting company with roles in cloud, engineering and operations.", skills: ["Python", "Django", "Cloud", "DevOps"] },
    { name: "Accenture", industry: "Professional Services", desc: "Consulting and technology services firm with delivery roles across industries.", skills: ["Cloud", "Communication", "Coding", "Analytics"] },
    { name: "Cognizant", industry: "IT Services", desc: "Digital engineering and IT services firm hiring programmer trainees and testers.", skills: ["Java", "Testing", "Agile", "SQL"] },
    { name: "Microsoft", industry: "Software & Cloud", desc: "Software and cloud company with engineering roles that emphasise DSA and system design.", skills: ["DSA", "C#", "ML", "System Design"] },
    { name: "Amazon", industry: "E-commerce & Cloud", desc: "E-commerce and cloud technology company with analyst, engineering and support roles.", skills: ["SQL", "Python", "Linux", "Analytics"] },
    { name: "Deloitte", industry: "Consulting & Advisory", desc: "Professional services network with technology consulting and analytics roles.", skills: ["Consulting", "SQL", "Excel", "Communication"] }
  ];

  /* ---------------- Placement drives (sample) ---------------- */
  // D(...) builds one placement drive. regOffset / eventOffset = days from today
  // (negative = in the past). Fields in order:
  // id, company, title, eligibility, skills, regOffset, eventOffset, status, description
  function D(id, company, title, elig, skills, regOffset, eventOffset, status, desc) {
    return {
      id: id,
      company: company,
      title: title,
      elig: elig,
      skills: skills,
      regOffset: regOffset,
      eventOffset: eventOffset,
      status: status,
      desc: desc
    };
  }
  const drives = [
    D("d1", "TCS", "Campus Hiring — Systems Engineer", "B.E/B.Tech · 60% throughout · No active backlogs", ["Aptitude", "Java", "Communication"], 12, 20, "Registration Open", "Online aptitude test followed by technical and HR interviews."),
    D("d2", "Infosys", "Campus Hiring — Specialist Programmer", "B.E/B.Tech/M.Tech · 65%+ · No backlogs", ["DSA", "Java", "SQL"], 18, 28, "Registration Open", "Coding assessment, technical interview and HR discussion."),
    D("d3", "Accenture", "Associate Software Engineer Drive", "Any graduate · 60%+ · Max 1 backlog", ["Cognitive Ability", "Coding", "Communication"], 6, 14, "Closing Soon", "Cognitive and technical assessment, coding round and communication evaluation."),
    D("d4", "Wipro", "Elite National Talent Hunt", "B.E/B.Tech · 60%+ · 2026 batch", ["Aptitude", "Coding", "Essay"], 25, 38, "Upcoming", "Aptitude, written communication and a coding test, then interviews."),
    D("d5", "Cognizant", "GenC Fresher Hiring", "B.E/B.Tech/MCA · 60%+", ["Java", "Testing", "Logical Reasoning"], -5, -1, "Registration Closed", "Online assessment and technical + HR interview rounds."),
    D("d6", "Deloitte", "Analyst Campus Drive", "Any engineering graduate · 65%+", ["SQL", "Excel", "Case Study"], 30, 42, "Upcoming", "Online test, case-study round and partner interview.")
  ];

  /* ---------------- Testimonials (sample) ---------------- */
  const testimonials = [
    { name: "Asha R.", cat: "Java Programming", rating: 5, text: "The step-by-step lessons made OOP click for me. The quizzes are a great way to check what I actually remember." },
    { name: "Karthik S.", cat: "Interview Preparation", rating: 5, text: "Having HR and technical questions in one place saved a lot of time. The STAR method lesson was really helpful." },
    { name: "Meera P.", cat: "Aptitude & Reasoning", rating: 4, text: "Short, focused practice sets. I liked tracking my score and seeing it improve over the week." },
    { name: "Rahul D.", cat: "Web Development", rating: 5, text: "I built my first responsive page by following the lessons. The resume builder was a nice bonus." },
    { name: "Sneha K.", cat: "DBMS", rating: 4, text: "Joins and normalisation finally made sense with the examples. I would love even more practice questions." },
    { name: "Vikram J.", cat: "AI Career Advisor", rating: 4, text: "The roadmap suggestions gave me a clear order to learn things in instead of jumping between topics." }
  ];

  /* ---------------- FAQ ---------------- */
  const faqs = [
    { q: "Is CareerPrep free to use?", a: "This is a frontend demo project, so everything in it is free to explore. There is no payment or real account system." },
    { q: "Are the jobs and internships real?", a: "No. Every listing, company profile, drive and testimonial is illustrative sample data used to demonstrate the interface. Always verify opportunities on the official company careers page." },
    { q: "Does 'Apply Now' send my application to a company?", a: "Applying saves your application in this browser so you can view it in My Applications. Nothing is sent to the company." },
    { q: "Is the AI Career Advisor a real AI?", a: "It is a rule-based assistant written in JavaScript. It gives helpful general guidance, but it is not connected to a real AI model." },
    { q: "Where is my data stored?", a: "Your account information is stored in this browser (localStorage). Clearing site data removes it. Use a unique password for this site." },
    { q: "Can I download my resume?", a: "Yes. Use Print / Save as PDF in the Resume Builder. The resume is not uploaded to any employer." }
  ];

  /* ---------------- Interview prep ---------------- */
  const interview = {
    "Java": [
      ["What is the difference between JDK, JRE and JVM?", "The JVM runs bytecode. The JRE = JVM + core libraries needed to run Java programs. The JDK = JRE + development tools like the compiler (javac)."],
      ["Explain the difference between == and equals().", "== compares references for objects (or values for primitives). equals() compares logical content when overridden, as in String."],
      ["What is the difference between an abstract class and an interface?", "An abstract class can hold state and partially implemented methods; a class extends only one. An interface defines a contract (with default methods since Java 8) and a class can implement many."],
      ["How does HashMap work internally?", "It hashes the key to find a bucket index, stores entries in a bucket (linked list or tree when crowded) and uses equals() to find the exact key. Average get/put is O(1)."]
    ],
    "Python": [
      ["What is the difference between a list and a tuple?", "Lists are mutable; tuples are immutable and hashable (if their items are), so tuples can be dictionary keys."],
      ["What are decorators?", "A decorator is a function that wraps another function to add behaviour without changing its code, applied with @decorator syntax."],
      ["Explain Python's GIL.", "The Global Interpreter Lock lets only one thread execute Python bytecode at a time in CPython, so CPU-bound work uses multiprocessing while I/O-bound work can still use threads."],
      ["What is the difference between deep copy and shallow copy?", "A shallow copy copies the outer object but shares nested objects; a deep copy recursively copies everything."]
    ],
    "OOP": [
      ["What are the four pillars of OOP?", "Encapsulation, abstraction, inheritance and polymorphism."],
      ["Difference between overloading and overriding?", "Overloading: same method name with different parameters in one class (compile-time). Overriding: a subclass redefines a parent's method (runtime)."],
      ["What is encapsulation?", "Bundling data with the methods that operate on it and restricting direct access, usually with private fields and getters/setters."],
      ["What is polymorphism? Give an example.", "One interface, many forms. A Shape reference can call area() on a Circle or Rectangle and each computes its own result."]
    ],
    "DBMS": [
      ["What is normalisation?", "Organising tables to reduce redundancy and anomalies, through normal forms such as 1NF, 2NF, 3NF and BCNF."],
      ["Difference between primary key and unique key?", "Both enforce uniqueness. A table has one primary key which cannot be NULL; it can have many unique keys, which may allow a NULL."],
      ["What are ACID properties?", "Atomicity, Consistency, Isolation, Durability — guarantees for reliable transactions."],
      ["Explain INNER JOIN vs LEFT JOIN.", "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matches from the right (NULL when none)."]
    ],
    "Data Structures & Algorithms": [
      ["Array vs linked list?", "Arrays give O(1) random access but costly inserts. Linked lists give O(1) insert at a known node but O(n) access."],
      ["What is the time complexity of quicksort?", "Average O(n log n); worst case O(n²) with poor pivots. A random pivot makes the worst case unlikely."],
      ["How do you detect a cycle in a linked list?", "Floyd's tortoise-and-hare: move one pointer by 1 and another by 2; if they meet there is a cycle."],
      ["BFS vs DFS?", "BFS explores level by level using a queue (shortest path in unweighted graphs). DFS goes deep using a stack/recursion (cycle detection, topological sort)."]
    ],
    "Web Development": [
      ["What is the box model?", "Every element is a box: content + padding + border + margin. box-sizing: border-box includes padding and border in the width."],
      ["Difference between let, const and var?", "var is function-scoped and hoisted; let and const are block-scoped. const prevents reassignment of the binding."],
      ["What is event delegation?", "Attaching one listener to a parent and using event.target to handle events from many children, including ones added later."],
      ["What does semantic HTML mean?", "Using elements that describe their meaning (nav, article, button) which improves accessibility, SEO and maintainability."]
    ],
    "HR Questions": [
      ["Tell me about yourself.", "Present → Past → Future in about a minute: your current studies, one or two highlights (projects, skills), and the role you are aiming for."],
      ["What are your strengths and weaknesses?", "Pick 2 relevant strengths with a short example each. Choose a real, minor weakness and describe what you're doing to improve it."],
      ["Why should we hire you?", "Link your skills and projects to the job description and show eagerness to learn. Be specific, not generic."],
      ["Where do you see yourself in five years?", "Show growth ambition aligned with the company: becoming a skilled engineer, taking ownership and mentoring others."]
    ],
    "Aptitude & Reasoning": [
      ["A train 150 m long passes a pole in 15 s. Its speed?", "Speed = 150/15 = 10 m/s = 36 km/h."],
      ["If 6 workers finish a job in 10 days, how long will 4 workers take?", "Work = 6 × 10 = 60 worker-days. 60 / 4 = 15 days."],
      ["What is the next number: 3, 9, 27, 81, ?", "Each term is multiplied by 3: 81 × 3 = 243."],
      ["A shopkeeper buys at 400 and sells at 500. Profit %?", "Profit = 100. Profit % = 100/400 × 100 = 25%."]
    ]
  };

  /* ---------------- Coding practice ---------------- */
  const mcqs = [
    { id: "m1", q: "What is the output of: console.log(typeof null)?", opts: ["null", "object", "undefined", "number"], a: 1, hint: "This is a well-known JavaScript quirk from the language's early days.", why: "typeof null returns 'object' — a historical bug that was never fixed for backwards compatibility." },
    { id: "m2", q: "Which data structure uses LIFO order?", opts: ["Queue", "Stack", "Array", "Heap"], a: 1, hint: "Think of a stack of plates.", why: "A stack is last-in-first-out: the most recently pushed item is popped first." },
    { id: "m3", q: "Time complexity of binary search on a sorted array?", opts: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], a: 2, hint: "The search space halves every step.", why: "Halving n repeatedly takes log₂(n) steps." },
    { id: "m4", q: "Which SQL clause filters groups after aggregation?", opts: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], a: 2, hint: "WHERE runs before grouping.", why: "HAVING filters aggregated groups; WHERE filters individual rows before grouping." },
    { id: "m5", q: "In Java, which keyword prevents a class from being inherited?", opts: ["static", "final", "private", "abstract"], a: 1, hint: "The same keyword makes a constant.", why: "A final class cannot be extended (String is a final class)." },
    { id: "m6", q: "What does 'len([1, 2, 3][1:])' return in Python?", opts: ["3", "1", "2", "Error"], a: 2, hint: "Slicing from index 1 to the end.", why: "[1, 2, 3][1:] is [2, 3], whose length is 2." },
    { id: "m7", q: "Which HTML element is best for the main navigation links?", opts: ["<div>", "<nav>", "<section>", "<span>"], a: 1, hint: "Semantic elements describe meaning.", why: "<nav> marks a block of navigation links and helps assistive technologies." },
    { id: "m8", q: "A product costs 800 after a 20% discount. What was the original price?", opts: ["960", "1000", "1040", "900"], a: 1, hint: "800 is 80% of the original.", why: "Original = 800 / 0.8 = 1000." }
  ];

  const problems = [
    { id: "p1", title: "Reverse a String", level: "Easy", fn: "reverseString", prompt: "Write a function <code class='inline'>reverseString(s)</code> that returns the string reversed.", starter: "function reverseString(s) {\n  // your code here\n}", hint: "Strings can be split into an array, reversed and joined back together.", solution: "function reverseString(s) {\n  return s.split('').reverse().join('');\n}", tests: [[["hello"], "olleh"], [["CareerPrep"], "perPreeraC"], [[""], ""]] },
    { id: "p2", title: "Sum of Even Numbers", level: "Easy", fn: "sumEvens", prompt: "Write <code class='inline'>sumEvens(arr)</code> that returns the sum of all even numbers in an array.", starter: "function sumEvens(arr) {\n  // your code here\n}", hint: "Use the % operator to check if a number is even, and accumulate with a loop or reduce.", solution: "function sumEvens(arr) {\n  return arr.filter(n => n % 2 === 0)\n            .reduce((a, b) => a + b, 0);\n}", tests: [[[[1, 2, 3, 4]], 6], [[[7, 9]], 0], [[[10, 20, 5]], 30]] },
    { id: "p3", title: "Palindrome Check", level: "Easy", fn: "isPalindrome", prompt: "Write <code class='inline'>isPalindrome(s)</code> that returns true if the string reads the same forwards and backwards (ignore case).", starter: "function isPalindrome(s) {\n  // your code here\n}", hint: "Lower-case the string, then compare it with its own reverse.", solution: "function isPalindrome(s) {\n  const t = s.toLowerCase();\n  return t === t.split('').reverse().join('');\n}", tests: [[["Level"], true], [["career"], false], [["Noon"], true]] },
    { id: "p4", title: "Factorial", level: "Easy", fn: "factorial", prompt: "Write <code class='inline'>factorial(n)</code> that returns n! (factorial(0) is 1).", starter: "function factorial(n) {\n  // your code here\n}", hint: "n! = n × (n−1)! — use a loop or recursion with a base case.", solution: "function factorial(n) {\n  let r = 1;\n  for (let i = 2; i <= n; i++) r *= i;\n  return r;\n}", tests: [[[0], 1], [[5], 120], [[7], 5040]] },
    { id: "p5", title: "FizzBuzz Term", level: "Medium", fn: "fizzBuzz", prompt: "Write <code class='inline'>fizzBuzz(n)</code>: return 'FizzBuzz' if n is divisible by 3 and 5, 'Fizz' if by 3, 'Buzz' if by 5, otherwise the number as a string.", starter: "function fizzBuzz(n) {\n  // your code here\n}", hint: "Check the divisible-by-both case first.", solution: "function fizzBuzz(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return String(n);\n}", tests: [[[3], "Fizz"], [[10], "Buzz"], [[15], "FizzBuzz"], [[7], "7"]] }
  ];

  /* ---------------- Notifications (sample) ---------------- */
  const notifications = [
    { id: "n1", text: "Welcome to CareerPrep! Complete your profile to get tailored recommendations.", ago: "Just now" },
    { id: "n2", text: "Sample reminder: the TCS demo drive registration closes soon.", ago: "2 hours ago" },
    { id: "n3", text: "You have unfinished lessons in Java Programming.", ago: "Yesterday" },
    { id: "n4", text: "Tip: add a project to your resume to stand out in fresher applications.", ago: "2 days ago" }
  ];

  return { colors, courses, jobs, internships, companies, drives, testimonials, faqs, interview, mcqs, problems, notifications };
})();
