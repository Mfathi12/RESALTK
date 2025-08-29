import Joi from "joi";
import { validate } from "../../MiddleWare/Validation.js";

const baseSchema = {
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    phone: Joi.string().optional(),
    accountType: Joi.string().valid('Researcher', 'Service Provider', 'admin').required(),
};

// researcher schema
export const researcherSchema = Joi.object({
    ...baseSchema,
    university: Joi.string().required(),
    degree: Joi.string().required(),
    major: Joi.string().required(),
    currentYear: Joi.string().required(),
    educationLevel: Joi.string().required(),
});

// provider schema
export const providerSchema = Joi.object({
    ...baseSchema,
    cv: Joi.string().optional(),
    companyName: Joi.string().required(),
    address: Joi.string().required(),
    commercialRegistration: Joi.string().required(),
    //logo: Joi.string().required(),
    service: Joi.string().optional(),
});

// admin schema
export const adminSchema = Joi.object({
    ...baseSchema,
});

//doctor schema
export const doctorSchema = Joi.object({
    ...baseSchema,
});


export const chooseSchema = (req, res, next) => {
    if (!req.body || !req.body.accountType) {
        return res.status(400).json({ message: "accountType is required in request body" });
    }
    let schema;
    switch (req.body.accountType) {
        case "Researcher":
            schema = researcherSchema;
            break;
        case "Service Provider":
            schema = providerSchema;
            break;
        case "admin":
            schema = adminSchema;
            break;
        case "doctor":
            schema = doctorSchema;
            break;
        default:
            return res.status(400).json({ message: "Invalid account type" });
    }
    return validate(schema)(req, res, next);
};

export const LoginSchema= Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30),
}).required();

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
}).required();

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),  
    newPassword: Joi.string().required().min(6).max(30),
    confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword')),
}).required();