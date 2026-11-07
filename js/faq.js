/* ============================================================
   S3M ATHLETICS — FAQ ACCORDION
   Vanilla JS. No dependencies. Works on static hosting.
   ============================================================ */

(function () {
  "use strict";

  // Wait for DOM
  document.addEventListener("DOMContentLoaded", function () {
    var questions = document.querySelectorAll(".faq-question");

    questions.forEach(function (button) {
      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        var panelId = button.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;

        // Toggle current item
        button.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) {
          if (expanded) {
            panel.setAttribute("hidden", "");
          } else {
            panel.removeAttribute("hidden");
          }
        }
      });
    });
  });
})();