import validator from 'validator';
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

import { IAuthor, AuthorModel } from './types';

const authSchema = new Schema<IAuthor, AuthorModel, {}>({
  username: {
    type: String,
    trim: true,
    required: [true, 'username is required'],
    minlength: [3, 'username must have at least 3 characters'],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'email is not valid'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'password must have at least 6 characters'],
  },
  status: {
    type: String,
    enum: ['ACTIVO', 'SUSPENDIDO', 'BANEADO'],
    required: [true, 'status is required'],
  },
});

authSchema.statics.encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

authSchema.statics.comparePassword = async (
  password: string,
  hashPassword: string
) => {
  return await bcrypt.compare(password, hashPassword);
};

export default model<IAuthor, AuthorModel>('author', authSchema);
