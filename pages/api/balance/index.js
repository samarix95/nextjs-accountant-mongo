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
        const balances = await req.db.collection('balances').aggregate([
            {
                $match: {
                    userId: userId,
                    isDeleted: false,
                }
            },
            {
                $set: {
                    categoryId: {
                        $toObjectId: "$categoryId",
                    }
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                }
            },
        ]).toArray();

        return res.status(200).json({
            message: "",
            data: balances,
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

    const { date, categoryId, value, comment } = req.body;
    const userId = session.user.id;

    if (value == 0 || value === "") {
        return res.status(400).json({ message: "Value is required" });
    }

    if (value < 0) {
        return res.status(400).json({ message: "Get negative value" });
    }

    if (categoryId === null || categoryId === "") {
        return res.status(400).json({ message: "Category id is required" });
    }

    if (date === "") {
        return res.status(400).json({ message: "Date is required" });
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

    // Add to balance history
    try {
        // Try to find exist user categories
        const category = await req.db.collection('categories').findOne({
            _id: ObjectId(categoryId),
            userId: userId,
            isDeleted: false,
        });

        if (category === null) {
            return res.status(400).json({ message: `Category not found (ID '${categoryId}')` });
        }

        // Look for exist balance history with category
        const existBalance = await req.db.collection('balances').findOne({
            userId: userId,
            categoryId: categoryId,
            month: month,
            year: year,
            isDeleted: false,
            deleteDate: null,
        });

        const balanceExists = existBalance !== null ? true : false;
        const balance = existBalance !== null ? existBalance.balance : 0.0;
        const balanceValue = category.isSpending ? -1 * parseFloat(value) : parseFloat(value);
        const newBalance = parseFloat(balance) + parseFloat(balanceValue);

        // Add to balance-history
        await req.db.collection('balances_history').insertOne({
            userId: userId,
            categoryId: categoryId,
            value: balanceValue,
            comment: comment === null ? '' : comment,
            month: month,
            year: year,
            isDeleted: false,
            deleteDate: null,
        });

        // Add to balance or update exist
        if (balanceExists) {
            await req.db.collection('balances').updateOne({
                _id: ObjectId(existBalance._id)
            }, {
                $set: {
                    balance: newBalance,
                }
            });
        } else {
            await req.db.collection('balances').insertOne({
                userId: userId,
                categoryId: categoryId,
                balance: newBalance,
                month: month,
                year: year,
                isDeleted: false,
                deleteDate: null,
            });
        }

        return res.status(200).json({ message: `Category was added successful` });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: new Error(error).message });
    }
});

export default handler;
