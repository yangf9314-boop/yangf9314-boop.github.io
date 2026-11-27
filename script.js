(function () {
  var root = document.documentElement;
  var themeButton = document.querySelector("[data-theme-toggle]");
  var pages = Array.prototype.slice.call(document.querySelectorAll("[data-page-section]"));
  var pageLinks = Array.prototype.slice.call(document.querySelectorAll("[data-page-link]"));
  var validPages = pages.map(function (page) {
    return page.getAttribute("data-page-section");
  });

  function getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem("theme", value);
    } catch (error) {
      /* ignore storage errors */
    }
  }

  var storedTheme = getStoredTheme();
  var theme = storedTheme === "dark" || storedTheme === "light"
    ? storedTheme
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  root.setAttribute("data-theme", theme);

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      storeTheme(next);
    });
  }

  function currentPage() {
    var hash = window.location.hash.replace("#", "");
    return validPages.indexOf(hash) !== -1 ? hash : "blog";
  }

  function showPage(name) {
    pages.forEach(function (page) {
      page.hidden = page.getAttribute("data-page-section") !== name;
    });

    pageLinks.forEach(function (link) {
      var isActive = link.getAttribute("data-page-link") === name;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo(0, 0);
  }

  pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var name = link.getAttribute("data-page-link");
      if (window.location.hash !== "#" + name) {
        window.location.hash = name;
      } else {
        showPage(name);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    showPage(currentPage());
  });

  showPage(currentPage());

  document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(scope.parentElement.querySelectorAll(".entry-card"));
    var count = scope.parentElement.querySelector("[data-count]");

    if (!input) return;

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var matches = query === "" || text.indexOf(query) !== -1;
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      if (count) {
        var noun = count.getAttribute("data-count").replace(/^\d+\s*/, "");
        count.textContent = visible + " " + noun;
      }
    });
  });
})();
