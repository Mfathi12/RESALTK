import { Router } from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as ProjectsAndAchievementsController from "./ProjectsAndAchievements.Controller.js";
import * as ProjectsAndAchievementsSchema from "./ProjectsAndAchievements.Schema.js";
import { validate } from "../../MiddleWare/Validation.js";
const router = Router();

router.post('/:teamId/addProject',Authentication,Authorization("Researcher"),validate(ProjectsAndAchievementsSchema.addProjectSchema),ProjectsAndAchievementsController.addProject)

export default router;