import React, { useState } from 'react';

interface AccountFormProps {
  token: string;
  onAccountCreated: (newAccount: Account) => void;
}

export interface Account {
  id: number;
  name: string;
  balance: number;
  createdAt: string;
}

export const AccountForm: React.FC<AccountFormProps> = ({ token, onAccountCreated }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateAccount = async () => {
    if (!name || !balance) {
      setError('Name and balance are required');
      return;
    }

    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, balance: parseFloat(balance) }),
      });

      const contentType = res.headers.get('Content-Type');

      if (!res.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to create account');
        } else {
          throw new Error(`Unexpected error: ${res.status}`);
        }
      }

      const newAccount = await res.json();
      onAccountCreated(newAccount);
      setName('');
      setBalance('');
      setError('');
      setSuccess('Account created!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
      setSuccess('');
    }
  };

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-2">➕ New Account</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Account name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-1 rounded w-full"
        />
        <input
          type="number"
          placeholder="Initial balance"
          value={balance}
          onChange={e => setBalance(e.target.value)}
          className="border px-3 py-1 rounded w-full"
        />
        <button
          onClick={handleCreateAccount}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Create
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
};
