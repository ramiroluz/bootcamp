import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Sessão: erro de validação' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Corpo da solicitação inválido.' });
    }

    const paramSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await paramSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Parâmetro inválido' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.json(404).json({ error: 'Destinatário não existe.' });
    }

    return res.json(await recipient.update(req.body));
  }
}

export default new RecipientController();
