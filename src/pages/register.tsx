import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/auth/register', form);
      router.push('/login');
    } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-black text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 placeholder-opacity-75"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 placeholder-opacity-75"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded placeholder-gray-500 placeholder-opacity-75"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
