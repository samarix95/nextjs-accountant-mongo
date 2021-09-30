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
        const categories = await req.db.collection('categories').find({ userId: userId, isDeleted: false }).toArray();

        return res.status(200).json({
            message: "",
            data: categories,
        })
    } catch (error) {
        return res.status(500).json({
            message: new Error(error).message,
            data: [],
        });
    }
});

export default handler;
