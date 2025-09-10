import { Plan } from "../../../DB/models/plan.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const addPlan=asyncHandler(async(req,res,next)=>{
    const {planName,planDescription,services}=req.body;
    const user=req.user._id;
    const plan=await Plan.create({
        planName,
        planDescription,
        services
    });
    user.plan.push(plan._id);
    await user.save();

    return res.json({messag:"plan created succefuully",plan })
})
