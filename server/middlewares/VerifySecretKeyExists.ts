import { NextFunction, Request, Response } from 'express';

import APIError from '../classes/APIError';

export const VerifySecretKeyExists = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.SECRET_KEY) {
    const err = new APIError('get internal resources', '/api/sign-in');

    return res.status(500).json({ success: false, errors: [err.getValue()] });
  }

  return next();
};
