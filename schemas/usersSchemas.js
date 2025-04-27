import Joi from 'joi';

export const userAuthSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
})
