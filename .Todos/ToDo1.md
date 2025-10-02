# WigShop v1.0 – Supplemental TODO

## Code Snippets Pending Implementation

- [ ] **Always-visible, centered search bar**
  - Insert into `sections/header.liquid`:

    ```liquid
    <div class="header__search header__search--center">
      <form action="{{ routes.search_url }}" method="get" role="search" class="search-form">
        <input
          type="search"
          name="q"
          value="{{ search.terms | escape }}"
          placeholder="{{ 'general.search.search' | t }}"
          aria-label="{{ 'general.search.search' | t }}"
          class="search-input"
        >
        # WigShop v1.0 – Supplemental TODO

        ## Code Snippets Pending Implementation

        - [x] **Always-visible, centered search bar**
          - Insert into `sections/header.liquid`:

            ```liquid
            <div class="header__search header__search--center">
              <form action="{{ routes.search_url }}" method="get" role="search" class="search-form">
                <input
                  type="search"
                  name="q"
                  value="{{ search.terms | escape }}"
                  placeholder="{{ 'general.search.search' | t }}"
                  aria-label="{{ 'general.search.search' | t }}"
                  class="search-input"
                >
                <button type="submit" class="search-submit">
                  <span class="visually-hidden">{{ 'general.search.submit' | t }}</span>
                  <span class="svg-wrapper">{{ 'icon-search.svg' | inline_asset_content }}</span>
                </button>
              </form>
            </div>
            ```

          - Add to `assets/component-search.css`:

            ```css
            .header__search--center { display:flex; justify-content:center; }
            .search-form { max-width: 680px; width:100%; }
            ```

        - [x] **Alt text fallback captions under product images**
          - Insert into `snippets/product-media-gallery.liquid` under each media item:

            ```liquid
            {% assign fallback_alt = product.title %}
            {% if product.selected_or_first_available_variant and product.selected_or_first_available_variant.option1 %}
              {% assign fallback_alt = product.selected_or_first_available_variant.option1 %}
            {% endif %}
            <div class="media-caption">
              {{ media.alt | default: fallback_alt }}
            </div>
            ```

        - [x] **Map & Reviews embeds in footer**
          - Insert into `sections/footer.liquid` above `<footer>`:

            ```liquid
            {{ 'component-embeds.css' | asset_url | stylesheet_tag }}

            {% if settings.show_reviews %}
              <div class="reviews-embeds page-width">
                {% if settings.google_reviews_embed_url %}
                  <iframe class="reviews-embed" src="{{ settings.google_reviews_embed_url }}" loading="lazy"></iframe>
                {% endif %}
                {% if settings.facebook_reviews_embed_url %}
                  <iframe class="reviews-embed" src="{{ settings.facebook_reviews_embed_url }}" loading="lazy"></iframe>
                {% endif %}
              </div>
            {% endif %}

            {% if settings.show_store_map and settings.store_map_url %}
              <div class="store-map page-width">
                <iframe class="map-embed" src="{{ settings.store_map_url }}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            {% endif %}
            ```

          - Add to `assets/component-embeds.css`:

            ```css
            .reviews-embeds, .store-map { margin-block: 2rem; }
            .reviews-embed, .map-embed { width: 100%; min-height: 360px; border: 0; }
            ```

        - [x] **Inventory thresholds for swatches**
          - Insert into `snippets/variant-swatches.liquid`:

            ```liquid
            {% assign qty = variant.inventory_quantity | default: 0 %}
            {% assign very_low_threshold = settings.inventory_very_low_threshold | default: 3 %}
            {% assign low_threshold = settings.inventory_low_threshold | default: 9 %}
            {% assign stock_class = '' %}
            {% if qty == 0 %}
              {% assign stock_class = 'stock-out' %}
            {% elsif qty <= very_low_threshold %}
              {% assign stock_class = 'stock-very-low' %}
            {% elsif qty <= low_threshold %}
              {% assign stock_class = 'stock-low' %}
            {% endif %}

            <label class="swatch {{ stock_class }}">
              …
            </label>
            ```

          - Add to `assets/component-swatch.css`:

            ```css
            .swatch.stock-out .swatch-label { text-decoration: line-through; opacity: .6; }
            .swatch.stock-very-low { border: 2px solid #f2c14e; }
            .swatch.stock-low { border: 1px dashed #f2c14e; }
            ```

        ## Merchant Center

        - [x] **Build supplemental feed CSV** to override Shopify’s feed if swatch images appear.
          - Minimal template:

            ```csv
            id,image_link
            1234567890,https://yourstore.com/cdn/shop/products/laine-hero.jpg
            1234567891,https://yourstore.com/cdn/shop/products/another-hero.jpg
            ```

          - `id` = variant ID from your primary feed.
          - `image_link` = URL of the hero product image you want Google to use.
        - [x] **Add to ShopifyImporter project**
        - [x] **Upload supplemental feed** in Google Merchant Center and link it to the primary feed.
