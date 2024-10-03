import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    });
                    if(!user) {
                        throw new Error("Given username/email does not exist.");
                    }
                    if(!user.isPasswordSet) {
                      throw new Error("Incorrect Password")
                    }
                    if(!user.isVerified) {
                        throw new Error("User is not verified, please verify");
                    }
                    const isPasswordcorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordcorrect) {
                        throw new Error("Password is incorrect");
                    }

                    return user;
                } catch (e: any) {
                    throw new Error(e);
                }
            }
        }),
        GithubProvider({
          clientId: process.env.GITHUB_AUTH_CLIENT_ID!,
          clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({user}): Promise<any> {
          await dbConnect();
          const userFromDb = await UserModel.findOne({email: user.email});
          if(userFromDb) {
            return true;
          }
          const username = user.name?.replaceAll(" ", "").toLowerCase() + user.id.toString();

          const newUser = new UserModel({
            username,
            email: user.email,
            isVerified: true,
            isAcceptingMessages: true,
            isPasswordSet: false,
            messages: []
          })
          await newUser.save();

          return UserModel.findOne({username});
        },
        async jwt({ token, user }) {
          if (user) {
            token._id = user._id?.toString() ?? user.id;
            token.isVerified = user.isVerified ?? true;
            token.isAcceptingMessages = user.isAcceptingMessages ?? true;
            token.username = user.username ?? user.name?.replaceAll(" ", "").toLowerCase() + user.id.toString();
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
          }
          return session;
        },
      },
      session: {
        strategy: 'jwt',
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: '/sign-in',
      },
    };