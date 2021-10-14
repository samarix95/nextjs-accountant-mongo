import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const ObjectId = require('mongodb').ObjectId;
const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const userId = session.user.id;

    try {
        const wallets = await req.db.collection('wallets').find({
            userId: userId,
            isDeleted: false,
        }).toArray();

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

    const { walletName, walletDescription } = req.body;
    const userId = session.user.id;

    if (walletName === null) {
        return res.status(400).json({ message: "Wallet name is required" });
    }

    if (walletName.length === 0) {
        return res.status(400).json({ message: "Wallet name is required" });
    }

    try {
        // Try to find exist user wallets
        const wallets = await req.db.collection('wallets').findOne({
            userId: userId,
            name: walletName,
            isDeleted: false,
        });

        if (wallets !== null) {
            return res.status(400).json({ message: `You have wallet '${walletName}'`, });
        }

        // Add new wallet
        await req.db.collection('wallets').insertOne({
            userId: userId,
            name: walletName,
            description: walletDescription === null ? '' : walletDescription,
            isDeleted: false,
        });

        return res.status(200).json({ message: `Wallet '${walletName}' was added successful` })
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message });
    }
});

handler.put(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id, walletName, walletDescription } = req.body;
    const userId = session.user.id;

    if (id === null) {
        return res.status(404).json({ message: "Nothing to update" });
    }

    if (walletName === null) {
        return res.status(400).json({ message: "Wallet name is required" });
    }

    if (walletName.length === 0) {
        return res.status(400).json({ message: "Wallet name is required" });
    }

    try {
        // Try to find exist user wallet
        const wallets = await req.db.collection('wallets').findOne({
            userId: userId,
            _id: ObjectId(id),
            isDeleted: false,
        });

        if (wallets === null) {
            return res.status(404).json({ message: "Nothing to update" });
        }

        await req.db.collection('wallets').updateOne({
            _id: ObjectId(id),
        }, {
            $set: {
                name: walletName,
                description: walletDescription === null ? '' : walletDescription,
            }
        });

        return res.status(200).json({ message: `Wallet was updated` })
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message });
    }
});

handler.delete(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id } = req.body;
    const userId = session.user.id;

    if (id === null) {
        return res.status(404).json({ message: "Nothing to delete" });
    }

    try {
        // Try to find exist user wallet
        const wallets = await req.db.collection('wallets').findOne({
            _id: ObjectId(id),
            userId: userId,
            isDeleted: false,
        });

        if (wallets === null) {
            return res.status(404).json({ message: "Nothing to delete" });
        }

        // Delete balance
        await req.db.collection('balances').updateMany({
            userId: userId,
            walletId: id,
        }, {
            $set: {
                isDeleted: true,
            }
        });

        // Delete history
        await req.db.collection('balances_history').updateMany({
            userId: userId,
            walletId: id,
        }, {
            $set: {
                isDeleted: true,
            }
        });

        // Delete wallet
        await req.db.collection('wallets').updateOne({
            _id: ObjectId(id),
        }, {
            $set: {
                isDeleted: true,
            }
        });

        return res.status(200).json({ message: `Wallet '${wallets.name}' was deleted` })
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message });
    }
});

export default handler;
