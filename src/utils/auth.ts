import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function getToken(req: NextApiRequest): { userId: number } | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
}
