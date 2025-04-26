import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),

}).min(1).required().messages({
    "object.min": "Body must have at least one field",
    "object.unknown": "Invalid field(s) provided",
})
