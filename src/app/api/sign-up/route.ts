import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await dbConnect();
    console.log("here");
    try {
        const {username, email, password} = await req.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if(existingVerifiedUserByUsername) {
            return NextResponse.json({
                success: false,
                messages: "username is already taken"
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    messages: "user already exists with this email."
                }, {
                    status: 400
                });
            } else {
                const hashedpassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedpassword;
                existingUserByEmail.verifyCode = verifyCode;
                const expirydate = new Date();
                expirydate.setHours(expirydate.getHours() + 1);
                existingUserByEmail.verifyCodeExpiry = expirydate;
                await existingUserByEmail.save();
            }
        } else {
            const checkUser = await UserModel.findOne({
                username 
            });
            const hashedpassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            if(checkUser) {
                const user = await UserModel.updateOne({
                    username: username
                }, {
                    email: email,
                    password: hashedpassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                })
            } else {
                const newUser = new UserModel({
                    username: username,
                    email: email,
                    password: hashedpassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                })
                await newUser.save();
            }
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if(!emailResponse.success) {
            return NextResponse.json({
                success:false,
                message: "Error in sending verification e-mail"
            }, {
                status: 500
            });
        }
        return NextResponse.json({
            success: true,
            message: "verification Email sent. Please verify"
        }, {
            status: 200
        })
    } catch (e) {
        console.log("[SIGNUP_POST] ", e);
        return NextResponse.json({
            success: false,
            message: "Error registering the user."
        }, {
            status: 500
        })
    }

}