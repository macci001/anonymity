import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";
import { Message } from '@/model/user';

export async function POST(req: Request) {
    await dbConnect();
    const {content, username} = await req.json();
    if(!content) {
        return NextResponse.json({
            success: false,
            message: "Content is required"
        }, {
            status: 400
        })
    }
    if(!username) {
        return NextResponse.json({
            success: false,
            message: "username is required"
        }, {
            status: 400
        })
    }

    try {
        const user = await UserModel.findOne({
            username: username
        });

        if(!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, {
                status: 403
            })
        }

        const message = {content, createdAt: new Date()};
        user.messages.push(message as Message);
        await user.save();

        return NextResponse.json({
            message: "User saved successfully",
            success: true
        } , {
            status: 200
        })
    } catch (e) {
        console.log("SEND_MESSAGE_POST ", e);
        return NextResponse.json({
            success: false,
            message: "Something went wrong."
        }, {
            status: 500
        });
    }
}