import { json } from "express"
import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import OTP from "../models/otp.model.js"
import bcrypt from "bcryptjs"
import { sendOTPmail, sendSuccessMail } from "../lib/sendMail.js"

export const createotp = async (req, res) => {
    const email = req.body.email;
    try {
        const otp = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

        const updatedOTP = await OTP.findOneAndUpdate(
            { email },
            { email, otp },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            otp: updatedOTP.otp,
        });

        sendOTPmail(email, otp)

    } catch (error) {
        console.error("Error generating OTP:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while generating the OTP",
        });
    }
};

export const verifyotp = async (req, res) => {
    const { otp, email } = req.body;

    try {
        const emailFound = await OTP.findOne({ email });

        if (!emailFound) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        if (otp !== emailFound.otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

         const otpCreatedAt = new Date(emailFound.updatedAt);  // Convert createdAt to Date object
         const currentTime = new Date();  // Get current time
         const differenceInMilliseconds = currentTime - otpCreatedAt;  // Time difference in ms
 
         // Check if OTP is older than 2 minutes (2 * 60 * 1000 ms)
         const twoMinutesInMilliseconds = 2 * 60 * 1000;
 
         if (differenceInMilliseconds > twoMinutesInMilliseconds) {
             return res.status(400).json({ message: "OTP has expired" });
         }

        return res.status(200).json({ message: "OTP Verified" });
    } catch (error) {
        console.error("Error in Verify Controller: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) =>{

    const { fullName, email, password } = req.body

    try{
        
        if (!fullName || !email || !password){
            return res.status(400).json({message: "All Fields are rewuired"})
        }

        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message: "Email already Exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else{
            res.send(400).json({message: "Invalid user Data"})
        }

        sendSuccessMail(fullName, email, password)

    } catch (error) {
        console.log("Error in Sign up controller:  ", error.message)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body
    try{

        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid Credenttials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch(error) {
        console.log("Error in Login Controller:  ", error)
        res.send(500).json({message: "Internal Server Error"})
    }
}

export const logout = (req, res) =>{
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged Out Successfully"})
    } catch(error) {
        console.log("Error in Logging Out")
        res.send(500).json({message: "Internal Server Error"})  
    }
}

export const updateProfile = async (req, res) =>{

    try{

        const { profilePic } = req.body
        const userId = req.user._id
        
        if(!profilePic){
            return res.status(400).json({ message: "Profile Pic is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updateUser)

    } catch(error) {
        console.log("Error in Update Profile: ", error )
        res.status(500).json({message: "Internal Server Error"})
    }  
}

export const checkAuth = (req, res) =>{
    try{
        
        res.status(200).json(req.user)

    } catch(error) {
        console.log("Error in CheckAuth Controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}