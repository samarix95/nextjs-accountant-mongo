import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const userId = session.user.id;

    try {
        const wallets = await req.db.collection('wallets').find({ userId: userId }).toArray();

        return res.status(200).json({
            message: "",
            data: wallets,
        })
    } catch (error) {
        return res.status(500).json({
            message: new Error(error).message,
            data: [],
        });
    }
});

handler.post(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { walletName, walletDescribe } = req.body;
    const userId = session.user.id;

    if (walletName === null) {
        return res.status(400).json({ message: "Type wallet name" });
    }

    if (walletName.length === 0) {
        return res.status(400).json({ message: "Type wallet name" });
    }

    // Try to find exist user wallets
    try {
        const wallets = await req.db.collection('wallets').findOne({ userId: userId, name: walletName });
        if (wallets !== null) {
            return res.status(400).json({
                message: `You have wallet '${walletName}'`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: new Error(error).message,
        });
    }

    // Add new wallet
    try {
        await req.db.collection('wallets').insertOne({ userId: userId, name: walletName, describe: walletDescribe === null ? '' : walletDescribe });

        return res.status(200).json({
            message: `Wallet '${walletName}' was added successful`,
        })
    } catch (error) {
        return res.status(500).json({
            message: new Error(error).message,
        });
    }
});

export default handler;