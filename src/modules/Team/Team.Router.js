import { Router } from "express";
import * as TeamSchema from "./Team.Schema.js";
import * as TeamController from "./Team.controller.js"
import { Authorization } from "../../MiddleWare/Authorization.js";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
import { fileUpload } from "../../Utils/multer.js";

const router = Router();
router.post(
    '/team',
    Authentication,
    Authorization("Researcher"),
    fileUpload.single('image'),
    validate(TeamSchema.AddTeamSchema),
    TeamController.AddTeam
);
router.get('/:teamId',Authentication, validate(TeamSchema.GetTeamSchema), TeamController.GetTeam)
router.get('/:userId',Authentication,Authorization('Researcher') ,validate(TeamSchema.GetMemberTeamsSchema), TeamController.GetMemberTeamsSchema)
router.patch('/teamId',Authentication,Authorization('Researcher'),validate(TeamSchema.UpdateTeamSchema),TeamController.GetMemberTeamsSchema.UpdateTeamSchema)
export default router;
