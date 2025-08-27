import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { Services } from "../../../DB/models/Services.js";
import { WaitingProviders } from "../../../DB/models/WaitingProviders.js";

export const AddService = asyncHandler(async (req, res, next) => {
    const { userId, serviceType } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return next(new Error("User not found"));
    }
    const ServiceData = {
        userId,
        serviceType,
        requestName: req.body.requestName,
        uploadFile: req.body.uploadFile,
        description: req.body.description,
        deadline: req.body.deadline,
        status: "new-request",
        details: req.body.details || {}
    };
    const Service = await Services.create(ServiceData);

    await User.findByIdAndUpdate(
        userId,
        { $push: { services: { name: Service.serviceType } } }
    );
    return res.json({
        message: "Grammar check request added successfully",
        Service
    })

})

export const GetAllServices = asyncHandler(async (req, res, next) => {
    const services  = await Services.find().populate('userId', 'name email').populate('providerId', 'name email');
    return res.json({
        message: "All Services requests",
        services 
    });
})

export const GetService = asyncHandler(async (req, res, next) => {

    const { serviceId } = req.params;
    const service = await Services.findById(serviceId)
        .populate('userId', 'name email')
        .populate('providerId', 'name email');

    return res.json({
        message: "service that you required",
        service
    })
})

export const GetUserServices=asyncHandler(async (req,res,next)=>{
    const {userId}= req.params;
    const user=await User.findById(userId)
    if(!user)
    {
        return next(new Error("User not found"))
    }
    const services=await Services.find({userId})
    return res.json({
        message:"User services retrieved successfully",
        count: services.length,
        services
    })
})

export const AssignProviderByAdmin = asyncHandler(async (req, res, next) => {
    const {requestId}=req.params;
    const {providerIds }=req.body;
    const Service= await Services.findById(requestId);
    if (!Service) {
        return next(new Error ( "Service request not found" ,{cause:404}));
    }
    const providers = await User.find({ _id: { $in: providerIds }, role: "Service Provider" });
    if (providers.length !== providerIds.length) {
        return next(new Error ( "One or more providers not found or invalid" ,{cause:404}));
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
})






