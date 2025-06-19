import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as { userId: number; email: string };
  } catch (err) {
    console.log(err);
    return null;
  }
}
