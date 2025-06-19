import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = parseInt(req.query.id as string);

  if (req.method === 'PUT') {
    const { name, balance } = req.body;

    const account = await prisma.account.update({
      where: {
        id,
        userId: user.userId,
      },
      data: { name, balance },
    });

    return res.status(200).json(account);
  }

  if (req.method === 'DELETE') {
    // Optional: delete related transactions too if needed
    await prisma.transaction.deleteMany({
      where: { accountId: id },
    });

    await prisma.account.delete({
      where: {
        id,
        userId: user.userId,
      },
    });

    return res.status(200).json({ message: 'Account deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
