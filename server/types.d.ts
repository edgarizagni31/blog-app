import { JwtPayload } from 'jsonwebtoken';
import * as core from 'express-serve-static-core';

export interface Token extends JwtPayload {
  id: string;
}

export interface Params extends core.ParamsDictionary {
  idPost: string;
}
