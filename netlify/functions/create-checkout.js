// =====================================================
// STRIPE CHECKOUT - Netlify Serverless Function
// =====================================================
// This runs on Netlify's servers (not in the browser)
// so your Stripe secret key stays safe.
//
// When a customer clicks "Pay", this function:
// 1. Receives the cart items
// 2. Creates a Stripe Checkout session
// 3. Returns the URL to redirect the customer to
// =====================================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items, customerEmail } = JSON.parse(event.body);

    // Build line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.size} / ${item.color}`,
          // If you have image URLs, add them here:
          // images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.qty,
    }));

    // Add shipping if under $75
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (subtotal < 75) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: 599, // $5.99
        },
        quantity: 1,
      });
    }

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/`,
      // This metadata helps you identify orders
      metadata: {
        order_source: 'bayou-city-blues-store',
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
