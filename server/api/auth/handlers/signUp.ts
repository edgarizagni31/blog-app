import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Author from '../schema';
import APIError from '../../../classes/APIError';
import { generateMoongoseValidationErrorList } from '../../../helpers/generateMoongoseValidationErrorList';

dotenv.config();

interface AuthorBody {
  username: string;
  email: string;
  password: string;
}

export const signUp = async (
  req: Request<{}, {}, AuthorBody>,
  res: Response
) => {
  try {
    if (Object.keys(req.body).length === 0) {
      const err = new APIError('the request body is empty', '/api/sign-up');

      err.setType = 'request was not sent correctly';

      return res.status(400).json({ success: false, errors: [err.getValue()] });
    }

    if (!process.env.SECRET_KEY) {
      const err = new APIError('get internal resources', '/api/sign-up');

      return res.status(400).json({ success: false, errors: [err.getValue()] });
    }

    const { username, email, password } = req.body;
    const author = new Author({
      username,
      email,
      status: 'ACTIVO',
    });

    author.password = await Author.encryptPassword(password);

    const errors = author.validateSync();

    if (errors) {
      return res.status(400).json({
        success: false,
        errors: generateMoongoseValidationErrorList(errors),
      });
    }

    await author.save();

    const token = jwt.sign({ id: author._id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });

    return res.status(201).json({ success: true, token });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'MongoServerError') {
        const err = new APIError('email already exists', '/api/sign-up');

        err.setType = 'incorrect authentication';
        err.setDetail = 'email has already been registered';

        return res
          .status(400)
          .json({ success: false, errors: [err.getValue()] });
      }

      console.log(err);
    }
  }
};
