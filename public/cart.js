// cart.js
// Wires up the "Add to Cart" and "Buy Now" buttons on every product page.
// Both buttons save the item to MongoDB first (via the backend API), and
// only navigate to the next page once that save has actually succeeded.
//
// - "Add to Cart"  -> saves to DB -> goes to cart.html
// - "Buy Now"      -> saves to DB -> goes straight to checkout.html
//
// Works on any page that has .cart / .buy buttons and a <select> for
// quantity, because it reads the product slug straight from the URL.

document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.querySelector(".cart");
  const buyBtn = document.querySelector(".buy");
  if (!cartBtn && !buyBtn) return; // not a product page

  const qtySelect = document.querySelector("select");
  const slug = window.location.pathname.split("/").pop().replace(".html", "");

  function getQuantity() {
    if (!qtySelect) return 1;
    return parseInt(qtySelect.value, 10) || 1;
  }

  // Saves the item to MongoDB. Returns true on success, false on failure.
  async function addToCart(slug, quantity) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Could not add item to cart. Please try again.");
        return false;
      }
      return true;
    } catch (err) {
      alert("Network error — is the server running? Please try again.");
      return false;
    }
  }

  // Disables a button and shows a temporary "working" label while a
  // request is in flight, so people can't double-click and add it twice.
  function withLoadingState(button, workingLabel, fn) {
    return async () => {
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = workingLabel;
      try {
        await fn();
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    };
  }

  if (cartBtn) {
    cartBtn.addEventListener(
      "click",
      withLoadingState(cartBtn, "Adding...", async () => {
        const ok = await addToCart(slug, getQuantity());
        if (ok) {
          window.location.href = "cart.html";
        }
      })
    );
  }

  if (buyBtn) {
    buyBtn.addEventListener(
      "click",
      withLoadingState(buyBtn, "Please wait...", async () => {
        const ok = await addToCart(slug, getQuantity());
        if (ok) {
          window.location.href = "checkout.html";
        }
      })
    );
  }
});

// Optional: shows a live cart item count next to the nav if an element
// with id="cart-count" exists on the page (cart.html already has one).
async function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  try {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    const count = data.items.reduce((sum, i) => sum + i.quantity, 0);
    badge.textContent = count;
  } catch (err) {
    // silently ignore — badge just won't update
  }
}
updateCartBadge();
