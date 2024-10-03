import {MongoClient, ServerApiVersion, MongoClientOptions} from "mongodb";

const uri = process.env.MONGODB_URI!;
const options: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
        strict: true
    }
};

export const client: MongoClient = new MongoClient(uri, options);