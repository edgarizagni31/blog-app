import { Schema, Model } from 'mongoose';

type authorStatus = 'ACTIVO' | 'SUSPENDIDO' | 'BANEADO';

export interface IAuthor {
  username: string;
  email: string;
  password: string;
  status: authorStatus;
}

export interface AuthorModel extends Model<IAuthor, {}, {}> {
  encryptPassword(password: string): Promise<string>;
  comparePassword(password: string, receivedPassword: string): Promise<boolean>;
}
