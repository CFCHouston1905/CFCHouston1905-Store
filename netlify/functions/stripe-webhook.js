const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@sanity/client');

const sanity = createClient({
  projectId: 'a9vovusz',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!signature) {
    console.warn('stripe-webhook: missing stripe-signature header');
    return { statusCode: 400, body: 'Missing stripe-signature header' };
  }

  // Stripe requires the raw request body for signature verification.
  // Netlify may base64-encode the body — decode without parsing it.
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('stripe-webhook: signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
  }

  console.log(`stripe-webhook: received event ${stripeEvent.id} type=${stripeEvent.type}`);

  if (stripeEvent.type !== 'checkout.session.completed') {
    console.log(`stripe-webhook: ignoring event type ${stripeEvent.type}`);
    return { statusCode: 200, body: JSON.stringify({ received: true, ignored: true }) };
  }

  try {
    const sessionId = stripeEvent.data.object.id;

    // Idempotency: webhooks can be redelivered. Bail out if we've already stored this session.
    const existing = await sanity.fetch(
      '*[_type == "order" && stripeSessionId == $sid][0]{_id}',
      { sid: sessionId }
    );
    if (existing) {
      console.log(`stripe-webhook: order for session ${sessionId} already exists (${existing._id}); skipping`);
      return { statusCode: 200, body: JSON.stringify({ received: true, duplicate: true }) };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    const shipping = session.shipping_details || session.customer_details || {};
    const addr = (session.shipping_details && session.shipping_details.address)
      || (session.customer_details && session.customer_details.address)
      || {};

    const allLines = (session.line_items && session.line_items.data) || [];
    // Stripe stores the inline "Shipping" line as a separate line item; split it out.
    const productLines = [];
    let shippingCents = 0;
    for (const li of allLines) {
      const product = li.price && li.price.product;
      const productName = (product && product.name) || li.description || '';
      if (productName.toLowerCase() === 'shipping') {
        shippingCents += li.amount_total || 0;
        continue;
      }
      const meta = (product && product.metadata) || {};
      productLines.push({
        _key: li.id,
        name: productName,
        size: meta.size || '',
        quantity: li.quantity || 1,
        unitPrice: (li.price && li.price.unit_amount) || 0,
      });
    }

    if (typeof session.shipping_cost === 'object' && session.shipping_cost) {
      shippingCents = session.shipping_cost.amount_total || shippingCents;
    }

    const totalCents = session.amount_total || 0;
    const subtotalCents = (session.amount_subtotal != null)
      ? session.amount_subtotal
      : Math.max(totalCents - shippingCents, 0);

    const doc = {
      _type: 'order',
      stripeSessionId: sessionId,
      customerEmail: (session.customer_details && session.customer_details.email) || session.customer_email || '',
      customerName: (session.shipping_details && session.shipping_details.name)
        || (session.customer_details && session.customer_details.name)
        || '',
      shippingAddress: {
        line1: addr.line1 || '',
        line2: addr.line2 || '',
        city: addr.city || '',
        state: addr.state || '',
        postalCode: addr.postal_code || '',
        country: addr.country || '',
      },
      lineItems: productLines,
      subtotal: subtotalCents,
      shipping: shippingCents,
      total: totalCents,
      currency: session.currency || 'usd',
      status: 'new',
      stripePaymentIntentId: typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent && session.payment_intent.id) || '',
      createdAt: new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    };

    const created = await sanity.create(doc);
    console.log(`stripe-webhook: created Sanity order ${created._id} for session ${sessionId}`);

    return { statusCode: 200, body: JSON.stringify({ received: true, orderId: created._id }) };
  } catch (err) {
    console.error('stripe-webhook: processing error:', err);
    return { statusCode: 500, body: `Webhook handler failed: ${err.message}` };
  }
};
