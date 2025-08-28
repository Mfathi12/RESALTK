import { model, Schema, Types } from "mongoose";
export const TeamSchema=new Schema({
    teamName: {
        type: String,
        required: true
    },
    teamLeader:{
        type:Types.ObjectId,
        ref: "User",
        required: true
    },
    teamLeaderRole:{
        type:String
    },
    fieldOfResearch:{
        type:string
    },
    members:[{
        type:Types.ObjectId,
        ref: "User"
    }],
    projectsAndAchievements:[{
        type:Types.ObjectId,
        ref:"ProjectsAndAchievments"
    }],
    eventsAndNews :[{
        type:Types.ObjectId,
        ref:"eventsAndNews" 
    }],
    services:[{
        type:Types.ObjectId,
        ref:"Services" 
    }],
    description:{
        type:String
    },
    teamFormation:{
        type:String,
        enum:["I Have My Team","I Need to Hire Members"]
    },
    jobTitle:{
        type:String,
    },
    requiredSkills:{
        type:String,
    },
    descriptio:{
        type:String,
    },
    image: {
        type: String 
    }

},{
    timestamps: true 
})

export const Team=model("Team",TeamSchema)