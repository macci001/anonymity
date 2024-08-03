import {z} from "zod";
import { NextResponse } from "next/server"; 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userValidation } from "@/schemas/signUpSchema";

const UniqueUsername = z.object({
    username: userValidation
})

export async function GET(req: Request) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const queryParams = {
            username: searchParams.get("username")
        }
        const parsedParams = UniqueUsername.safeParse(queryParams);
        if(!parsedParams.success) {
            const error = parsedParams.error.format().username?._errors || [];
            const formattedError = error?.length != 0 ? error?.join(", ") : "Invalid username";
            return NextResponse.json({message: formattedError, success: false}, {status: 400});
        }

        const username = parsedParams.data.username;
        await dbConnect();
        const user = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(user) {
            return NextResponse.json({
                success: false,
                message: "Username already taken"
            }, {
                status: 200
            })
        }
        return NextResponse.json({
            message: "Username available",
            success: true
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Internal Error Occured"
        }, {
            status: 500
        })
    }
}