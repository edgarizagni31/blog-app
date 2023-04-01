import { NextFunction, Request, Response } from 'express';

import APIError from '../classes/APIError';
import Post from '../api/posts/schema';
import { Types } from 'mongoose';

export const verifyPostExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const findPost = await Post.findOne({
    _id: new Types.ObjectId(req.params.idPost),
  }).exec();

  if (!findPost) {
    const err = new APIError('post does not exist', '/posts');

    err.setType = 'resource not found';
    err.setDetail = 'post not found check the url';

    return res.status(400).json({
      success: false,
      errors: [err.getValue()],
    });
  }

  return next();
};
