import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const ObjectId = require('mongodb').ObjectId;
const handler = nextConnect();
handler.use(middleware);

handler.put(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id, date, value, comment } = req.body;
    const userId = session.user.id;

    if (id === null || id === "") {
        return res.status(400).json({ message: "Balance history id is required" });
    }

    if (value == 0 || value === "") {
        return res.status(400).json({ message: "Value is required" });
    }

    if (new Date(date) !== "Invalid Date" && !isNaN(new Date(date))) {
        if (date !== new Date(date).toISOString()) {
            return res.status(400).json({ message: "Get invalid date. Need date in ISO format" });
        }
    } else {
        return res.status(400).json({ message: "Get invalid date. Need date in ISO format" });
    }

    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    try {
        // Try to find balance history
        const existHistory = await req.db.collection('balances_history').findOne({
            _id: ObjectId(id),
            userId: userId,
        });

        if (existHistory === null) {
            return res.status(400).json({ message: `Balance history not found (ID '${id}')` });
        }

        if (existHistory.month !== month) {
            return res.status(400).json({ message: `Can't set another month` });
        }

        if (existHistory.year !== year) {
            return res.status(400).json({ message: `Can't set another year` });
        }
        const { walletId, categoryId, month, year } = existBalanceHistory;
        const valueDiff = parseFloat(value) - parseFloat(existHistory.value);

        // Update balance
        await req.db.collection('balances').updateOne({
            userId: userId,
            walletId: walletId,
            categoryId: categoryId,
            year: year,
            month: month,
        }, {
            $inc: {
                balance: Number(parseFloat(valueDiff).toFixed(2)),
            },
        });

        // Upadte balance history
        await req.db.collection('balances_history').updateOne({
            _id: ObjectId(id)
        }, {
            $set: {
                value: Number(parseFloat(value).toFixed(2)),
            }
        });

        return res.status(200).json({ message: `History was updated` });
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

    if (id === null || id === "") {
        return res.status(400).json({ message: "Balance id is required" });
    }

    try {
        // Check if balance history exists
        const existBalanceHistory = await req.db.collection('balances_history').findOne({
            _id: ObjectId(id),
            userId: userId,
        });

        if (existBalanceHistory === null) {
            return res.status(400).json({ message: `Nothing to delete (ID '${id}')` });
        }

        const { value, walletId, categoryId, month, year } = existBalanceHistory;

        // Update exist balance
        await req.db.collection('balances').updateOne({
            userId: userId,
            walletId: walletId,
            categoryId: categoryId,
            month: month,
            year: year,
        }, {
            $inc: {
                balance: Number(-1 * parseFloat(value).toFixed(2)),
            },
        });

        // Delete balance history
        await req.db.collection('balances_history').updateOne({
            _id: ObjectId(id),
            userId: userId,
        }, {
            $set: {
                isDeleted: true,
            }
        });

        return res.status(200).json({ message: `History was deleted` });
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message });
    }
});

export default handler;
