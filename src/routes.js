import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Zé Buscapé',
        email: 'naotem@saifora.com.br',
        password_hash: '3838383838',
    });

    return res.json(user);
});

export default routes;
