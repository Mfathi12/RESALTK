import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as communityController from "./Community.Controller.js";

const router=Router();


router.post("/AddPost",Authentication,Authorization("Researcher"),communityController.AddPost)
router.post("/AddReply/:id",Authentication,Authorization("Researcher"),communityController.AddReply);


export default router;