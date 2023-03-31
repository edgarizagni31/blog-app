import { Error } from 'mongoose';
import APIError from '../classes/APIError';

export const generateMoongoseValidationErrorList = ({
  errors,
}: Error.ValidationError) => {
  const keys = Object.keys(errors);
  const listError = keys.map((key) => {
    const err = new APIError(`${key} field`, '/auth/signUp');

    err.setType = 'validation error';
    err.setDetail = errors[key].message;

    return err.getValue();
  });

  return listError;
};
