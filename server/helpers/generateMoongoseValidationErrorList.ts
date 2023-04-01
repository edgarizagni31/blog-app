import { Error } from 'mongoose';
import APIError from '../classes/APIError';

export const generateMoongoseValidationErrorList = (
  { errors }: Error.ValidationError,
  instance: string
) => {
  const keys = Object.keys(errors);
  const listError = keys.map((key) => {
    const err = new APIError(`${key} field`, instance);

    err.setType = 'validation error';
    err.setDetail = errors[key].message;

    return err.getValue();
  });

  return listError;
};
