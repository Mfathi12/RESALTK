import Joi from "joi";
import { isValidObjectId } from "../../MiddleWare/Validation.js";

export const addProjectSchema = Joi.object({
    teamId:Joi.string().custom(isValidObjectId).required(),
    projectTitle: Joi.string().required(),
    projectDescription: Joi.string().required(),
    fieldOfResearch: Joi.string().required(),
    projectType: Joi.string().valid("Thesis", "Research Paper", "Experiment", "Case Study", "Other").required(),
}).required();