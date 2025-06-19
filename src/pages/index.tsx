import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <h1 className="text-3xl font-bold mb-4">💰 Personal Finance Tracker</h1>
      <p className="text-gray-700 mb-6">
        Track your income, expenses, and savings easily. Create accounts, manage transactions, and
        visualize your financial health — all in one place.
      </p>
      <div className="flex justify-center gap-4">
        <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register
        </a>
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </a>
      </div>
    </div>
  );
}
