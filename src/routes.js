import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'laura',
    email: 'laura@teste',
    password_hash: '123',
  });

  return res.json(user);
});

export default routes;
