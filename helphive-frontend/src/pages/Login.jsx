import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) return setError(data.msg || 'Login failed');

    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Welcome back to HelpHive</h2>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email"
          className="mb-4 w-full px-4 py-2 border rounded" required />

        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password"
          className="mb-6 w-full px-4 py-2 border rounded" required />

        <button type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
