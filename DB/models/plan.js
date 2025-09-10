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

    deadline: { type: Date},

    status: {
        type: String,
        enum:  ['new-request', 'provider-selection', 'in-progress', 'completed'],
        default: "new"
    }
}, { timestamps: true });

export const Plan = model("Plan", PlanSchema);

/* export const getPlan = asyncHandler(async (req, res, next) => {
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
}); */