import { model, Schema, Types } from "mongoose";

const PlanSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },

    planName: { type: String, required: true },

    services: [
        {
            type: Types.ObjectId,
            ref: "Services",
            required: true
        }
    ],

    providers: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],

    totalPrice: { type: Number, default: 0 },

    deadline: { type: Date, required: true },

    status: {
        type: String,
        enum: ["new", "provider-selection", "in-progress", "completed"],
        default: "new"
    }
}, { timestamps: true });

export const Plan = model("Plan", PlanSchema);
export const createPlan = asyncHandler(async (req, res, next) => {
    const { planName, services, deadline } = req.body;
    const userId = req.user._id;

    // 1. Check services exist
    const serviceDocs = await Services.find({ _id: { $in: services } });
    if (serviceDocs.length !== services.length) {
        return next(new Error("One or more services not found"));
    }

    // 2. Link services to plan
    const plan = await Plan.create({
        userId,
        planName,
        services,
        deadline,
        status: "new"
    });

    return res.json({
        message: "Plan created successfully",
        plan
    });
});
export const getPlan = asyncHandler(async (req, res, next) => {
    const { planId } = req.params;
    const plan = await Plan.findById(planId)
        .populate("userId", "name email")
        .populate({
            path: "services",
            populate: { path: "providerId", select: "name email" }
        });

    if (!plan) return

    return res.json({
        message: "Plan fetched successfully",
        plan
    });
});