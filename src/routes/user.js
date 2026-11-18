import express from 'express'
import {userAuth} from '../middlewares/auth.js'
import { ConnectionRequest } from '../models/connectionRequest.js';
import { User } from '../models/user.js';
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"
const userRouter=express.Router();

//Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
   try {
     const loggedInUser=req.user;
     const connectionRequests=await ConnectionRequest.find({
             toUserId:loggedInUser._id,
             status:"interested"
     }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl"])
    //.populate("fromUserId","firstName lastName")
    // we can use both this line to populate firstName and lastName
     res.json({messgae:"Data fetched successfully",
      data:connectionRequests
     })

   } catch (error) {
    res.status(400).message({message:error.message})
   }
})
userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try {
    const loggedInUser=req.user;
    const connectionRequests=await ConnectionRequest.find({
      $or:[
        {toUserId:loggedInUser._id,status:"accepted"},
        {fromUserId:loggedInUser._id,status:"accepted"}
      ]
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
    const data=connectionRequests.map((row)=>{
      if (row.fromUserId._id.toString()===loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })
    res.status(200).json({data})
  } catch (error) {
    res.status(400).message({message:error.message})
  }
})
userRouter.get("/feed",userAuth,async(req,res)=>{
  try {
     // User should see all the user cards except
     // 0- his own card
     // 1- his connections
     // 2- Ignored people
     // 3- already sent the npm create vite@latest my-react-app request
    
     const loggeddInUser=req.user;
     const page=parseInt(req.query.page) ||1
     let limit=parseInt(req.query.limit)||10
     limit = limit> 50?50 : limit;
     const skip=(page-1) * limit
     const connectionRequests=await ConnectionRequest.find({
      $or:[
        {fromUserId:loggeddInUser._id},
        {toUserId:loggeddInUser._id}
      ]
     }).select("fromUserId toUserId")
    const hideUsersFromFeed=new Set()
    connectionRequests.forEach(req=>{
      hideUsersFromFeed.add(req.fromUserId.toString())
      hideUsersFromFeed.add(req.toUserId.toString())
    })
    const users=await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUsersFromFeed)}},
        {_id:{$ne:loggeddInUser._id}}
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    res.json({data:users})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
export default userRouter