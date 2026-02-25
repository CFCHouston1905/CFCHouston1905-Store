# Bayou City Blues Store - Complete Setup Guide

Everything you need to get your merch store live, step by step.
No coding experience required. Every click is explained.

---

## WHAT YOU'RE BUILDING

A professional merch store at something like `bayoucityblues.netlify.app`
(or your own custom domain like `chelseahouston.com`) with:

- Product catalog managed from a dashboard (no code editing)
- Real credit card payments through Stripe
- AI shopping assistant
- Matchday event listings

---

## ACCOUNTS YOU NEED (all free to start)

1. **GitHub** (github.com) - stores your website code
2. **Netlify** (netlify.com) - hosts your website
3. **Sanity** (sanity.io) - product management dashboard
4. **Stripe** (stripe.com) - payment processing

---

## STEP 1: CREATE YOUR ACCOUNTS

### GitHub
1. Go to github.com
2. Click "Sign up"
3. Use your email, create a password
4. Verify your email

### Netlify
1. Go to netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest)
4. Authorize Netlify to access your GitHub

### Sanity
1. Go to sanity.io
2. Click "Get started"
3. Sign up with GitHub or Google
4. You'll set up your project in Step 3 below

### Stripe
1. Go to stripe.com
2. Click "Start now"
3. Enter your email and create an account
4. You can use "test mode" to start (no real charges)
5. Later, complete identity verification to accept real payments

---

## STEP 2: UPLOAD THE CODE TO GITHUB

1. Log into GitHub
2. Click the "+" icon in the top right, then "New repository"
3. Name it: `bayou-city-blues-store`
4. Make sure "Public" is selected
5. Check "Add a README file"
6. Click "Create repository"

Now upload the project files:
1. In your new repo, click "Add file" > "Upload files"
2. Drag the entire project folder contents into the upload area
   (all the files: package.json, index.html, netlify.toml, vite.config.js,
   the src/ folder, the netlify/ folder, the public/ folder)
3. Click "Commit changes"

### Add your logo images
1. In GitHub, navigate to the `public/images/` folder
2. Click "Add file" > "Upload files"
3. Upload your three logo files, named exactly:
   - `logo-circle.png` (the Chelsea Houston round crest)
   - `logo-shield.jpeg` (the Bayou City Blues shield)
   - `logo-vertical.png` (the HOU/LDN 1905 mark)
4. Commit the changes

---

## STEP 3: SET UP SANITY (Your Product Dashboard)

### Create the Sanity project
1. Go to sanity.io/manage
2. Click "Create new project"
3. Name it "Bayou City Blues Store"
4. Choose the "Free" plan
5. Select "Create empty project"
6. Note your **Project ID** (looks like "abc123xy") - you'll need this

### Set up CORS (allows your website to talk to Sanity)
1. In your Sanity project dashboard, go to Settings > API
2. Under "CORS Origins", click "Add CORS origin"
3. Add: `http://localhost:5173` (for local testing)
4. Add your Netlify URL once you have it (e.g., `https://bayoucityblues.netlify.app`)
5. Check "Allow credentials" for both

### Create your product schema
1. Install Sanity Studio locally OR use Sanity Studio v3 hosted
   The easiest way: go to sanity.io/manage, click your project,
   then "Studio" to access the hosted studio

2. You need to define a "product" document type. Create a file in your
   Sanity studio project called `schemas/product.js`:

```javascript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: Rule => Rule.required().positive(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Apparel', value: 'apparel' },
          { title: 'Hats & Scarves', value: 'hats' },
          { title: 'Drinkware', value: 'drinkware' },
          { title: 'Stickers & More', value: 'accessories' },
          { title: 'Banners & Flags', value: 'banners' },
        ],
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      description: 'Upload a square image (800x800px recommended)',
      options: { hotspot: true },
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: '2XL', value: '2XL' },
          { title: 'One Size', value: 'One Size' },
        ],
      },
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'featured',
      title: 'Featured Product?',
      type: 'boolean',
      description: 'Show this product in the Featured section on the homepage',
    },
  ],
}
```

### Update your website code with your Sanity Project ID
1. Go to your GitHub repo
2. Navigate to `src/sanity.js`
3. Click the pencil icon to edit
4. Replace `YOUR_PROJECT_ID` with your actual Sanity project ID
5. Commit the change

### Adding products in Sanity
Once your studio is set up:
1. Go to your Sanity Studio
2. Click "Product" in the sidebar
3. Click the "+" to create a new product
4. Fill in: name, price, category, description
5. Upload a product image (800x800px square works best for consistency)
6. Select available sizes and add colors
7. Toggle "Featured" if you want it on the homepage
8. Click "Publish"

The product will appear on your website within about 60 seconds.

---

## STEP 4: CONNECT TO NETLIFY

1. Log into Netlify
2. Click "Add new site" > "Import an existing project"
3. Choose "GitHub"
4. Find and select your `bayou-city-blues-store` repo
5. Netlify auto-detects the build settings from netlify.toml:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

First deploy takes about 2-3 minutes. You'll get a URL like:
`https://random-name-12345.netlify.app`

### Change your site name
1. Go to Site settings > General > Site details
2. Click "Change site name"
3. Change it to something like `bayoucityblues` or `chelseahouston`
4. Your URL becomes: `https://bayoucityblues.netlify.app`

### Custom domain (optional, ~$12/year)
1. Buy a domain from Namecheap or Google Domains
   (e.g., chelseahouston.com or bayoucityblues.com)
2. In Netlify: Domain settings > Add custom domain
3. Follow the DNS instructions Netlify gives you

---

## STEP 5: SET UP STRIPE PAYMENTS

### Get your Stripe keys
1. Log into Stripe
2. Make sure you're in "Test mode" (toggle in the top right)
3. Go to Developers > API keys
4. Copy your "Secret key" (starts with `sk_test_...`)

### Add keys to Netlify
1. In Netlify, go to Site settings > Environment variables
2. Add these variables:
   - Key: `STRIPE_SECRET_KEY` / Value: your Stripe secret key
   - Key: `ANTHROPIC_API_KEY` / Value: your Anthropic API key (for the chat assistant)
3. Redeploy: go to Deploys > click "Trigger deploy" > "Deploy site"

### Install Stripe in your functions
The Netlify function needs the Stripe npm package. Add this to the
netlify/functions folder:

Create a file `netlify/functions/package.json`:
```json
{
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

### Test a payment
1. Go to your live site
2. Add items to cart
3. Click Checkout
4. You'll be redirected to Stripe's payment page
5. Use test card: 4242 4242 4242 4242 (any future date, any CVC)
6. Check your Stripe dashboard to see the test payment

### Go live with real payments
1. Complete Stripe's identity verification
2. Toggle from "Test mode" to "Live mode" in Stripe
3. Copy your LIVE secret key (starts with `sk_live_...`)
4. Update the `STRIPE_SECRET_KEY` in Netlify environment variables
5. Redeploy

---

## STEP 6: MANAGING YOUR STORE DAY-TO-DAY

### Adding a new product
1. Go to your Sanity Studio (sanity.io/manage > your project > Studio)
2. Create new Product document
3. Fill in details and upload image
4. Click Publish
5. Product appears on your site automatically

### Removing a product
1. Find the product in Sanity Studio
2. Click the three dots menu > Delete
3. Confirm deletion

### Updating prices or descriptions
1. Find the product in Sanity Studio
2. Edit the fields you want to change
3. Click Publish

### Checking orders
1. Go to dashboard.stripe.com
2. Click "Payments" in the sidebar
3. See all orders, customer info, and payment status
4. Stripe sends you an email for each new payment

### Product image tips
- Use SQUARE images: 800x800 pixels
- Same background color/style for all products
- Use Placeit.net or Smartmockups.com for product mockups
- Photo of the actual product on a white/simple background also works great

---

## QUICK REFERENCE

| What | Where |
|------|-------|
| Edit website code | github.com (your repo) |
| Add/edit products | sanity.io/manage (Studio) |
| View orders & payments | dashboard.stripe.com |
| Site settings & deploys | app.netlify.com |
| Your live site | bayoucityblues.netlify.app |

---

## TROUBLESHOOTING

**Products not showing up?**
- Make sure you published (not just saved) in Sanity
- Check that your Sanity Project ID is correct in src/sanity.js
- Check that CORS is set up for your domain in Sanity settings

**Checkout not working?**
- Make sure STRIPE_SECRET_KEY is set in Netlify environment variables
- Make sure you redeployed after adding the variable
- Check Netlify function logs: Netlify dashboard > Functions

**Site not deploying?**
- Check the deploy log in Netlify for error messages
- Make sure all files are uploaded to GitHub correctly
- The build command should be `npm run build` and publish dir should be `dist`

**Chat assistant not responding?**
- Add your ANTHROPIC_API_KEY to Netlify environment variables
- The free tier has rate limits, so it may be slow under heavy use

---

## COSTS

- **Netlify**: Free (100GB bandwidth, plenty for a supporters group)
- **Sanity**: Free (up to 100K API requests/month)
- **Stripe**: 2.9% + 30 cents per transaction (no monthly fee)
- **GitHub**: Free
- **Custom domain**: ~$12/year (optional)
- **Total monthly cost: $0** (just Stripe's per-transaction fee)

---

KTBFFH! If you get stuck, bring the error message back to Claude and
we'll figure it out together.
