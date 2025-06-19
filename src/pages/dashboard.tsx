import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Account {
  id: number;
  name: string;
  balance: number;
  createdAt: string;
}

export default function Dashboard() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const [editAccountId, setEditAccountId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editBalance, setEditBalance] = useState('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    useEffect(() => {
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
        } catch (err: unknown) {
            console.error('Error fetching accounts:', err);
        }
        };

        fetchAccounts();
    }, [token, router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const handleDeleteUser = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
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
        } catch (err: unknown) {
            console.error('Error deleting user:', err);
        }
    };


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
            setAccounts(prev => [...prev, newAccount]);
            setName('');
            setBalance('');
            setError('');
            setSuccess('Account created!');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
            setSuccess('');
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
        } catch (err: unknown) {
            console.error('Error deleting account:', err);
        }
    };

    const handleEditAccount = async (accountId: number) => {
        try {
            const res = await fetch(`/api/account/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: editName,
                balance: parseFloat(editBalance),
            }),
            });

            if (!res.ok) {
            throw new Error('Failed to update account');
            }

            const updatedAccount = await res.json();

            setAccounts(prev =>
            prev.map(account =>
                account.id === accountId ? updatedAccount : account
            )
            );

            // Reset edit mode
            setEditAccountId(null);
            setEditName('');
            setEditBalance('');
        } catch (err: unknown) {
            console.error('Error updating account:', err);
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">💼 Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800"
                    >
                    Logout
                </button>
                
                <button
                    onClick={handleDeleteUser}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                    Delete My Account
                </button>
            </div>

            {/* Add Account Form */}
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


            {/* Account List */}
            <div className="bg-white p-4 shadow rounded">
                <h2 className="text-xl font-semibold mb-4">🏦 Your Accounts</h2>
                {accounts.length === 0 ? (
                <p>No accounts yet. Create one!</p>
                ) : (
                <ul className="space-y-2">
                    {accounts.map(account => (
                    <li
                        key={account.id}
                        className="flex justify-between items-center border-b py-2">
                        {editAccountId === account.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="Account name"
                            className="border px-2 py-1 rounded w-full"
                            />
                            <input
                            type="number"
                            value={editBalance}
                            onChange={e => setEditBalance(e.target.value)}
                            placeholder="Balance"
                            className="border px-2 py-1 rounded w-full"
                            />
                            <button
                            onClick={() => handleEditAccount(account.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            >
                            Save
                            </button>
                            <button
                            onClick={() => {
                                setEditAccountId(null);
                                setEditName('');
                                setEditBalance('');
                            }}
                            className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                            >
                            Cancel
                            </button>
                        </div>
                        ) : (
                        <>
                            <span>
                            {account.name} — 💰 {account.balance.toFixed(2)} ֏
                            </span>
                            <div className="flex gap-2">
                            <button
                                onClick={() => {
                                setEditAccountId(account.id);
                                setEditName(account.name);
                                setEditBalance(account.balance.toString());
                                }}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteAccount(account.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                                Delete
                            </button>
                            </div>
                        </>
                        )}
                    </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
}
