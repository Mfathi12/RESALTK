import { User } from "../../../DB/models/User.js";
import { Team } from "../../../DB/models/Team.js";

import mongoose from "mongoose";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";
import { WaitingProviders } from "../../../DB/models/WaitingProviders.js";

//request service by researcher or by teamLeader
export const AddService = asyncHandler(async (req, res, next) => {
    const { teamId, serviceType } = req.params;
    const userId=req.user._id;

    let ownerType="user";
    let ownerId=userId;

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error("User not found"));
    }
    if(teamId){
        const team=await Team.findById(teamId)
        if(!team){
            return next(new Error("team not found"))
        }
            if (!team.teamLeader.equals(userId)) {
            return next(new Error("Only team leader can request service for the team"));
    }
    ownerType="team";
    ownerId=teamId;

    }
    const ServiceData = {
        ownerId,
        serviceType,
        requestName: req.body.requestName,
        uploadFile: req.body.uploadFile,
        description: req.body.description,
        deadline: req.body.deadline,
        status: "new-request",
        details: req.body.details || {}
    };
    const Service = await Services.create(ServiceData);
    if(ownerType === "user")
{ await User.findByIdAndUpdate(
        userId,
        { $push: { services: { name: Service.serviceType } } }
    );}

    if(ownerType==="team"){
    await Team.findByIdAndUpdate(teamId, { $push: { services: Service._id } });
    }
    return res.json({
        message: "service request added successfully",
        Service
    })

})

//get services by admin in four status depand on query
export const GetServicesByAdmin = asyncHandler(async (req, res, next) => {
    const {status}=req.query;
    let filter={};
    if(filter)
        filter.status=status;
    let projection = {}; 
    let populateOptions = [];
    switch(status){
        case "new-request":
        projection={requestName:1,serviceType:1,ownerId:1}
        case "provider-selection":
        projection={requestName:1,serviceType:1,ownerId:1}
        case "in-progress":
      projection = { requestName: 1, serviceType: 1, deadline: 1, createdAt: 1 };
      break;
          case "completed":
      projection = { requestName: 1, serviceType: 1, selectedProvider: 1, updatedAt: 1 };
      populateOptions = [{ path: "selectedProvider", select: "name email" }];
      break;

    default:
      projection = {}; 

    }
    let query =Services.find(filter,projection)
    if(populateOptions.length>0){
        populateOptions.forEach((p)=>{
            query=query.populate(p);
        });
    }

    const services=await query;
      if (status === "in-progress") {
    services.forEach((s) => {
      s = s.toObject();
      s.durationDays = Math.ceil((new Date(s.deadline) - new Date(s.createdAt)) / (1000 * 60 * 60 * 24));
    });
  }
    return res.json({
        message: "All Services requests",
        services 
    });
})

//get all service to spesfic user
export const GetUserServices=asyncHandler(async (req,res,next)=>{
    const {teamId}= req.params;
    const userId=req.user._id;
    let services=[];
     if(teamId)
    {
        const team =await Team.findById(teamId)
        if(!team){
            return next (new Error("team not found"))
        }
        services= team.services;
    }else{
        const user=await User.findById(userId)
    if(!user)
    {
        return next(new Error("User not found"))
    }
    services=await Services.find({ownerId:userId})
    }
    
    return res.json({
        message:"User services retrieved successfully",
        count: services.length,
        services
    })
})
/* export const GetService = asyncHandler(async (req, res, next) => {

    const { serviceId } = req.params;
    const service = await Services.findById(serviceId)
        .populate('userId', 'name email')
        .populate('providerId', 'name email');

    return res.json({
        message: "service that you required",
        service
    })
}) */

/*
export const AssignProviderByAdmin = asyncHandler(async (req, res, next) => {
    const {requestId}=req.params;
    const {providerIds }=req.body;
    const Service= await Services.findById(requestId);
    if (!Service) {
        return next(new Error ( "Service request not found" ,{cause:404}));
    }
    const providerObjectIds = providerIds.map(id => new mongoose.Types.ObjectId(id));
    const providers = await User.find({ _id: { $in: providerObjectIds }, accountType: "Service Provider" });
    if (providers.length !== providerIds.length) {
        return next(new Error ( "One or more providers not found or invalid" ));
    }
    Service.candidates.push(...providerIds);
    Service.status = "provider-selection";
    await Service.save();

    const waitingEntries = providerIds.map(id => ({
        requestId,
        providerId: id
    }));

    const waitingProviders =await WaitingProviders.insertMany(waitingEntries);
    return res.json({
        message: "Providers assigned successfully",
        waitingProviders ,
        Service
    });

})

export const SetProviderPrice = asyncHandler(async (req, res, next) => {
    const { providerId, requestId } = req.params;
    const { price } = req.body;

    const entry = await WaitingProviders.findOne({ providerId, requestId });
    if (!entry) {
        return next(new Error("No assignment found for this provider and request", { cause: 404 }));
    }

    entry.price = price;
    await entry.save();

    return res.json({ message: "Price updated successfully", entry });
})

export const GetSpecificProviders=asyncHandler(async(req,res,next)=>{
    const {serviceId} =req.params
    const service =await Services.findById(serviceId)
    if(!service)
    {
        return next(new Error('service not found'))
    }
    const providers= await User.find({service:service.serviceType})
    return res.json({message:"providers are available",providers})

}) 

export const getprovidersAssigned=asyncHandler(async(req,res,next)=>{
    const {serviceId}=req.params;
    const service =await Services.findById(serviceId)
    if(!service)
    {
        return next(new Error('service not found'))
    }
    if(!service.candidates || service.candidates.length===0){
        return next(new Error('No providers assigned yet'))
    }
    const providersAssigned=await User.find({_id:{$in:service.candidates}})
    return res.json({message:"provider assigned for this Services",providersAssigned})


})

export const SelectProviderByUser = asyncHandler(async (req, res, next) => {
    const {userId, requestId}=req.params;
    const {providerId}=req.body;
    const Service= await Services.findById(requestId);
    if (!Service) {
        return next(new Error ( "Service not found" ,{cause:404}));
    }  
    if (Service.userId.toString() !== userId) {
        return next(new Error ( "Unauthorized action" ,{cause:403}));
    }
    if (!Service.candidates.includes(providerId)) {
        return next(new Error ( "Selected provider is not in the candidate list" ,{cause:400}));
    }
    Service.providerId = providerId;
    Service.status = "in-progress";
    await Service.save();
    return res.json({
        message: "Provider selected successfully",
        Service
    }); 
})

export const GetAllProviderRequests=asyncHandler(async (req,res,next)=>{
    const {providerId} =req.params;
    const provider=await User.findOne({_id:providerId})
    if(!provider){
        return next(new Error("provider not found"))
    }
    const services=await Services.find({providerId})
    return res.json({message:"services",services})
}) */






    
