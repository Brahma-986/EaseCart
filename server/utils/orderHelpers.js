const Product = require('../models/Product');

/**
 * Build order line items from cart payload. Optionally deducts stock when deductStock is true.
 * @param {Array<{ product: string, quantity: number }>} items
 * @param {{ deductStock?: boolean }} options
 */
async function buildOrderItemsFromCart(items, { deductStock = false } = {}) {
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      const err = new Error(`Product ${item.product} not found or inactive`);
      err.status = 400;
      throw err;
    }

    if (product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.status = 400;
      throw err;
    }

    if (deductStock) {
      product.stock -= item.quantity;
      await product.save();
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url
    });

    subtotal += product.price * item.quantity;
  }

  const taxPrice = subtotal * 0.1;
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  return { orderItems, taxPrice, shippingPrice, totalPrice };
}

module.exports = { buildOrderItemsFromCart };
