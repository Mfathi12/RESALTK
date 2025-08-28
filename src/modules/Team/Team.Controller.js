import { Team } from "../../../DB/models/Team";
import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const AddTeam=asyncHandler(async(req,res,next)=>{
    if (req.file) {
        req.body.image = req.file.path; 
    }
    const team =await Team.create(req.body);
    return res.json({messag:"team created succefuully",team })
})

export const GetTeam=asyncHandler(async(req,res,next)=>{
    const {teamId}=req.params
    const team=await  Team.findById(teamId).populate('teamLeader', 'name email')
        .populate('projectsAndAchievements')
        .populate('eventsAndNews')
        .populate('services');
        if (!team) {
        return next(new Error("team not found"))
    }
    return res.json({messag:"team created succefuully",team })
})

export const GetMemberTeamsSchema=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params
    const user=await User.findById(userId)
    if(user){
        return next(new Error("user not found"))
    }

    const teams=await  Team.find({members:userId}).populate('teamLeader', 'name email')
        .populate('members', 'name email') 
        .populate('projectsAndAchievements')
        .populate('eventsAndNews')
        .populate('services');
        if (!teams) {
        return next(new Error("teams not found"))
    }
    return res.json({messag:"team created succefuully",teams })
})

export const UpdateTeamSchema=asyncHandler(async(req,res,next)=>{
    const {teamId}=req.params;
    const {name,members,projects}=req.body;
    updateData={};
    //if(name)
})