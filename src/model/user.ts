import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

export interface User extends Document {
    username: string,
    password: string,
    isPasswordSet: boolean,
    email: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    messages: Message[],
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required."],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required."],
        unique: true
    },
    password: {
        type: String
    },
    isPasswordSet: {
        type: Boolean,
        default: true,
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        required: [true, "isAcceptingMessage is required"]
    },
    messages: [MessageSchema]

})

const UserModel = mongoose.models.User as mongoose.Model<User> 
    || mongoose.model<User>("User", UserSchema);

export default UserModel;