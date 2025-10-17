import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">AI E-Shop</Link>
        <nav className="space-x-4">
          <Link to="/products" className="text-gray-700">Products</Link>
          <Link to="/cart" className="text-gray-700">Cart</Link>
          {token ? (
            <>
              {user?.isAdmin && <Link to="/admin" className="text-gray-700">Admin</Link>}
              <button onClick={logout} className="text-gray-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700">Login</Link>
              <Link to="/register" className="text-gray-700">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
