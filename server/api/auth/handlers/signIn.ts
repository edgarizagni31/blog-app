import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import APIError from '../../../classes/APIError';
import Author from '../schema';

interface AuthorBody {
  email: string;
  password: string;
}

export const signIn = async (
  req: Request<{}, {}, AuthorBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      const err = new APIError('the request body is empty', '/api/sign-in');

      err.setType = 'request was not sent correctly';

      return res.status(400).json({ success: false, errors: [err.getValue()] });
    }

    if (!process.env.SECRET_KEY) {
      const err = new APIError('get internal resources', '/api/sign-in');

      return res.status(500).json({ success: false, errors: [err.getValue()] });
    }

    const author = await Author.findOne({ email }).exec();

    if (!author) {
      const err = new APIError(
        'author does not exist, email and/or password is not valid',
        'api/sign-in'
      );

      err.setType = 'invalid credentials';

      return res.status(404).json({
        success: false,
        errors: [err.getValue()],
      });
    }

    const isValid = await Author.comparePassword(password, author.password);

    if (!isValid) {
      const err = new APIError(
        'author does not exist, email and/or password is not valid',
        'api/sign-in'
      );

      err.setType = 'invalid credentials';

      return res.status(400).json({
        success: false,
        errors: [err.getValue()],
      });
    }

    const token = jwt.sign({ id: author._id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });

    return res.status(201).json({ success: true, token });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
