import { asyncHandler } from "../../Utils/asyncHandler.js";
import { User } from "../../../DB/models/User.js";
import { Community } from "../../../DB/models/Community.js";
import { Reply } from "../../../DB/models/Community.js";


export const AddPost=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id;
    const {post}=req.body;
    const user=await User.findById(userId);
    if(!user){
        return next(new Error("user not found"));

    }
    const Post= await Community.create(
        {researchId:userId,
        post,}
    )
    return res.json({message:"post created successufully",Post})
})

export const AddReply=asyncHandler(async(req,res,next)=>{
    const {postId}=req.params;
    const userId=req.user._id;
    const {text}=req.body;

    const user=await User.findById(userId);
    if(!user){
        return next(new Error("user not found"));
    }

    const Post=await Community.findById(postId)
    if(!Post)
    {
        return next (new Error("post not found"))
    }

    Post.replies.push({userId,text})
    await Post.save()
 
return res.json({message:"repley add successufully",Post})


})