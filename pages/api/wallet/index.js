import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import { MongoClient } from 'mongodb';

import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

export async function getWalletsForInnerUse(userId) {
    const client = new MongoClient(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    let data = [];

    try {
        await client.connect();
        const db = client.db(process.env.DATABASE_NAME);
        const collection = db.collection('wallets');
        const wallets = await collection.find({ userId: userId }).toArray();
        data = wallets;
    } catch (e) {
        data = [];
    } finally {
        await client.close()
    }

    return JSON.parse(JSON.stringify({ data }))
}

handler.get(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(500).json({ message: "You're not autorized" });
    }

    const userId = session.user.id;

    try {
        const wallets = await req.db.collection('wallets').find({ userId: userId }).toArray();

        return res.json({
            message: "",
            data: wallets,
            success: true,
        })
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            data: [],
            success: false,
        });
    }
});

handler.post(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(500).json({ message: "You're not autorized" });
    }

    const { walletName } = req.body;
    const userId = session.user.id;

    if (walletName === null) {
        return res.status(400).json({ message: "Type wallet name" });
    }

    if (walletName.length === 0) {
        return res.status(400).json({ message: "Type wallet name" });
    }

    try {
        await req.db.collection('wallets').insertOne({ userId: userId, name: walletName });

        return res.json({
            message: `Wallet ${walletName} was added successful`,
            success: true,
        })
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
});

export default handler;