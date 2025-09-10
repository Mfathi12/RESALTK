import Joi from "joi";
import { isValidObjectId } from "../../MiddleWare/Validation.js";   

export const addPlanSchema = Joi.object({
    planName: Joi.string().required(),
    planDescription: Joi.string().required(),
})