import mongoose from 'mongoose'
export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sahoosuraj744_db_user:HtDUl1MqHatLvakO@cluster0.9ign9ht.mongodb.net/devTinder")
}
