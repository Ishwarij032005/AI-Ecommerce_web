import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ProductCard from '../components/ProductCard';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [projection, setProjection] = useState([]);

  useEffect(() => {
    API.get('/products').then(res => setFeatured(res.data.slice(0, 6))).catch(() => {});
    API.get('/ai/projection').then(res => setProjection(res.data.projection.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="container py-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-gradient-to-r from-yellow-200 to-red-100 rounded p-6">
          <h2 className="text-3xl font-bold">Seasonal Sale — Up to 30% Off</h2>
          <p className="mt-2 text-gray-700">Curated deals for Summer, Diwali & Back to School.</p>
        </div>
        <div className="bg-white rounded p-6">
          <h3 className="font-bold">Sales Projection</h3>
          <div className="mt-3 text-sm">
            {projection.length ? projection.map(p => <div key={p.productId} className="border-b py-2"><div>ID: {p.productId}</div><div>Projected: {p.projectedSales}</div></div>) : <div>Loading...</div>}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{featured.map(p => <ProductCard key={p._id} product={p} />)}</div>
      </section>

      <Chatbot />
    </div>
  );
}
