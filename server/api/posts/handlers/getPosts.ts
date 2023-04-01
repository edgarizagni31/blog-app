import { config } from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { Params, Token } from '../../../types';
import Post from '../schema';

config();

export const getPosts = async (req: Request<Params, {}, {}>, res: Response) => {
  try {
    const secretKey = process.env.SECRET_KEY as string;
    const token = req.headers['x-access-token'] as string;
    const decode = jwt.verify(token, secretKey) as Token;
    const posts = await Post.find({
      create_by: new Types.ObjectId(decode.id),
    }).exec();

    return res.status(200).json(posts);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
