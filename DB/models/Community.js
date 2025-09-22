import { Schema, model } from "mongoose";
const ReplySchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        reports: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                reason: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);


export const CommunitySchema = new Schema({
    researchId: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    post: {
        type: string
    },
    replies: [ReplySchema],
    reports: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            reason: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],

})

export const Community = model("Community", CommunitySchema)
export const Reply = model("Reply", ReplySchema)