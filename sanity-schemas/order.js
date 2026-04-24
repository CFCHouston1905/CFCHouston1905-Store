export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'customerEmail',
      title: 'Customer Email',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    },
    {
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'line1', title: 'Address Line 1', type: 'string' },
        { name: 'line2', title: 'Address Line 2', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'postalCode', title: 'Postal Code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string' },
      ],
    },
    {
      name: 'lineItems',
      title: 'Line Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'size', title: 'Size', type: 'string' },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'unitPrice', title: 'Unit Price (cents)', type: 'number' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'size', qty: 'quantity' },
            prepare({ title, subtitle, qty }) {
              return {
                title: `${title}${qty ? ` × ${qty}` : ''}`,
                subtitle: subtitle || '',
              };
            },
          },
        },
      ],
    },
    {
      name: 'subtotal',
      title: 'Subtotal (cents)',
      type: 'number',
    },
    {
      name: 'shipping',
      title: 'Shipping (cents)',
      type: 'number',
    },
    {
      name: 'total',
      title: 'Total (cents)',
      type: 'number',
    },
    {
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'usd',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Fulfilled', value: 'fulfilled' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'trackingNumber',
      title: 'Tracking Number',
      type: 'string',
    },
    {
      name: 'stripePaymentIntentId',
      title: 'Stripe Payment Intent ID',
      type: 'string',
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'notes',
      title: 'Notes',
      type: 'text',
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'customerEmail',
      status: 'status',
      total: 'total',
    },
    prepare({ title, subtitle, status, total }) {
      const dollars = typeof total === 'number' ? `$${(total / 100).toFixed(2)}` : '';
      return {
        title: title || subtitle || 'Order',
        subtitle: `${status || 'new'}${dollars ? ` — ${dollars}` : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
};
