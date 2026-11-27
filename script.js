(function () {
  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var stored = null;

  try {
    stored = localStorage.getItem("theme");
  } catch (error) {
    stored = null;
  }

  var theme = stored === "dark" || stored === "light"
    ? stored
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  root.setAttribute("data-theme", theme);

  if (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (error) {
        /* ignore storage errors */
      }
    });
  }
})();
