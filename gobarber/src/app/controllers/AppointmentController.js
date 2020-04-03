import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import { startOfHour, parseISO, isBefore } from 'date-fns';

class AppointmentController {
    async index(req, res) {
        const { page = 1} = req.query;
        const agendamentos = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            attributes: ['id', 'date'],
            limit:20,
            offset: (page-1) * 20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'url', 'path'],
                        },
                    ],
                },
            ],
        });
        return res.json(agendamentos);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Erro de validação' });
        }

        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res
                .status(404)
                .json({ error: 'Só pode criar agendamentos com provedores' });
        }

        /**
         * Verifica se data passada
         */
        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json('Não é permitido criar evento em data passada.');
        }

        /**
         * Verifica disponibilidade de horário
         */
        const verificaDisponibilidade = await Appointment.findOne({
            where: {
                provider_id,
                date: hourStart,
                canceled_at: null,
            },
        });

        if (verificaDisponibilidade) {
            return res
                .status(400)
                .json({ error: 'Horário não disponível para agendamento' });
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
