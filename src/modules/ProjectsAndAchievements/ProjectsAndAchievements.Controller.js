import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Team } from "../../../DB/models/Team.js";
import { Project } from "../../../DB/models/ProjectsAndAchievements.js";

export const addProject=asyncHandler(async(req,res)=>{

    const {title,description,fieldOfResearch,projectType}=req.body;
    const {teamId}=req.params
    const team=await Team.findById(teamId)
    if(!team)
    {
        return next(new Error("team not found"))
    }
    if(!team.teamLeader.equals(req.user._id))
    {
        return next(new Error("only team leader can add project"))
    }
    const project=await Project.create({title,description,fieldOfResearch,projectType});
    team.projects.push(project._id)
    return res.json({message:"project created succefuully",project })
})