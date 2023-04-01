import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

import User from '../api/auth/schema';

config();

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['x-access-token'];
  const secretKey = process.env.SECRET_KEY;

  if (!token || typeof token !== 'string') {
    return res
      .status(403)
      .json({ success: false, message: 'no token provided' });
  }

  if (!secretKey) {
    return res
      .status(500)
      .json({ success: false, message: 'failed to decode token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { id?: string };

    if (!decoded.id) {
      return res
        .status(403)
        .json({ success: false, message: 'id does not exists' });
    }

    const user = await User.findById(decoded.id, { password: 0 }).exec();

    if (!user) {
      return res.status(404).json({ success: false, message: 'no user found' });
    }

    next();
  } catch {
    return res.status(401).json({ success: false, message: 'unauthorized' });
  }
};
