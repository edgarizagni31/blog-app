import { NextFunction, Request, Response } from 'express';
import APIError from '../classes/APIError';

export const VerifyBodyNotEmpty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    const err = new APIError('the request body is empty', req.url);

    err.setType = 'request was not sent correctly';

    return res.status(400).json({ success: false, errors: [err.getValue()] });
  }

  return next();
};
