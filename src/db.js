import { MongoClient } from 'mongodb';

let db;

const connectToDb = async (cb) => {
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kwmy1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    await client.connect();
    db = client.db('swiftCloudDB');
    cb();
}

export {
    db, 
    connectToDb
}