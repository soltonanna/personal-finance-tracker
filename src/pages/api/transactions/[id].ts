import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = parseInt(req.query.id as string);

  if (req.method === 'GET') {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        account: { userId: user.userId },
      },
    });

    if (!transaction) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(transaction);
  }

  if (req.method === 'PUT') {
    const { amount, type, category, note } = req.body;

    // 1. Find the existing transaction
    const oldTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!oldTransaction) return res.status(404).json({ error: 'Transaction not found' });

    // 2. Update the transaction
    const updated = await prisma.transaction.update({
      where: { id },
      data: { amount, type, category, note },
    });

    // 3. Recalculate balance
    const oldAmount = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
    const newAmount = type === 'income' ? amount : -amount;
    const balanceChange = newAmount - oldAmount;

    await prisma.account.update({
      where: { id: oldTransaction.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    // 1. Get the transaction to delete
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    // 2. Delete it
    await prisma.transaction.delete({ where: { id } });

    // 3. Update balance
    const adjustAmount = transaction.type === 'income' ? -transaction.amount : transaction.amount;

    await prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: adjustAmount,
        },
      },
    });

    return res.status(200).json({ message: 'Deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
