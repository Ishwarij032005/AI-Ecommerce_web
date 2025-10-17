import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      alert('Register failed');
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border p-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="w-full border p-2" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Register</button>
        </form>
      </div>
    </div>
  );
}
