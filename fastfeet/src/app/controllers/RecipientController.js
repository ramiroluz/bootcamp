import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class RecipientController {
  async store(req, res) {
    return res.json({ok: true});


  }

  async update(req, res){
    return res.json({ok:true});

  }
}

export default new RecipientController();
