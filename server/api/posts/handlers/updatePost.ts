import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { Request, Response } from 'express';

import Post from '../schema';
import { Error, Types } from 'mongoose';
import { Params, Token } from '../../../types';
import cloudinary from '../../../config/cloudinary';
import APIError from '../../../classes/APIError';
import { generateMoongoseValidationErrorList } from '../../../helpers/generateMoongoseValidationErrorList';

config();

interface PutRequestBody {
  title?: string;
  summary?: string;
  category?: string;
  publish?: string;
}

interface PostUpdate {
  title: string;
  summary: string;
  category: string;
  publish: boolean;
  image: string;
}

export const updatePost = async (
  req: Request<Params, {}, PutRequestBody>,
  res: Response
) => {
  try {
    const secretKey = process.env.SECRET_KEY as string;
    const token = req.headers['x-access-token'] as string;
    const decode = jwt.verify(token, secretKey) as Token;
    const post = {} as PostUpdate;

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.summary) {
      post.summary = req.body.summary;
    }

    if (req.body.category) {
      post.category = req.body.category;
    }

    if (req.body.publish) {
      post.publish = req.body.publish.toUpperCase() === 'TRUE';
    }

    if (req.file) {
      const response = await cloudinary.uploader.upload(req.file.path, {
        folder: `/BLOG-APP/posts/${decode.id}/${req.params.idPost}/`,
        public_id: 'principal',
      });

      post.image = response.url;
    }

    await Post.updateOne({ _id: new Types.ObjectId(req.params.idPost) }, post, {
      runValidators: true,
    });

    return res
      .status(200)
      .json({ success: true, message: 'post upgrade successfully' });
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      return res.status(400).json({
        success: false,
        errors: generateMoongoseValidationErrorList(err, '/posts'),
      });
    }
  }
};
