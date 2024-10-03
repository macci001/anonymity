import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import UserModel from "@/model/user";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const username = session?.user?.username;
    if(!session || !username) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated."
        }, {
            status: 401
        })
    }
    
    try {
        const user = await UserModel.aggregate([
            { $match: { username: username} },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
          ]).exec();
        if(!user || user.length === 0) {
            return NextResponse.json({
                message: "No messages found",
                success: false
            }, {
                status: 404
            })
        }
        return NextResponse.json({
            message: "User found",
            success: true,
            messages: user[0].messages
        }, {
            status: 200
        })
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}