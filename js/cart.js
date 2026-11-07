/* ============================================================
   S3M ATHLETICS — CART PAGE LOGIC
   Reads/writes localStorage. Resolves product IDs via registry.
   No backend. No checkout. No payment.
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

  function writeCart(items) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) { /* ignore */ }
  }

  function formatQty(n) {
    var num = parseInt(n, 10);
    if (isNaN(num) || num < 1) return 1;
    return num;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var itemsList = document.getElementById("cart-items");
    var emptyState = document.getElementById("cart-empty");
    var cartLayout = document.getElementById("cart-layout");
    var summaryCount = document.getElementById("cart-summary-count");
    var cartCountBadge = document.getElementById("cart-count");
    var clearBtn = document.getElementById("cart-clear");

    function updateCartCountBadge() {
      var items = readCart();
      var total = items.reduce(function (sum, it) {
        return sum + formatQty(it.qty);
      }, 0);
      if (cartCountBadge) cartCountBadge.textContent = String(total);
    }

    function render() {
      var items = readCart();
      updateCartCountBadge();

      if (!items || items.length === 0) {
        if (emptyState) emptyState.hidden = false;
        if (cartLayout) cartLayout.hidden = true;
        if (itemsList) itemsList.innerHTML = "";
        return;
      }

      if (emptyState) emptyState.hidden = true;
      if (cartLayout) cartLayout.hidden = false;

      if (!itemsList) return;

      itemsList.innerHTML = "";

      items.forEach(function (item, index) {
        var product = window.S3M_getProduct ? window.S3M_getProduct(item.id) : null;
        var name = product && product.name ? product.name : "[Product Name]";
        var category = product && product.category ? product.category : "[Category Pending]";
        var price = product && product.price ? product.price : "[Price Pending]";

        var li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML =
          '<div class="cart-item-image" aria-hidden="true">[Image]</div>' +
          '<div class="cart-item-info">' +
            '<span class="cart-item-category">' + escapeHtml(category) + '</span>' +
            '<h3 class="cart-item-name">' + escapeHtml(name) + '</h3>' +
            '<p class="cart-item-meta">Size: <strong>' + escapeHtml(item.size) + '</strong></p>' +
            '<p class="cart-item-price">' + escapeHtml(price) + '</p>' +
          '</div>' +
          '<div class="cart-item-actions">' +
            '<div class="cart-item-qty">' +
              '<button type="button" class="cart-qty-btn" data-action="dec" data-index="' + index + '" aria-label="Decrease quantity">−</button>' +
              '<span class="cart-qty-value">' + formatQty(item.qty) + '</span>' +
              '<button type="button" class="cart-qty-btn" data-action="inc" data-index="' + index + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="cart-remove-btn" data-remove-index="' + index + '">Remove</button>' +
          '</div>';

        itemsList.appendChild(li);
      });

      if (summaryCount) {
        var totalQty = items.reduce(function (sum, it) {
          return sum + formatQty(it.qty);
        }, 0);
        summaryCount.textContent = String(totalQty);
      }
    }

    // Escape HTML to prevent XSS from localStorage tampering
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // Event delegation for qty +/-, remove
    if (itemsList) {
      itemsList.addEventListener("click", function (e) {
        var target = e.target;

        var removeIdx = target.getAttribute && target.getAttribute("data-remove-index");
        if (removeIdx !== null) {
          var items = readCart();
          items.splice(parseInt(removeIdx, 10), 1);
          writeCart(items);
          render();
          return;
        }

        var action = target.getAttribute && target.getAttribute("data-action");
        var idx = target.getAttribute && target.getAttribute("data-index");
        if (action && idx !== null) {
          var list = readCart();
          var i = parseInt(idx, 10);
          if (!list[i]) return;

          if (action === "inc") {
            list[i].qty = formatQty(list[i].qty) + 1;
          } else if (action === "dec") {
            list[i].qty = formatQty(list[i].qty) - 1;
            if (list[i].qty < 1) {
              list.splice(i, 1);
            }
          }

          writeCart(list);
          render();
        }
      });
    }

    // Clear cart
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        writeCart([]);
        render();
      });
    }

    render();
  });
})();