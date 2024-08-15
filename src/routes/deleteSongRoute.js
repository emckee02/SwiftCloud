import { db } from '../db.js';
import { ObjectId } from 'mongodb';

export const deleteSongRoute = {
    path: '/api/v1.0/songs/:id',
    method: 'delete',
    handler: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.collection('songs').deleteOne({ _id: ObjectId.createFromHexString(id)});

            if (result.deletedCount === 1) {
                res.status(204).json({});
            } else {
                res.status(404).json({ message: 'Invalid song ID'});
            }

        } catch (e) {
            res.status(404).json({ message: 'Invalid song ID'});
        }
    },
};