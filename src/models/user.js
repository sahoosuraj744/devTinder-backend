import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        maxLength: 40,
       
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
        // validate(value) {
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error("Please enter a strong password")
        //     }
        // }
    },
    age: {
        type: Number,
        trim: true,
        min: 18
    },
    gender: {
        type: String,
        trim: true,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not a valid gender type`
        }
        
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url ")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about the user"
    },
    skills: {
        type: [String],
    }

}, { timestamps: true })
userSchema.index({firstName:1,lastName:1})
// userSchema.methods.getJWT=async function (){
//     const user=this
//     const token=await jwt.sign({_id:user._id},"DEVTinder$790",
//         {expiresIn:"1d"}
//     )
//     return token
// }
// userSchema.methods.validatePassword=async function (passwordInputByUser){
//     const user=this 
//     const passwordHash=user.password
//     const isPasswordValid=await bcrypt.compare(
//         passwordInputByUser,
//         passwordHash
//     )
//     return isPasswordValid
// }
export const User = mongoose.model("User", userSchema)