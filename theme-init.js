/* Runs inside <head> before the page is drawn, so the saved
   theme (dark or light) is applied immediately - no flash. */
(function () {
  var theme = "dark";   // default

  try {
    var saved = localStorage.getItem("cp_theme");   // saved as "light" or "dark" (with quotes)
    if (saved) {
      theme = JSON.parse(saved);
    }
  } catch (e) {
    // storage blocked or unreadable - keep the default
  }

  if (theme !== "light") {
    theme = "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
})();
