import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";

export const getAllUsers=asyncHandler(async (req, res,next) => {
    const users = await User.find().select("-password -otp -__v");
    return res.json({
        message: "Users retrieved successfully",
        users
    })
})

export const getUserById=asyncHandler(async (req, res,next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new Error("User not found"));
    }
    return res.json({
        message: "User retrieved successfully",
        user
    });
})

export const updateUser=asyncHandler(async (req, res,next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new Error("User not found"));
    }

    return res.json({
        message: "User updated successfully",
        user
    });
})           

export const deleteUser=asyncHandler(async (req, res ,next) => {
    const user = await User.findByIdAndDelete(req.params.id);   
    if (!user) {
        return next (new Error ("User not found" ));
    }   
    return res.json({
        message: "User deleted successfully",
        user
    });
})

export const getProviders=asyncHandler(async (req, res,next) => {
    const providers = await User.find({ accountType: "provider" }).select("-password -otp -__v");
    return res.json({
        message: "Providers retrieved successfully",
        providers
    });
}) 
export const AddDoctor=asyncHandler(async (req,res,next)=>{
    const {email,password}= req.body;
    const doctor=await User.findOne(email)
    if(doctor)
    {
        return next(new Error("docto is already exsist"))
    }
        let profileImage = null;
    if (req.file) {
    profileImage = req.file.filename; 
    }
    const Doctor =await User.create(req.body)
    return res.json({message:"doctor added succefully",Doctor})
})