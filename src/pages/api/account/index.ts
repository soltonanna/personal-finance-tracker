import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { name, balance } = req.body;

    if (!name || balance == null) {
      return res.status(400).json({ error: 'Missing name or balance' });
    }

    const account = await prisma.account.create({
      data: {
        name,
        balance,
        userId: user.userId,
      },
    });

    return res.status(201).json(account);
  }

  if (req.method === 'GET') {
    const accounts = await prisma.account.findMany({
      where: { userId: user.userId },
    });
    return res.status(200).json(accounts);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
