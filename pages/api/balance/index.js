import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';

import middleware from '../../../middleware/database';

const ObjectId = require('mongodb').ObjectId;
const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
    const session = await getSession({ req });

    const { walletId } = req.query;

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const userId = session.user.id;

    let mathces = {
        userId: userId,
        isDeleted: false,
    };

    if (typeof walletId !== "undefined") {
        mathces.walletId = walletId;
    }

    try {
        const balances = await req.db.collection('balances').aggregate([
            {
                $match: mathces
            },
            {
                $set: {
                    categoryId: {
                        $toObjectId: "$categoryId",
                    },
                    walletId: {
                        $toObjectId: "$walletId",
                    },
                },
            },
            {
                $lookup: {
                    from: "balances_history",
                    let: {
                        categoryId: "$categoryId",
                        year: "$year",
                        month: "$month",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [{ $toObjectId: "$categoryId" }, { $toObjectId: "$$categoryId" }] },
                                        { $eq: ["$year", "$$year"] },
                                        { $eq: ["$month", "$$month"] },
                                        { $eq: ["$isDeleted", false] },
                                        { $eq: ["$deleteDate", null] },
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                comment: 1,
                                value: {
                                    $convert: {
                                        input: "$value",
                                        to: "double"
                                    }
                                },
                                date: 1,
                            }
                        }
                    ],
                    as: "balanceHistory",
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData",
                }
            },
            {
                $unwind: "$categoryData"
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: "walletId",
                    foreignField: "_id",
                    as: "walletData",
                }
            },
            {
                $unwind: "$walletData"
            },
            {
                $project: {
                    balance: {
                        $convert: {
                            input: "$balance",
                            to: "double"
                        }
                    },
                    month: 1,
                    year: 1,
                    balanceHistory: 1,
                    "categoryData.name": 1,
                    "categoryData.description": 1,
                    "categoryData.isSpending": 1,
                    "categoryData._id": 1,
                    "walletData.name": 1,
                    "walletData.description": 1,
                    "walletData.isSpending": 1,
                    "walletData._id": 1,
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

    const { date, walletId, categoryId, value, comment } = req.body;
    const userId = session.user.id;

    if (value == 0 || value === "") {
        return res.status(400).json({ message: "Value is required" });
    }

    if (value < 0) {
        return res.status(400).json({ message: "Get negative value" });
    }

    if (walletId === null || walletId === "") {
        return res.status(400).json({ message: "Wallet id is required" });
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
        // Try to find exist user wallet
        const wallet = await req.db.collection('wallets').findOne({
            _id: ObjectId(walletId),
            userId: userId,
            isDeleted: false,
        });

        if (wallet === null) {
            return res.status(400).json({ message: `Wallet not found (ID '${walletId}')` });
        }

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
            walletId: walletId,
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
            walletId: walletId,
            categoryId: categoryId,
            value: Number(parseFloat(balanceValue).toFixed(2)),
            comment: comment === null ? '' : comment,
            date: date,
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
                    balance: Number(parseFloat(newBalance).toFixed(2)),
                }
            });
        } else {
            await req.db.collection('balances').insertOne({
                userId: userId,
                walletId: walletId,
                categoryId: categoryId,
                balance: Number(parseFloat(newBalance).toFixed(2)),
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

handler.put(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id, walletId, categoryId, value } = req.body;
    const userId = session.user.id;

    if (value == 0 || value === "") {
        return res.status(400).json({ message: "Value is required" });
    }

    if (walletId === null || walletId === "") {
        return res.status(400).json({ message: "Wallet id is required" });
    }

    if (categoryId === null || categoryId === "") {
        return res.status(400).json({ message: "Category id is required" });
    }

    if (id === null || id === "") {
        return res.status(400).json({ message: "Balance id is required" });
    }

    try {
        // Check if balance exists
        const existBalance = await req.db.collection('balances').findOne({
            userId: userId,
            _id: ObjectId(id),
            isDeleted: false,
        });

        if (existBalance === null) {
            return res.status(400).json({ message: `Balance not found (ID '${categoryId}')` });
        }

        if (existBalance.balance == value && existBalance.categoryId == categoryId && existBalance.walletId == walletId) {
            return res.status(400).json({ message: `Nothing to update` });
        }

        // Try to find exist user wallet
        const wallet = await req.db.collection('wallets').findOne({
            _id: ObjectId(walletId),
            userId: userId,
            isDeleted: false,
        });

        if (wallet === null) {
            return res.status(400).json({ message: `Wallet not found (ID '${walletId}')` });
        }

        // Try to find exist category
        const needCategory = await req.db.collection('categories').findOne({
            _id: ObjectId(categoryId),
            userId: userId,
            isDeleted: false,
        });

        if (needCategory === null) {
            return res.status(400).json({ message: `Category not found (ID '${categoryId}')` });
        }

        // Get exist category
        const haveCategory = await req.db.collection('categories').findOne({
            _id: ObjectId(existBalance.categoryId),
            userId: userId,
            isDeleted: false,
        });

        if (haveCategory.isSpending !== needCategory.isSpending) {
            return res.status(400).json({ message: `Can't change to categoty with different spending type ${needCategory.name}` });
        }

        // Check if you already have balance with new category
        const existBalanceWithNewCategory = await req.db.collection('balances').findOne({
            _id: { $ne: ObjectId(id) },
            userId: userId,
            categoryId: categoryId,
            year: existBalance.year,
            month: existBalance.month,
        });

        if (existBalanceWithNewCategory !== null) {
            return res.status(400).json({ message: `Can't set new category. You already have balance with category '${needCategory.name}'` });
        }

        // Calculate balance difference
        const balanceDiff = parseFloat(parseFloat(value) - parseFloat(existBalance.balance)).toFixed(2);

        // Update exist balance
        await req.db.collection('balances').updateOne({
            _id: ObjectId(id),
            userId: userId,
        }, {
            $set: {
                balance: Number(parseFloat(value)),
                walletId: walletId,
                categoryId: categoryId,
            }
        });

        // Update exists history
        if (existBalance.categoryId !== categoryId) {
            await req.db.collection('balances_history').updateMany({
                userId: userId,
                walletId: walletId,
                categoryId: existBalance.categoryId,
                year: existBalance.year,
                month: existBalance.month,
            }, {
                $set: {
                    categoryId: categoryId,
                }
            });
        }

        let histoyComment = "Manual change";

        histoyComment += existBalance.walletId !== walletId
            ? `. Wallet was changed to '${wallet.name}'`
            : ""

        histoyComment += existBalance.categoryId !== categoryId
            ? `. Category was changed from '${haveCategory.name}' to '${needCategory.name}'`
            : ""

        // Add change to history
        await req.db.collection('balances_history').insertOne({
            userId: userId,
            walletId: walletId,
            categoryId: categoryId,
            value: Number(balanceDiff),
            comment: histoyComment,
            date: new Date(),
            month: existBalance.month,
            year: existBalance.year,
            isDeleted: false,
            deleteDate: null,
        });

        return res.status(200).json({ message: `Balance was update successful` });

    } catch (error) {
        console.log(error)
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
        // Check if balance exists
        const existBalance = await req.db.collection('balances').findOne({
            userId: userId,
            _id: ObjectId(id),
        });

        if (existBalance === null) {
            return res.status(400).json({ message: `Nothing to delete (ID '${categoryId}')` });
        }

        // Delete history
        await req.db.collection('balances_history').deleteMany({
            userId: userId,
            categoryId: existBalance.categoryId,
            year: existBalance.year,
            month: existBalance.month,
        });

        // Delete balance
        await req.db.collection('balances').deleteOne({
            userId: userId,
            _id: ObjectId(id),
        });

        return res.status(200).json({ message: `Balance was deleted` });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: new Error(error).message });
    }
});

export default handler;
