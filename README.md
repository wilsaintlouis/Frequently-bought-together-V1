# Frequently Bought Together Section - README

Hey there, this README walks you through setting up the "Frequently Bought Together" (FBT) section in your Shopify store. It’s a feature that shows related products on a product page, letting customers add them to their cart in one go. To make this work, you’ll need to set up some metafields to store related products, add those products to the metafield, add the section to your theme, and apply a custom color scheme to match your store’s look. Let’s get started.

## What You’ll Need
- A Shopify store with admin access
- A product page where you want to show the FBT section
- Some related products to recommend (like a camera and a tripod)
- Access to your theme’s code editor to add the custom color scheme (if it’s not already set up)

## Step 1: Set Up Metafields for Related Products
We’ll use metafields to store the related products for each product in your store. Shopify lets you add custom data to products with metafields, and we’ll use that to list related product handles.

1. Go to your Shopify admin.
2. Click on **Settings** in the bottom left, then select **Custom Data**.
3. Under **Metafields**, click **Products**, then hit **Add Definition**.
4. Fill in the details for the metafield:
   - **Name**: Related Products
   - **Namespace and Key**: Set the namespace to `fbt` and the key to `related_products` (so it’s `fbt.related_products`).
   - **Description**: Add something like “Handles of related products for the FBT section” to remind yourself later.
   - **Type**: Choose **List of Product References**. This lets you pick multiple products.
   - **Access**: Make sure it’s accessible to the Storefront API (check the box for “Expose this metafield to the Storefront API”).
5. Save the metafield definition.

Now every product in your store can have a list of related products stored in this metafield.

## Step 2: Add Related Products to the Metafield
Next, let’s add some related products to a specific product using the metafield we just set up.

1. In your Shopify admin, go to **Products**.
2. Pick a product where you want to show the FBT section (like a camera).
3. Scroll down to the **Metafields** section on the product page.
4. Find the **Related Products** metafield (it’ll show up as `fbt.related_products`).
5. Click on it and start typing the names of related products (like a tripod, camera bag, or lens). Shopify will suggest products as you type.
6. Select the products you want to recommend (you can add as many as you’d like, but 2-4 is a good number for the FBT section).
7. Save the product.

Repeat this for any other products where you want to show related recommendations. If you have a lot of products, you can use the Shopify Admin API to bulk-update metafields, but that’s a bit more advanced—we can cover that later if you need help.

## Step 3: Add the FBT Section to Your Theme
Now that the metafields are set up, let’s add the FBT section to your product page.

1. In your Shopify admin, go to **Online Store** > **Themes**.
2. Find your active theme and click **Customize**.
3. In the theme editor, go to a product page (you can pick a default product or a specific one).
4. On the left sidebar, click **Add Section**, then look for “Frequently Bought Together” (you might need to upload the `frequently-bought-together.liquid` file to your theme’s `sections` folder first—check Step 4 if you don’t have it yet).
5. Drag the FBT section to where you want it on the product page (usually below the product description or add-to-cart button works well).
6. Save your changes.

## Step 4: Upload the Required Files (If Not Already Done)
If you haven’t added the FBT section files to your theme yet, let’s do that now. These files include the section code and the JavaScript that makes it work.

1. In your Shopify admin, go to **Online Store** > **Themes**.
2. Find your active theme and click **Actions** > **Edit Code**.
3. In the code editor:
   - Under **Sections**, click **Add a New Section** and name it `frequently-bought-together`. Copy the `frequently-bought-together.liquid` file content into it (you’ll need the section code from the developer who built this—or I can provide it if you need it).
   - Under **Assets**, click **Add a New Asset** and upload the `fbt-section.js` file. This handles the dynamic updates and add-to-cart functionality.
4. Save both files.
## Step 5: Add the CSS File for Styling
Let’s add the CSS file that styles the FBT section. This will control how the section looks—like the layout, spacing, and toast notifications.

1. In your Shopify admin, go to **Online Store** > **Themes**.
2. Find your active theme and click **Actions** > **Edit Code**.
3. In the code editor, under **Assets**, click **Add a New Asset**.
4. Choose **Create a Blank File**, name it `fbt-section.css`, and select `.css` as the file type.
5. Open the `fbt-section.css` file you just created.
6. Go to the repository 
7. In the repo, locate the `fbt-section.css` file, copy all the CSS code inside it, and paste it into the `fbt-section.css` file in your Shopify theme.
8. Save the file.


## Step 6: Apply a Custom Color Scheme (Optional)
If you want to match the FBT section to your store’s branding, you can apply a custom color scheme (Scheme 6). This step is optional since the `fbt-section.css` file already provides basic styling.

### Add the Color Scheme to Your Theme
First, we need to add Scheme 6 to your theme’s settings if it’s not already there.

1. In your Shopify admin, go to **Online Store** > **Themes**.
2. Find your active theme and click **Actions** > **Edit Code**.
3. In the code editor, open the `config/settings_data.json` file.
4. Look for the `"color_schemes"` section. You should see entries like `scheme-1`, `scheme-2`, etc.
5. Add the following Scheme 6 if it’s not already there (or update it to match these values):
   ```json
   "scheme-6": {
     "settings": {
       "background": "#F5E8E4",
       "background_gradient": "",
       "text": "#2A2A2A",
       "button": "#D55F7A",
       "button_label": "#FFFFFF",
       "secondary_button_label": "#2A2A2A",
       "shadow": "#0000001A"
     }
   }
