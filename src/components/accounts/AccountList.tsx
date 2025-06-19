import React from 'react';
import { Account } from './AccountForm';
import { AccountItem } from './AccountItem';

interface AccountListProps {
  accounts: Account[];
  token: string;
  onDeleteAccount: (id: number) => void;
  onUpdateAccount: (updatedAccount: Account) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  token,
  onDeleteAccount,
  onUpdateAccount,
}) => {
  if (accounts.length === 0) {
    return <p>No accounts yet. Create one!</p>;
  }

  return (
    <ul className="space-y-2">
      {accounts.map(account => (
        <AccountItem
          key={account.id}
          account={account}
          token={token}
          onDelete={onDeleteAccount}
          onUpdate={onUpdateAccount}
        />
      ))}
    </ul>
  );
};
