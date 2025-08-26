import {Router} from "express";

import * as UserController from "./User.Controller.js";
import * as UserSchema from "./User.Schema.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import { validate } from "../../MiddleWare/Validation.js";
const router =Router();

router.get("/", Authorization("admin"),UserController.getAllUsers);
router.get("/:id",validate( UserSchema.UserIdSchema), UserController.getUserById);
router.get("/providers", Authorization("admin"), UserController.getProviders);
router.patch("/:id", validate(UserSchema.updateUserSchema), UserController.updateUser);
router.delete("/:id",validate(UserSchema.UserIdSchema), UserController.deleteUser);

export default router;
