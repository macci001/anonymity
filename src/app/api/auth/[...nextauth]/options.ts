import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials:any): Promise<any> {
                dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    });
                    if(!user) {
                        throw new Error("No user found with this email.");
                    }
                    if(!user.isVerified) {
                        throw new Error("user is not verified, please verify");
                    }
                    const isPasswordcorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordcorrect) {
                        throw new Error("password is incorrect");
                    }

                    return user;
                } catch (e: any) {
                    throw new Error(e);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}) {
            if(token) {
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY
}