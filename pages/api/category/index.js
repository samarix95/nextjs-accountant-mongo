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
        const categories = await req.db.collection('categories').find({
            userId: userId,
            isDeleted: false,
        }).toArray();

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

handler.post(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { categoryName, categoryDescription, isSpending } = req.body;
    const userId = session.user.id;

    if (categoryName === null) {
        return res.status(400).json({ message: "Category name is required" });
    }

    if (categoryName.length === 0) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        // Try to find exist user categories
        const category = await req.db.collection('categories').findOne({
            userId: userId,
            name: categoryName,
            isDeleted: false,
        });

        if (category !== null) {
            return res.status(400).json({ message: `You have category '${category}'`, });
        }

        // Add new category
        await req.db.collection('categories').insertOne({
            userId: userId,
            name: categoryName,
            description: categoryDescription === null ? '' : categoryDescription,
            isSpending: isSpending,
            isDeleted: false,
        });

        return res.status(200).json({ message: `Category '${categoryName}' was added successful`, });
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message, });
    }
});

handler.put(async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "You're not autorized" });
    }

    const { id, categoryName, categoryDescription, isSpending } = req.body;
    const userId = session.user.id;

    if (id === null) {
        return res.status(404).json({ message: "Nothing to update" });
    }

    if (categoryName === null) {
        return res.status(400).json({ message: "Category name is required" });
    }

    if (categoryName.length === 0) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        // Try to find exist user category
        const category = await req.db.collection('categories').findOne({
            userId: userId,
            _id: ObjectId(id),
        });

        if (category === null) {
            return res.status(404).json({ message: "Nothing to update", });
        }

        // Update category
        await req.db.collection('categories').updateOne({
            _id: ObjectId(id),
            userId: userId,
        }, {
            $set: {
                name: categoryName,
                description: categoryDescription === null ? '' : categoryDescription,
                isSpending: isSpending,
            }
        });

        return res.status(200).json({ message: `Category was updated`, });
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message, });
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
        // Try to find exist user categories
        const category = await req.db.collection('categories').findOne({
            userId: userId,
            _id: ObjectId(id),
        });

        if (category === null) {
            return res.status(404).json({ message: "Nothing to delete", });
        }

        // Delete category
        await req.db.collection('categories').updateOne({
            _id: ObjectId(id),
            userId: userId,
        }, {
            $set: {
                isDeleted: true,
            }
        });

        return res.status(200).json({ message: `Category '${category.name}' was deleted`, })
    } catch (error) {
        return res.status(500).json({ message: new Error(error).message, });
    }
});

export default handler;
