import { Router } from 'express';
import { signIn } from './handlers/signIn';
import { signUp } from './handlers/signUp';

const routerAuth = Router();

routerAuth.post('/auth/sign-up', signUp);
routerAuth.post('/auth/sign-in', signIn);

export default routerAuth;
