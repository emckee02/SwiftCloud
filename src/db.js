import { MongoClient } from 'mongodb';

let db;

const connectToDb = async (cb) => {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    db = client.db('swiftCloudDB');
    cb();
}

export {
    db, 
    connectToDb
}