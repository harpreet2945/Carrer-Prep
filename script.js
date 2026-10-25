


/* =====================================================
   SIDEBAR VARIABLES
===================================================== */

const sidebar =
    document.getElementById("sidebar");

const menuButton =
    document.getElementById("menuButton");

const capButton =
    document.getElementById("capButton");

const closeSidebar =
    document.getElementById("closeSidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* =====================================================
   OPEN SIDEBAR
===================================================== */

function openSidebar() {

    sidebar.classList.add("active");

    sidebarOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


/* =====================================================
   CLOSE SIDEBAR
===================================================== */

function closeSideMenu() {

    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


/* =====================================================
   THREE LINE BUTTON
===================================================== */

menuButton.addEventListener(
    "click",
    openSidebar
);


/* =====================================================
   CAP BUTTON
===================================================== */

capButton.addEventListener(
    "click",
    openSidebar
);


/* =====================================================
   CLOSE BUTTON
===================================================== */

closeSidebar.addEventListener(
    "click",
    closeSideMenu
);


/* =====================================================
   OVERLAY CLICK
===================================================== */

sidebarOverlay.addEventListener(
    "click",
    closeSideMenu
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeSideMenu();

        }

    }
);


/* =====================================================
   SIDEBAR LINKS
===================================================== */

const sideLinks =
    document.querySelectorAll(".side-link");

sideLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            closeSideMenu();

        }
    );

});


/* =====================================================
   IMAGE SLIDESHOW
   8 PHOTOS
   1.5 SECOND INTERVAL
===================================================== */

const images =
    document.querySelectorAll(
        "#slideshow img"
    );

const slideshow =
    document.getElementById(
        "slideshow"
    );

let currentImage = 0;

let timer;


/* =====================================================
   NEXT IMAGE
===================================================== */

function nextImage() {

    images[currentImage]
        .classList
        .remove("active");


    currentImage++;


    if (
        currentImage >=
        images.length
    ) {

        currentImage = 0;

    }


    images[currentImage]
        .classList
        .add("active");

}


/* =====================================================
   START SLIDESHOW
===================================================== */

function startSlideshow() {

    timer = setInterval(
        nextImage,
        1500
    );

}


/* =====================================================
   STOP SLIDESHOW
   NO TEXT IS SHOWN
===================================================== */

function stopSlideshow() {

    clearInterval(timer);

}


/* =====================================================
   MOUSE ENTER
===================================================== */

slideshow.addEventListener(
    "mouseenter",
    function() {

        stopSlideshow();

    }
);


/* =====================================================
   MOUSE LEAVE
===================================================== */

slideshow.addEventListener(
    "mouseleave",
    function() {

        startSlideshow();

    }
);


/* =====================================================
   START SLIDESHOW
===================================================== */

startSlideshow();


/* =====================================================
   APPLY JOB
===================================================== */

function applyJob(job) {

    alert(
        "You selected " +
        job +
        ".\n\nPlease Login or Register to continue."
    );

}

// ================= THEME TOGGLE =================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeToggle.textContent = "☀️";
        themeToggle.title = "Switch to Light Theme";
    } else {
        themeToggle.textContent = "🌙";
        themeToggle.title = "Switch to Dark Theme";
    }

});