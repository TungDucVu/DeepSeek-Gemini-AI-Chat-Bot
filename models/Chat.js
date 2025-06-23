import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        
        name: {type: String, required: true},
        messages: [
            {
                role: String, required: true,
                content: String, required: true,
                timestamp: number, required: true,
            }
        ],
        userId: {type: String, required: true}
        
    },
    {timestamps: true}
)

const Chat = mongoose.model.Chat || mongoose.model("Chat", ChatSchema)

export default Chat