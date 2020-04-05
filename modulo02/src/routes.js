import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Policarpo Quaresma',
    email: 'policarpo@email.com',
    password_hash: '123123123',
  });
  return res.json(user);

  //return res.json({ message: 'Oilá Mondo' });
});

export default routes;
