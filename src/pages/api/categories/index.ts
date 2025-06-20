import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid category name' });
    }

    const existing = await prisma.category.findFirst({
      where: { name, userId: user.userId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId: user.userId,
      },
    });

    return res.status(201).json(category);
  }

  if (req.method === 'GET') {
    const categories = await prisma.category.findMany({
      where: { userId: user.userId },
      orderBy: { name: 'asc' },
    });

    return res.status(200).json(categories);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
