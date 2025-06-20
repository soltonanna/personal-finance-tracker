import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = parseInt(req.query.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid category id' });

  if (req.method === 'PUT') {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid category name' });
    }

    const updatedCategory = await prisma.category.updateMany({
      where: {
        id,
        userId: user.userId,
      },
      data: { name },
    });

    if (updatedCategory.count === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category updated' });
  }

  if (req.method === 'DELETE') {
    // Delete related transactions if needed
    await prisma.transaction.deleteMany({
      where: { categoryId: id },
    });

    const deleted = await prisma.category.deleteMany({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
