import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data)).catch(() => {});
  }, []);
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
    </div>
  );
}
