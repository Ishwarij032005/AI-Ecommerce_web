import React, { useState } from 'react';
import API from '../api/api';
import { getCart, setCart } from '../utils/storage';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const cart = getCart();
  const total = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cart.map(it => ({ product: it.productId, qty: it.qty || 1, price: it.price }));
      const res = await API.post('/orders', { items, total });
      setOrder(res.data);
      setCart([]);
    } catch (err) {
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <div className="container py-8">
        <div className="bg-white p-6 rounded">
          <h2 className="text-2xl font-semibold">Order Confirmed</h2>
          <p>Order ID: {order._id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="bg-white p-6 rounded">
        <div>Total: ${total.toFixed(2)}</div>
        <button onClick={handleCheckout} disabled={loading || cart.length === 0} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
          {loading ? 'Processing...' : 'Confirm & Pay (Mock)'}
        </button>
      </div>
    </div>
  );
}
