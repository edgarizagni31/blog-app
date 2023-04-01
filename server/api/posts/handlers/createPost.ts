import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { Error, Types } from 'mongoose';

import cloudinary from '../../../config/cloudinary';
import APIError from '../../../classes/APIError';
import Post from '../schema';
import { Token } from '../../../types';
import { generateMoongoseValidationErrorList } from '../../../helpers/generateMoongoseValidationErrorList';

config();

interface PostRequestBody {
  title: string;
  summary: string;
  category: string;
}

export const createPost = async (
  req: Request<{}, {}, PostRequestBody>,
  res: Response
) => {
  if (!req.file) {
    const err = new APIError('no image uploaded', '/posts');

    err.setType = 'wrong request';

    return res.status(400).json({ success: false, errors: [err] });
  }

  try {
    const secretKey = process.env.SECRET_KEY as string;
    const token = req.headers['x-access-token'] as string;
    const decode = jwt.verify(token, secretKey) as Token;
    const post = new Post({
      title: req.body.title,
      summary: req.body.summary,
      category: req.body.category,
      publish: false,
      created_up: Date.now(),
      create_by: new Types.ObjectId(decode.id),
    });
    const response = await cloudinary.uploader.upload(req.file.path, {
      folder: `/BLOG-APP/posts/${decode.id}/${post._id}/`,
      public_id: 'principal',
    });

    post.image = response.url;

    const errors = post.validateSync();

    if (errors) {
      return res.status(400).json({
        success: false,
        errors: generateMoongoseValidationErrorList(errors, '/posts'),
      });
    }

    await post.save();

    return res
      .status(201)
      .json({ success: true, message: 'post created successfully' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
