import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import Post from '../api/posts/schema';
import { Params, Token } from '../types';
import APIError from '../classes/APIError';
import { config } from 'dotenv';

config();

export const verifyThatPostYours = async (
  req: Request<Params, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const secretKey = process.env.SECRET_KEY as string;
  const token = req.headers['x-access-token'] as string;
  const decode = jwt.verify(token, secretKey) as Token;
  const post = await Post.findOne({
    create_by: new Types.ObjectId(decode.id),
    _id: new Types.ObjectId(req.params.idPost),
  }).exec();

  if (!post) {
    const err = new APIError('you dont have access to this post', '/posts');

    err.setType = 'access error';
    err.setDetail = 'the post does not belong to this account';

    return res.status(403).json({ success: false, errors: [err.getValue()] });
  }

  return next();
};
