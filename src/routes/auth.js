import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateSignUpData } from '../utils/validation.js'
import { User } from '../models/user.js'
const authRouter = express.Router()
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password, gender, age } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            gender, age,
            password: passwordHash
        })
       const savedUser= await user.save()
       const token=jwt.sign({_id:user._id}, "DEVTinder$790", { expiresIn: "1d" })
       res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)})
        res.json({messsage:"User added successfully",data:savedUser})
        
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send("Email already exists");
        }
        res.status(400).send(error.message)
    }
})
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!emailId || !password) {
            throw new Error("Plase enter your email and password ")
        }
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            //Create a jwt token
        
            const token = jwt.sign({_id:user._id}, "DEVTinder$790", { expiresIn: "1d" })
            res.cookie("token", token)
            res.send(user)
        } else {
            throw new Error("User doesnot exist")
        }

        //    const isPasswordValid = await user.validatePassword(password)
        //    if (isPasswordValid) {
        //     const token =await user.getJWT()
        //     res.cookie("token",token)
        //     res.send("Login Successful")
        //    }else{
        //     throw new Error("Invalid Credentials")
        //    }

    } catch (error) {
        res.status(404).send("ERROR: " + error.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send("Logout Successfully")
})
export default authRouter