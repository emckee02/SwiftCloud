import { db } from '../db.js';
import { ObjectId } from 'mongodb';
import { isValidMonth } from '../util.js';

export const putSongPlaysRoute = {
    path: '/api/v1.0/songs/:id/month/:month',
    method: 'put',
    handler: async (req, res) => {
        try {
            const { id, month } = req.params;

            if (isValidMonth(month))  {
                const { modifiedCount } = await db.collection('songs').updateOne(
                    { _id: ObjectId.createFromHexString(id) },
                    { $inc: { [`Plays - ${month}`]: 1 } }
                );

                if (modifiedCount) {
                    return res.status(200).json({ id });
                }

                res.status(404).json({ message: 'Invalid song ID'});
            } 
            else {
                res.status(404).json({ message: 'Invalid month'});
            }
        } catch(e) {
            res.status(404).json({ message: 'Invalid song ID'});
        }
    },
};