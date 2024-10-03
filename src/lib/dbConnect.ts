import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect() {
    if(connection.isConnected) {
        console.log("database is connected.");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!);
        const isConnected = db.connections[0].readyState
        if(isConnected) {
            connection.isConnected = isConnected
        }
        console.log("database is connected.");
    } catch(error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;