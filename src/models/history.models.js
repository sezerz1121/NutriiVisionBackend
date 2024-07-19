import mongoose from "mongoose";


const historySchema = new mongoose.Schema
(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        image:
        {
            type:String,
            required:true
        },
        text:
        {
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const History =  mongoose.model("History",historySchema);