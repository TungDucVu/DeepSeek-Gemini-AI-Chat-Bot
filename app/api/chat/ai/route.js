export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// google gen ai api key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
    try {
        const {userId} = getAuth(req)
        const {prompt, chatId} = await req.json()
        
        if (!userId) {
            return NextResponse.json({success: false, message: 'User not authenticated'})
        }

        //find chat docs in db based on chatId and userId
        await connectDB()
        const data = await Chat.findOne({userId, _id: chatId})

        //create user message object
        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now()
        }
        data.message.push(userPrompt)

        //call gemini api to get a chat completion
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);

        const reply = result.response.candidates[0]?.content?.parts[0]?.text || "No response from Gemini";

        const aiMessage = {
            role: "model",
            content: reply,
            timestamp: Date.now(),
        };

        data.message.push(aiMessage);
        await data.save();

        return NextResponse.json({ success: true, data: aiMessage });
    } catch (error) {
        return NextResponse.json({success: false, error: message})
    }
}

await main();