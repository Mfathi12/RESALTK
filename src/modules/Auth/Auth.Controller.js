import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring"

export const register = asyncHandler(async (req, res, next) => {
    const {name, email,password ,confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new Error("User already exists"));
    }

    if (password !== confirmPassword) {
        return next(new Error("Passwords do not match"));
    }
    req.body.password = await bcrypt.hash(password, 8);;
 if (req.body.accountType === "Service Provider" && !req.file) {
  return next(new Error("CV is required for service providers"));
}
    const user = await User.create(req.body);

    const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET,
    );

    res.status(201).json({
        message: "User registered successfully",
        user,
        token
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;   
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Invalid email"));
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
        return next(new Error("Invalid password"));
    }
  const token = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET,
);
 
    res.status(200).json({
        message: "User logged in successfully",
        user,
        token
    });

})

export const forgetPassword=asyncHandler(async (req,res,next)=>{
    const {email} =req.body
    const user =await User.findOne({email})
    if (!user) {
        return next(new Error("Email not found"));
    }

    const otp = randomstring.generate(
        {length:6,
        charset:"numeric"}
    )

user.resetPasswordOTP = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
await user.save();
return res.json({message:"entire your new password"})
    
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword, confirmNewPassword } = req.body;
    const user = await User.findOne({ email, resetPasswordOTP: otp });
    if (!user) {
        return next(new Error("Invalid OTP or email"));
    }   
    if (newPassword !== confirmNewPassword) {
        return next(new Error("Passwords do not match"));
    }   
    
    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
        return next(new Error("OTP has expired"));
    }
    user.password = await bcrypt.hash(newPassword, 8);
    user.resetPasswordOTP = undefined; 
    user.resetPasswordExpires = undefined; 
    await user.save();
    return res.json({
        message: "Password reset successfully",
    });

}) 