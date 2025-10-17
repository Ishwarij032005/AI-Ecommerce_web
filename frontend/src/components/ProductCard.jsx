import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="h-40 bg-gray-100 flex items-center justify-center mb-3">
        <img src={product.images?.[0] ? product.images[0] : 'https://via.placeholder.com/150'} alt={product.name} className="max-h-full"/>
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
        <Link to={`/product/${product._id}`} className="text-indigo-600">View</Link>
      </div>
    </div>
  );
}
