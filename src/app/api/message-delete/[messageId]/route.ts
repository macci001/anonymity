import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(req: NextRequest, {params}: {params: {messageId: string}}) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if(!userId) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }
    const messageId = params.messageId;
    try {
        const user = await UserModel.updateOne(
            {_id: userId},
            {$pull: {messages: {_id: messageId}}}
        );
        if(user.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message already deleted or does not belongs to the user"
            }, {
                status: 404
            })
        }
        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, {
            status: 200
        })
    } catch (e) {
        console.log("[MESSAGE_DELETE] ", e);
        return NextResponse.json({
            success: false,
            message: "Some Error Occured"
        }, {
            status: 500
        })
    }

}