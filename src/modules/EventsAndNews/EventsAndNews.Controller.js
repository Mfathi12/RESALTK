import { Team } from "../../../DB/models/Team";
import { Event } from "../../../DB/models/EventsAndNews";
import { News } from "../../../DB/models/EventsAndNews";

import { asyncHandler } from "../../Utils/asyncHandler";

export const addEvent = asyncHandler(async(req,res,next)=>{
    const { teamId } = req.params;
    const { eventTitle, eventDescription, eventDate, location, totalPositionNeeded } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
        return next(new Error("Team not found"));
    }
    if(!team.teamLeader.equals(req.user._id))
    {
        return next(new Error("only team leader can add Achievement"))
    }
    await Event.create({ eventTitle, eventDescription, eventDate, location, totalPositionNeeded });
    team.Events.push(newEvent._id);
    await team.save();
    return res.json({ message: "Event added successfully", event: newEvent })
})

export const addNews= asyncHandler(async(req,res,next)=>{
    const {newsTitle,newsDescription,image}=req.body;
    const newNews=await News.create({newsTitle,newsDescription,image});
    return res.json({message:"News added successfully",news:newNews}) 
})

export const getAllNews=asyncHandler(async(req,res,next)=>{
    const news=await News.find();
    if(!news ||news.length===0)
    {
        return res.json({message:"no news found"})
    }
    return res.json({message:"news fetched successfully",news})
})

export const getAllEvents=asyncHandler(async(req,res,next)=>{
    const events=await Event.find();        
    if(!events || events.length===0)
    {
        return res.json({message:"no events found"})
    }       
    return res.json({message:"events fetched successfully",events})
})

export const getEvent=asyncHandler(async(req,res,next)=>{
    const {eventId}=req.params;
    const updates=req.body;
    const event=await Event.findById(eventId);
    if (!event) return next(new Error("Event not found", { cause: 404 }));

    return res.json({messags:"event showed successfully", event})
})

export const updateNew=asyncHandler(async(req,res,next)=>{
    const {newId}=req.params;
    const New = await News.findById(newId);
    if(!New){
        return next(new Error("new not found"))
    }

    Object.Keys(updates).forEach((key)=>{
        New[key]=updates[key];
    });
    await New.save();
    return res.json({message:"News updated successfully",New})


})


