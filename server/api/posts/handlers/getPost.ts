import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { Request, Response } from 'express';

import Post from '../schema';
import { Types } from 'mongoose';
import { Params, Token } from '../../../types';

config();

export const getPost = async (req: Request<Params, {}, {}>, res: Response) => {
  try {
    const secretKey = process.env.SECRET_KEY as string;
    const token = req.headers['x-access-token'] as string;
    const decode = jwt.verify(token, secretKey) as Token;
    const post = await Post.findOne({
      create_by: new Types.ObjectId(decode.id),
      _id: new Types.ObjectId(req.params.idPost),
    }).exec();

    return res.status(200).json(post);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
