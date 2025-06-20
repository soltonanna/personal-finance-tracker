import React, { useState } from 'react';
import { Account } from './AccountForm';

interface AccountItemProps {
  account: Account;
  token: string;
  onDelete: (accountId: number) => void;
  onUpdate: (updatedAccount: Account) => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({ account, token, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(account.name);
  const [editBalance, setEditBalance] = useState(account.balance.toString());

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/account/${account.id}`, {
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
      onUpdate(updatedAccount);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating account:', err);
    }
  };

  return (
    <li className="flex justify-between items-center border-b py-2">
      {isEditing ? (
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
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span className='text-gray-500'>
            {account.name} — 💰 {account.balance.toFixed(2)} ֏
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
};
