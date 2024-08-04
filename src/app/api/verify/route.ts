import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import {z} from "zod";

const validateBody = z.object({
    username: userValidation,
    verifyCode: z.string().length(6)
})

export async function POST(req: Request) {
    dbConnect();
    try {
        const body = await req.json();
        const parsedBody = validateBody.safeParse({
            username: body.username,
            verifyCode: body.verifyCode
        }); 
        if(!parsedBody.success) {
            const userNameError =  parsedBody.error.format().username?._errors || [];
            const userNameErrorFormatted = userNameError.length === 0 ? "" : "[USER_NAME_ERROR] " + userNameError.join(", ");
            const verifyCodeError = parsedBody.error.format().verifyCode?._errors || [];
            const verifyCodeErrorFormatted = verifyCodeError.length === 0 ? "" : "[VERIFY_CODE_ERROR] " + verifyCodeError.join(", ");
            let errorMessage;
            if(userNameErrorFormatted.length !== 0 && verifyCodeErrorFormatted.length !== 0) {
                errorMessage = [userNameErrorFormatted, verifyCodeErrorFormatted].join(", ");
            } else if(userNameErrorFormatted.length !== 0) {
                errorMessage = userNameErrorFormatted
            } else if(verifyCodeErrorFormatted.length !== 0) {
                errorMessage = verifyCodeErrorFormatted
            } else {
                errorMessage = "Invalid parameters"
            }
            return NextResponse.json({
                success: false,
                message: errorMessage
            }, {
                status: 400
            })
        }

        const {username, verifyCode} = parsedBody.data;
        const user = await UserModel.findOne({
            username
        });
        if(!user) {
            return NextResponse.json({
                success: false,
                message: "No user found."
            }, {
                status: 400
            })
        }

        const isVerifyCodeCorrect = user.verifyCode == verifyCode;
        const isVerifyCodeUnexpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isVerifyCodeCorrect && isVerifyCodeUnexpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                success: true,
                message: "user is verified"
            }, {
                status: 200
            })
        } else if(!isVerifyCodeUnexpired) {
            return NextResponse.json({
                success: false,
                message: "verify code is expired"
            }, {
                status: 403
            })
        } else {
            return NextResponse.json({
                success: false,
                message: "verify code is incorrect"
            }, {
                status: 403
            })
        }
    } catch (e) {
        console.log("VERIFY_POST", e);
        return NextResponse.json({
            success: false, 
            message: "Internal Error Ocurred"
        }, {
            status: 500
        });
    }
}