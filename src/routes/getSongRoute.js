import { db } from '../db.js';
import { ObjectId } from 'mongodb';

export const getSongRoute = {
    path: '/api/v1.0/songs/:id',
    method: 'get',
    handler: async (req, res) => {
        try {
            const { id } = req.params;
            const song = await db.collection('songs').findOne({ _id: ObjectId.createFromHexString(id) });

            if (song) {
                res.json(song);
            } else {
                res.status(404).json({ message: 'Invalid song ID' });
            }
        } catch(e) {
            res.status(404).json({ message: 'Invalid song ID'});
        }
    },
};