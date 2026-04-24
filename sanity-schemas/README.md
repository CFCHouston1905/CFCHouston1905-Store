# Sanity Schemas

The Sanity Studio is hosted in a separate repo/folder, not in this storefront repo.

## Adding the `order` schema

1. Copy `order.js` from this folder into the studio project's `schemas/` (or `schemaTypes/`) directory.
2. Register it in the studio's schema index (commonly `schemas/index.js` or `sanity.config.js`):

   ```js
   import order from './order'

   export const schemaTypes = [
     // ...existing types
     order,
   ]
   ```

3. Redeploy the studio (`sanity deploy`) — the new "Order" document type will appear in the Studio sidebar.

No changes to the dataset are needed; orders are written directly via the Stripe webhook
(`netlify/functions/stripe-webhook.js`) using `SANITY_WRITE_TOKEN`.
