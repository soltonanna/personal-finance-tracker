import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { method } = req;

  if (method === 'GET') {
    const transactions = await prisma.transaction.findMany({
      where: { account: { userId: user.userId } },
      orderBy: { date: 'desc' },
    });
    return res.status(200).json(transactions);
  }

  if (method === 'POST') {
    const { accountId, amount, type, categoryId, note } = req.body;

    if (!categoryId || typeof categoryId !== 'number') {
      return res.status(400).json({ error: 'Category ID is required and must be a number' });
    }

    const date = new Date();

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        amount,
        type,
        categoryId,
        date,
        note,
      },
    });

    // Update account balance
    const updateAmount = type === 'income' ? amount : -amount;

    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: updateAmount,
        },
      },
    });

    return res.status(201).json(transaction);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
