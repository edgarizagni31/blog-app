import { Router } from 'express';

import upload from '../.../../../config/multer';
import { VerifyBodyNotEmpty } from '../../middlewares/VerifyBodyNotEmpty';
import { verifyPostExists } from '../../middlewares/verifyPostExists';
import { VerifySecretKeyExists } from '../../middlewares/VerifySecretKeyExists';
import { verifyThatPostYours } from '../../middlewares/verifyThatPostYours';
import { verifyToken } from '../../middlewares/verifyToken';
import { createPost } from './handlers/createPost';
import { getPost } from './handlers/getPost';
import { getPosts } from './handlers/getPosts';
import { updatePost } from './handlers/updatePost';

const routerPost = Router();

routerPost.get('/posts', VerifySecretKeyExists, verifyToken, getPosts);
routerPost.get(
  '/posts/:idPost',
  VerifySecretKeyExists,
  verifyToken,
  verifyPostExists,
  verifyThatPostYours,
  getPost
);
routerPost.post(
  '/posts',
  VerifySecretKeyExists,
  verifyToken,
  upload.single('image'),
  VerifyBodyNotEmpty,
  createPost
);
routerPost.put(
  '/posts/:idPost',
  VerifySecretKeyExists,
  verifyToken,
  verifyPostExists,
  verifyThatPostYours,
  upload.single('image'),
  VerifyBodyNotEmpty,
  updatePost
);

export default routerPost;
