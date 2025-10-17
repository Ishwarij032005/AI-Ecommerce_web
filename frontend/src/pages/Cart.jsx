import React, { useState, useEffect } from 'react';
import { getCart, setCart } from '../utils/storage';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cart, setCartState] = useState([]);

  useEffect(() => setCartState(getCart()), []);

  const remove = i => {
    const c = [...cart]; c.splice(i, 1); setCartState(c); setCart(c);
  };
  const changeQty = (i, delta) => {
    const c = [...cart]; c[i].qty = Math.max(1, (c[i].qty || 1) + delta); setCartState(c); setCart(c);
  };

  const total = cart.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      <div className="bg-white p-4 rounded">
        {cart.length === 0 ? <div>Your cart is empty. <Link to="/products" className="text-indigo-600">Shop now</Link></div> : (
          <>
            {cart.map((it, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm">${it.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeQty(i, -1)} className="px-2">-</button>
                  <div>{it.qty || 1}</div>
                  <button onClick={() => changeQty(i, 1)} className="px-2">+</button>
                  <button onClick={() => remove(i)} className="text-red-500 ml-4">Remove</button>
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
              <Link to="/checkout" className="bg-indigo-600 text-white px-4 py-2 rounded">Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
