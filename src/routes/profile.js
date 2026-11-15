import express from "express";
import { userAuth } from "../middlewares/auth.js";
const profileRouter = express.Router();
import { validateEditProfileData } from "../utils/validation.js";
import bcrypt from 'bcrypt'
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User doesnot exist! Please login again");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Please login to see profile");
    }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request");
        }
        const loggeddInUser = req.user;
        Object.keys(req.body).forEach(
            (key) => (loggeddInUser[key] = req.body[key]),
        );
        await loggeddInUser.save();
        res.status(200).json({
            message: ',Profile updated successfuly',
            data: loggeddInUser,
        });
    } catch (error) {
        res.status(401).send(error.message);
    }
});
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        if (!password || !newPassword) {
            throw new Error("Please provide current and new passwords");
        }
        const user = req.user;
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});
export default profileRouter;
