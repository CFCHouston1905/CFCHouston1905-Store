const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body);
    // Handle chat messages (return error, chat should use a different endpoint)
    if (body.chatMessage) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: "I'm the Blues Assistant! Ask me about merch, sizing, or watch parties. KTBFFH!" }),
      };
    }
    const { items } = body;

    // Check if this is a raffle ticket purchase
    const isRaffle = items.some(i => (i.name || '').toLowerCase().includes('raffle'));

    const lineItems = items.map(item => {
      const metadata = {};
      if (item.id) metadata.sanityProductId = String(item.id);
      if (item.size) metadata.size = String(item.size);
      if (item.color) metadata.color = String(item.color);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || item.qty || 1,
      };
    });

    // Add shipping only if NOT raffle and subtotal under $75
    const subtotal = items.reduce((sum, i) => sum + i.price * (i.quantity || i.qty || 1), 0);
    if (!isRaffle && subtotal < 75) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: 599,
        },
        quantity: 1,
      });
    }

    // Build session config
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL || 'https://cfchouston1905.netlify.app'}/success.html`,
      cancel_url: `${process.env.URL || 'https://cfchouston1905.netlify.app'}/`,
      metadata: {
        order_source: 'bayou-city-blues-store',
      },
    };

    // Only collect shipping address for non-raffle orders
    if (!isRaffle) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US'],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
