import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const ObjectId = require('mongodb').ObjectId;
const handler = nextConnect();
handler.use(middleware);

handler.delete(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id } = req.body;
    const userId = session.user.id;

    if (id === null || id === "") {
        return res.status(400).json({ message: "Balance id is required" });
    }

    try {
        // Check if balance history exists
        const existBalanceHistory = await req.db.collection('balances_history').findOne({
            userId: userId,
            _id: ObjectId(id),
        });

        if (existBalanceHistory === null) {
            return res.status(400).json({ message: `Nothing to delete (ID '${id}')` });
        }

        const { value, categoryId, month, year } = existBalanceHistory;

        // Update exist balance
        const existBalance = await req.db.collection('balances').findOne({
            userId: userId,
            categoryId: categoryId,
            month: month,
            year: year,

        });

        const newBalanceValue = parseFloat(existBalance.balance) - parseFloat(value);

        await req.db.collection('balances').updateOne({
            userId: userId,
            categoryId: categoryId,
            month: month,
            year: year,
        }, {
            $set: {
                balance: newBalanceValue,
            }
        });

        // Delete balance history
        await req.db.collection('balances_history').deleteOne({
            userId: userId,
            _id: ObjectId(id),
        });

        return res.status(200).json({ message: `History was deleted` });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: new Error(error).message });
    }
});

export default handler;
