import {Router } from "express";
import * as AuthController from "./Auth.Controller.js";
import * as AuthSchema from "./Auth.Schema.js";
import { fileUpload } from "../../Utils/multer.js";
import { validate } from "../../MiddleWare/Validation.js";

const router = Router();


router.post(
  "/register",
  fileUpload().single("cv"),  // أول حاجة Multer يقرأ الملفات
  AuthSchema.chooseSchema,    // بعد كده Validation على req.body بعد ما cv اتضاف
  AuthController.register
);
router.post("/login",validate(AuthSchema.LoginSchema) ,AuthController.login);
router.post("/forget-password",validate(AuthSchema.forgetPasswordSchema),AuthController.forgetPassword);
router.post("/reset-password",validate(AuthSchema.resetPasswordSchema),AuthController.resetPassword);

export default router;