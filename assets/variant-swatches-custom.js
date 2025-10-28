/* AUDIT HEADER — WigShop v1.0
   File: assets/variant-swatches-custom.js
   Purpose: Custom variant swatch interaction handler
   Notes:
     - Handles swatch clicks and variant selection
     - Updates URL, price, images, and buy button
     - TODO: Color group filtering (implement with metafields)
*/

class VariantSwatchesCustom {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId;
    this.productId = container.dataset.productId;
    this.variantData = JSON.parse(document.getElementById(`variant-data-${this.sectionId}`).textContent);
    this.variantSelect = document.getElementById(`variant-select-${this.sectionId}`);
    this.productForm = document.getElementById(`product-form-${this.sectionId}`);

    this.init();
  }

  init() {
    // TODO: Color group filter functionality - implement when metafields are ready
    /*
    const colorGroups = document.querySelectorAll('#color-groups a');
    colorGroups.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterByColorGroup(link.dataset.colorGroup);

        // Update active state
        colorGroups.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
    */

    // Dropdown select handler - sync with swatches
    if (this.variantSelect) {
      this.variantSelect.addEventListener('change', (e) => {
        const variantId = e.target.value;
        const variant = this.variantData.find((v) => v.id == variantId);

        if (variant) {
          this.updateSelectedSwatch(variantId);
          this.updateURL(variantId);
          this.updateProductInfo(variant);
        }
      });
    }

    // Swatch click handlers - allow clicking all variants including sold out
    const swatches = this.container.querySelectorAll('.swatch-figure');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const variantId = swatch.dataset.variantId;
        this.selectVariant(variantId);
      });
    });
  }

  // TODO: Implement color group filtering when metafields are added
  /*
  filterByColorGroup(group) {
    const swatches = this.container.querySelectorAll('.swatch-figure');

    swatches.forEach(swatch => {
      if (group === 'all' || swatch.dataset.colorGroup === group) {
        swatch.classList.remove('hidden');
      } else {
        swatch.classList.add('hidden');
      }
    });
  }
  */

  selectVariant(variantId) {
    const variant = this.variantData.find((v) => v.id == variantId);

    if (!variant) {
      return;
    }

    // Allow selection of sold out variants (removed availability check)

    // Update UI
    this.updateSelectedSwatch(variantId);

    // Update hidden select
    this.variantSelect.value = variantId;

    // Update URL
    this.updateURL(variantId);

    // Update product info (price, images, etc.)
    this.updateProductInfo(variant);

    // Dispatch event for other components
    this.variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateSelectedSwatch(variantId) {
    const swatches = this.container.querySelectorAll('.swatch-figure');

    swatches.forEach((swatch) => {
      if (swatch.dataset.variantId == variantId) {
        swatch.classList.add('selected');
      } else {
        swatch.classList.remove('selected');
      }
    });
  }

  updateURL(variantId) {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variantId);
    window.history.replaceState({}, '', url);
  }

  updateProductInfo(variant) {
    console.log('Updating product info for variant:', variant);

    // Update price using Shopify's product-info component if available
    const productInfo = document.querySelector(`#MainProduct-${this.sectionId}`);
    if (productInfo && productInfo.setActiveVariant) {
      // Use native Shopify method if available
      productInfo.setActiveVariant(variant.id);
    }

    // Also update price manually as fallback
    if (productInfo) {
      // Look for price-block (custom structure) or .price span directly
      const priceBlock = productInfo.querySelector('.price-block');
      const priceSpan = priceBlock ? priceBlock.querySelector('.price') : productInfo.querySelector('.price');

      console.log('Price container found:', priceSpan);

      if (priceSpan && variant.price) {
        // Simple price structure - just update the text content
        priceSpan.textContent = this.formatMoney(variant.price);

        // Update compare-at price if exists
        const comparePrice = priceBlock ? priceBlock.querySelector('.compare-price') : null;
        if (comparePrice) {
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            comparePrice.textContent = 'Regular price: ' + this.formatMoney(variant.compare_at_price);
            comparePrice.style.display = '';
            priceSpan.classList.add('price--on-sale');
          } else {
            comparePrice.style.display = 'none';
            priceSpan.classList.remove('price--on-sale');
          }
        }

        console.log('Price updated to:', this.formatMoney(variant.price));
      }
    }

    // Update main product image - look for first media item
    if (variant.featured_image && variant.featured_image.src) {
      const mediaGallery =
        document.querySelector('.product__media-list') || document.querySelector('.product__media-wrapper');
      if (mediaGallery) {
        const mainImage = mediaGallery.querySelector('img');
        if (mainImage) {
          // Use proper Shopify image size
          const imageUrl = variant.featured_image.src.replace(/\.(jpg|jpeg|png|gif|webp)/i, '_800x.$1');
          mainImage.src = imageUrl;
          mainImage.srcset = imageUrl;
          mainImage.alt = variant.title || variant.featured_image.alt || variant.option1;
          console.log('Image alt updated to:', mainImage.alt);
        }
      }
    }

    // Update buy button availability
    const buyButton =
      this.productForm?.querySelector('[name="add"]') ||
      document.querySelector(`#product-form-${this.sectionId} [name="add"]`);
    if (buyButton) {
      if (variant.available) {
        buyButton.disabled = false;
        buyButton.textContent = buyButton.dataset.addToCartText || 'Add to cart';
      } else {
        buyButton.disabled = true;
        buyButton.textContent = buyButton.dataset.soldOutText || 'Sold out';
      }
    }
  }

  formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('.swatch-container');
  containers.forEach((container) => {
    new VariantSwatchesCustom(container);
  });
});
