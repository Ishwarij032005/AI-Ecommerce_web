import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { getCart, setCart } from '../utils/storage';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => {});
    API.get(`/ai/recommendations/${id}`).then(res => setRecs(res.data)).catch(() => {});
  }, [id]);

  const addToCart = () => {
    const cart = getCart();
    cart.push({ productId: product._id, name: product.name, price: product.price, qty: 1 });
    setCart(cart);
    alert('Added to cart');
  };

  return (
    <div className="container py-8">
      {!product ? <div>Loading...</div> : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-4 rounded">
            <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-64 object-contain" />
            <h2 className="mt-4 text-2xl font-bold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>
            <div className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</div>
            <button onClick={addToCart} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Add to Cart</button>
          </div>
          <aside className="bg-white p-4 rounded">
            <h3 className="font-semibold">Recommended</h3>
            {recs.length === 0 ? <div className="text-sm text-gray-500">No recommendations</div> : recs.map(r => (
              <div key={r._id} className="py-2 border-b">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm">${r.price.toFixed(2)}</div>
              </div>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}
