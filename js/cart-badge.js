/* ============================================================
   S3M ATHLETICS — LIVE CART BADGE
   Keeps every .cart-count element in the header in sync with
   localStorage["s3m_cart"] across all pages.
   No backend. No side effects beyond the badge text.
   ============================================================ */

(function () {
  "use strict";

  var CART_KEY = "s3m_cart";

  function readCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function totalQuantity(items) {
    return items.reduce(function (sum, it) {
      var n = parseInt(it && it.qty, 10);
      if (isNaN(n) || n < 1) return sum;
      return sum + n;
    }, 0);
  }

  function updateBadge() {
    var items = readCart();
    var count = totalQuantity(items);
    var badges = document.querySelectorAll(".cart-count");
    badges.forEach(function (el) {
      el.textContent = String(count);
    });
  }

  // Initial paint
  document.addEventListener("DOMContentLoaded", updateBadge);

  // Cross-tab sync: another tab updated the cart
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) updateBadge();
  });

  // Same-tab sync: pages that modify the cart can dispatch this custom event
  window.addEventListener("s3m:cart-updated", updateBadge);
})();