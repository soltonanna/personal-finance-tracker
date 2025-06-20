import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useAuthToken } from '../hooks/useAuthToken';
import { TopBar } from '../components/TopBar';
import { AccountForm, Account } from '../components/accounts/AccountForm';
import { AccountList } from '../components/accounts/AccountList';

export default function Dashboard() {
  const token = useAuthToken();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/account', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/');
          return;
        }

        const data = await res.json();
        setAccounts(data);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
  }, [token, router]);

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      localStorage.removeItem('token');
      router.push('/');
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this account?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/account/${accountId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts(prev =>
      prev.map(acc => (acc.id === updatedAccount.id ? updatedAccount : acc))
    );
  };

  const handleAddAccount = (newAccount: Account) => {
    setAccounts(prev => [...prev, newAccount]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <TopBar onDeleteUser={handleDeleteUser} />

      <AccountForm token={token} onAccountCreated={handleAddAccount} />

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-black text-xl font-semibold mb-4">🏦 Your Accounts</h2>
        <AccountList
          accounts={accounts}
          token={token}
          onDeleteAccount={handleDeleteAccount}
          onUpdateAccount={handleUpdateAccount}
        />
      </div>
      
    </div>
  );
}
