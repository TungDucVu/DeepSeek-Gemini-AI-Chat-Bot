import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {userId} = getAuth()
        if (!userId) {
            return NextResponse.json({success: false, message:'User not authenticated'})
        }

        const {chatId, name} = await req.json()
        // connect db and update chat name
        await connectDB()
        await Chat.findOneAndUpdate({_id: chatId, userId}, {name})
        return NextResponse.json({success: true, message:'Chat renamed'})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}