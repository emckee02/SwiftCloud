import { db } from '../db.js';
import { ObjectId } from 'mongodb';

export const putSongPlaysRoute = {
    path: '/api/v1.0/songs/:id/month',
    method: 'put',
    handler: async (req, res) => {
        try {
            const { id } = req.params;
            const { month } = req.body;

            if (month === 'June' || month === 'July' || month === 'August')  {
                const { modifiedCount } = await db.collection('songs').updateOne(
                    { _id: ObjectId.createFromHexString(id)},
                    { $inc: {
                        [`Plays - ${month}`]: 1
                    }}
                );

                if (modifiedCount) {
                    return res.status(200).json({ id })
                }

                res.status(404).json({ message: 'Invalid song ID'});
            } 
            else {
                res.status(404).json({ message: 'Missing or invalid form data'});
            }
        } catch(e) {
            res.status(404).json({ message: 'Invalid song ID'});
        }
    },
};