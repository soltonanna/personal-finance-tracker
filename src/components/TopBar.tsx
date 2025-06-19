import React from 'react';
import { useRouter } from 'next/router';

interface TopBarProps {
  onDeleteUser: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onDeleteUser }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">💼 Dashboard</h1>
      <div className="flex gap-2">
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>

        <button
          onClick={onDeleteUser}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};
