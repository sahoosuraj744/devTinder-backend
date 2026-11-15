import express from "express";
import cors from 'cors'
import { connectDB } from "./config/db.js";
const app = express();
import { User } from "./models/user.js";
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { userAuth } from "./middlewares/auth.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/",authRouter)
app.use("/",requestRouter)
app.use("/",profileRouter)
app.use("/",userRouter)
connectDB()
    .then(() => {
        console.log("DB connected");
        app.listen(7777, () => {
            console.log("http://localhost:7777");
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
