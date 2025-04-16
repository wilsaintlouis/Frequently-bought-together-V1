// Wait until the page’s HTML is fully loaded before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Let’s look for any FBT sections on the page (we might have more than one)
    const sections = document.querySelectorAll('[data-section-id][data-product-handle]');
    
    // Check if we found any FBT sections, if not, let’s stop here
    if (!sections.length) {
      console.log('Couldn’t find any Frequently Bought Together sections on this page.');
      return;
    }
  
    // Loop through each FBT section we found and set it up
    sections.forEach(sectionEl => {
      // Grab the section ID and product handle from the data attributes we added in Liquid
      const sectionId = sectionEl.getAttribute('data-section-id');
      const productHandle = sectionEl.getAttribute('data-product-handle');
  
      // Make sure the data attributes were found or exist
      if (!sectionId || !productHandle) {
        console.error('Oops, we’re missing the section ID or product handle:', { sectionId, productHandle });
        sectionEl.innerHTML = '<p class="fbt-empty">Unable to load recommendations: Invalid section or product data.</p>';
        return;
      }
  
      // Let’s log this to see what we’re working with while we’re developing
      console.log('Setting up the FBT section with:', { sectionId, productHandle });
  
      // Find the variant picker (like the size dropdown on the product page)
      const variantInput = document.querySelector('input[name="id"]');
      console.log('variantInput:', variantInput);
      // If we can’t find the variant picker, let’s stop here
      if (!variantInput) {
        console.log('Couldn’t find the variant picker, so we’ll skip setting up the FBT section.');
        return;
      }
  
      // This function fetches the updated FBT section when the variant changes
      async function updateFBT(variantId) {
        const url = `/products/${productHandle}?section_id=${sectionId}&variant=${variantId}`;
        // Show a loading message while we grab the new section
        sectionEl.innerHTML = '<div class="fbt-placeholder">Loading recommendations...</div>';
        try {
          const res = await fetch(url, { headers: { 'Accept': 'text/html' } });
          // Check if the fetch worked, if not, throw an error
          if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
          const html = await res.text();
          // Update the section with the new HTML we got
          sectionEl.innerHTML = html;
          // Add a nice fade-in effect so it looks smooth
          sectionEl.style.opacity = 0;
          sectionEl.style.transition = 'opacity 0.3s';
          requestAnimationFrame(() => { sectionEl.style.opacity = 1; });
          // Set up the event listeners again since we replaced the DOM
          initializeFBT();
        } catch (err) {
          console.error('Something went wrong fetching the FBT section:', err);
          sectionEl.innerHTML = '<p class="fbt-empty">Oops, something went wrong!</p>';
        }
      }
  
      // This adds up the prices of all the checked items and shows the total
      function updateTotalPrice() {
        const form = sectionEl.querySelector('[data-fbt-form]');
        // Make sure we found the form
        if (!form) return;
        const totalPriceEl = form.querySelector('.fbt-total-price');
        // Make sure we found the place to show the total price
        if (!totalPriceEl) return;
        const checkboxes = form.querySelectorAll('input[name="items[]"]:checked');
        let total = 0;
        // Add up the price of each checked item
        checkboxes.forEach(checkbox => {
          const price = parseInt(checkbox.getAttribute('data-price'));
          total += price;
        });
        // Show the total price in dollars (Shopify prices are in cents, so we divide by 100)
        totalPriceEl.textContent = `$${ (total / 100).toFixed(2) }`;
      }
  
      // This shows a little pop-up message, like “Added to cart!”
      function showToast(message, duration = 3000) {
        const toast = document.getElementById(`fbt-toast-${sectionId}`);
        // Check if we found the toast element
        if (!toast) {
          console.warn('Couldn’t find the toast element for this section:', sectionId);
          return;
        }
        toast.textContent = message;
        toast.classList.add('show');
        // Hide the toast after a few seconds
        setTimeout(() => {
          toast.classList.remove('show');
        }, duration);
      }
  
      // This updates the cart count in the header (like the little number on the cart icon)
      async function updateCartCount() {
        try {
          const res = await fetch('/cart.js', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          // Check if the fetch worked
          if (!res.ok) throw new Error('Failed to fetch cart');
          const cart = await res.json();
          const cartCountEl = document.querySelector('.cart-count');
          // Update the cart count if we found the element
          if (cartCountEl) {
            cartCountEl.textContent = cart.item_count;
            cartCountEl.style.display = cart.item_count > 0 ? 'inline-block' : 'none';
          }
        } catch (err) {
          console.error('Something went wrong updating the cart count:', err);
        }
      }
  
      // This handles the “Add to Cart” button when the user submits the form
      async function bindAddToCart() {
        const form = sectionEl.querySelector('[data-fbt-form]');
        // Make sure we found the form
        if (!form) return;
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const items = Array.from(form.querySelectorAll('input[name="items[]"]:checked'))
            .map(input => ({
              id: input.value,
              quantity: 1
            }));
          // Check if the user selected any items
          if (items.length === 0) {
            showToast('Please select at least one product to add to cart.', 4000);
            return;
          }
          try {
            const res = await fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ items })
            });
            // Check if the cart update worked
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.description || 'Failed to add items to cart');
            }
            const data = await res.json();
            // Make sure all items were added
            if (data.items.length === items.length) {
              showToast('Products added to cart successfully!');
              await updateCartCount();
            } else {
              showToast('Some products could not be added to cart.', 4000);
            }
          } catch (err) {
            showToast('Error adding to cart: ' + err.message, 4000);
          }
        });
  
        // Update the total price whenever a checkbox changes
        const checkboxes = form.querySelectorAll('input[name="items[]"]');
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', updateTotalPrice);
        });
      }
  
      // This sets up the FBT section when it first loads or updates
      function initializeFBT() {
        bindAddToCart();
        updateTotalPrice();
      }
  
      // This helper function slows down how often we call a function, like updateFBT
      const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      };
  
      // Set up the variant picker to update the FBT section, but not too fast
      const debouncedUpdate = debounce(updateFBT, 300);
      variantInput.addEventListener('change', () => debouncedUpdate(variantInput.value));
      // Load the FBT section right away with the default variant
      updateFBT(variantInput.value);
    });
  });