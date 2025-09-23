import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { Authorization } from "../../MiddleWare/Authorization.js";
import * as communityController from "./Community.Controller.js";

const router=Router();

router.post("/AddPost",Authentication,Authorization("Researcher"),communityController.AddPost)
router.post("/AddReply/:postId",Authentication,Authorization("Researcher"),communityController.AddReply);
router.get("/getAllPosts",Authentication,Authorization("Researcher" ,"admin"),communityController.GetPost)
router.get("/getPost/:postId",Authentication,Authorization("Researcher" ,"admin"),communityController.GetPost);

export default router;