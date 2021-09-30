import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const mongoClient = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// with serverless we need to use cache to prevent re-opening connection
let cached = global.mongo

if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
}

async function database(req, res, next) {
    if (!cached.promise) {
        cached.promise = mongoClient.connect().then((client) => {
            return {
                client,
                db: client.db(process.env.DATABASE_NAME),
            }
        })
        cached.conn = await cached.promise
    }
    req.dbClient = cached.conn.client
    req.db = cached.conn.db
    return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;