import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: 0, category: '', description: '', tags: '' });
  const [images, setImages] = useState([]);

  const load = async () => {
    try {
      const p = await API.get('/products'); setProducts(p.data);
      const o = await API.get('/orders'); setOrders(o.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      const token = prompt('Enter admin token (backend ADMIN_TOKEN) OR leave blank to use admin user JWT.');
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      images.forEach(f => fd.append('images', f));
      const headers = {};
      if (token) headers['x-admin-token'] = token;
      await API.post('/products', fd, { headers });
      setForm({ name: '', price: 0, category: '', description: '', tags: '' });
      setImages([]);
      load();
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const del = async (id) => {
    try {
      const token = prompt('Enter admin token (or leave blank to use admin JWT).');
      const headers = {};
      if (token) headers['x-admin-token'] = token;
      await API.delete(`/products/${id}`, { headers });
      load();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold">Create Product</h3>
          <input className="w-full border p-2 my-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border p-2 my-2" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <input className="w-full border p-2 my-2" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className="w-full border p-2 my-2" placeholder="Tags (comma)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          <textarea className="w-full border p-2 my-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input type="file" multiple onChange={e => setImages([...e.target.files])} className="my-2" />
          <button onClick={create} className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
        </div>

        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold">Orders</h3>
          {orders.map(o => (
            <div key={o._id} className="border-b py-2">
              <div className="font-medium">Order {o._id}</div>
              <div className="text-sm">Total: ${o.total}</div>
              <div className="text-xs text-gray-500">Status: {o.status}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-6 bg-white p-4 rounded">
        <h3 className="font-semibold mb-2">Products</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p._id} className="border p-2 rounded">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm">${p.price.toFixed(2)}</div>
              <button onClick={() => del(p._id)} className="mt-2 text-red-500">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
