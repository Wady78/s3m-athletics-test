/* ============================================================
   S3M ATHLETICS — PRODUCT REGISTRY
   Single source of truth for product IDs.
   Placeholder content only — no real names, prices, stock,
   or images until official S3M data is supplied.

   ID scheme: s3m-<category>-<product-type>-<2-digit-number>
   Homepage cards reuse the same IDs as the catalog entries
   they represent, so a cart entry resolves identically on
   both pages.
   ============================================================ */

window.S3M_PRODUCTS = {
  /* ---- Homepage subset (also present in catalog) ---- */
  "s3m-jersey-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Jersey — homepage card 1"
  },
  "s3m-shorts-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Shorts — homepage card 2"
  },
  "s3m-tshirt-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "T-Shirt — homepage card 3"
  },
  "s3m-hoodie-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Hoodie — homepage card 4"
  },
  "s3m-accessory-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Accessories — homepage card 5"
  },
  "s3m-footwear-01": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Footwear — homepage card 6"
  },

  /* ---- Catalog-only extras (also present in catalog) ---- */
  "s3m-jersey-02": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Jersey — catalog card 2"
  },
  "s3m-shorts-02": {
    name: "[Product Name]",
    price: "[Price Pending]",
    category: "[Category Pending]",
    note: "Shorts — catalog card 4"
  }
};

/* Utility: safe lookup */
window.S3M_getProduct = function (id) {
  return window.S3M_PRODUCTS[id] || null;
};