/* ============================================================
   S3M ATHLETICS — PRODUCT DETAIL PAGE INTERACTIONS
   Vanilla JS. UI + localStorage cart writes. No backend.
   ============================================================ */

(function () {
  "use strict";

  var CART_KEY = "s3m_cart";

  document.addEventListener("DOMContentLoaded", function () {
    var sizeButtons = document.querySelectorAll(".pdp-size-btn");
    var qtyInput = document.getElementById("pdp-quantity");
    var qtyButtons = document.querySelectorAll(".pdp-qty-btn");
    var addToCartBtn = document.getElementById("pdp-add-to-cart");
    var cartNote = document.getElementById("pdp-cart-note");

    var selectedSize = null;
    var MIN_QTY = 1;

    // Read product id from ?id= query param
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");
    var product = productId && window.S3M_getProduct
      ? window.S3M_getProduct(productId)
      : null;

    // Fill PDP with placeholder content for this product, if known
    if (product) {
      var nameEl = document.querySelector(".pdp-name");
      var catEl = document.querySelector(".pdp-category");
      var priceEl = document.querySelector(".pdp-price");
      if (nameEl && product.name) nameEl.textContent = product.name;
      if (catEl && product.category) catEl.textContent = product.category;
      if (priceEl && product.price) priceEl.textContent = product.price;
    }

    // --- Size selection ---
    sizeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var wasSelected = btn.getAttribute("aria-pressed") === "true";

        sizeButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });

        if (!wasSelected) {
          btn.setAttribute("aria-pressed", "true");
          selectedSize = btn.getAttribute("data-size");
        } else {
          selectedSize = null;
        }

        updateAddToCartState();
      });
    });

    // --- Quantity stepper ---
    qtyButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-qty-action");
        var current = parseInt(qtyInput.value, 10);
        if (isNaN(current)) current = MIN_QTY;

        if (action === "inc") {
          qtyInput.value = String(current + 1);
        } else if (action === "dec") {
          qtyInput.value = String(Math.max(MIN_QTY, current - 1));
        }
      });
    });

    qtyInput.addEventListener("input", function () {
      var value = parseInt(qtyInput.value, 10);
      if (isNaN(value) || value < MIN_QTY) {
        qtyInput.value = String(MIN_QTY);
      }
    });

    // --- Add to Cart (writes to localStorage) ---
    function updateAddToCartState() {
      if (selectedSize && productId) {
        addToCartBtn.removeAttribute("disabled");
      } else {
        addToCartBtn.setAttribute("disabled", "");
      }
    }

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
      } catch (err) {
        /* storage may be disabled — fail silently */
      }
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        if (!selectedSize || !productId) return;

        var qty = parseInt(qtyInput.value, 10) || MIN_QTY;

        // Check if this id+size already exists — merge qty
        var items = readCart();
        var existingIndex = items.findIndex(function (it) {
          return it.id === productId && it.size === selectedSize;
        });

        if (existingIndex >= 0) {
          items[existingIndex].qty += qty;
        } else {
          items.push({ id: productId, size: selectedSize, qty: qty });
        }

        writeCart(items);
        window.dispatchEvent(new Event("s3m:cart-updated"));

        if (cartNote) {
          cartNote.textContent =
            "Added to cart — " + selectedSize + " × " + qty +
            ". [Cart preview coming in the next step].";
        }
      });
    }

    // Initial disabled state
    updateAddToCartState();
  });
})();