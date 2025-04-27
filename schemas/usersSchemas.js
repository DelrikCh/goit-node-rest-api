import Joi from 'joi';

export const userAuthSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
})

export const userResendVerification = Joi.object({
    email: Joi.string().required().email(),
})
