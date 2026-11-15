import mongoose from 'mongoose'
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", //reference to the user
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, { timestamps: true })
connectionRequestSchema.index({senderId:1,receiverId:1})
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Can't send connection request to yourself")
    }
})
export const ConnectionRequest =new mongoose.model("ConnectionRequest", connectionRequestSchema)