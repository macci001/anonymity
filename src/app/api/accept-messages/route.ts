import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if(!session || !userId) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, {
            status: 401
        });
    }
    const {acceptMessage} = await req.json();
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessage
        }, {
            new: true
        });
        if(!updatedUser) {
            return NextResponse.json({
                message: "Unable to update user",
                success: false
            }, {
                status: 500
            })
        }
        return NextResponse.json({
            message: "User updated successfully.",
            success: true
        } , {
            status: 200
        })
    } catch {
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;
    if(!session || !userId) {
        return NextResponse.json({
            message: "Not Authenticated",
            success: false
        }, {
            status: 401
        })
    }

    try {
        const user = await UserModel.findById(userId);
        if(!user) {
            return NextResponse.json({
                success: false,
                message: "No user found."
            }, {
                status: 404
            })
        }
        return NextResponse.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessages,
            message: ""
        }, {
            status: 200
        })
    } catch (e) {
        console.log("ACCEPT_MESSAGE_GET ", e);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}