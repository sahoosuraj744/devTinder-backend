import cron from 'node-cron'
import {subDays,startOfDay,endOfDay} from 'date-fns'
import sendEmail from './sendEmail.js'
import { ConnectionRequest } from '../models/connectionRequest.js'
export const runCronJob=()=>{
    cron.schedule("25 32 13 * * *",async ()=>{
        const yesterday=subDays(new Date(),0)
        const yesterdayStart=startOfDay(yesterday)
        const yesterdayEnd=endOfDay(yesterday)
    try {
        const pendingRequests=await ConnectionRequest.find({
            status:"interested",
            createdAt:{
              $gte:yesterdayStart,
              $lt:yesterdayEnd
            }
        }).populate("fromUserId toUserId")
        const listOfEmails=[... new Set(pendingRequests.map((req)=>req.toUserId.emailId))]
        console.log(listOfEmails);
        
        for(const email of listOfEmails){
          try {
             const res=await sendEmail("You have pending frined request from "+ email)
             console.log(res);
             
          } catch (error) {
            console.error(error);
          }
        }
    } catch (error) {
        console.error(error)
    }
  })
}
