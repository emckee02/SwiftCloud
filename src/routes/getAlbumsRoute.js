import { db } from '../db.js';

export const getAlbumsRoute = {
    path: '/api/v1.0/albums',
    method: 'get',
    handler: async (req, res) => {
        const albumsCursor = await db.collection('songs').aggregate([
            {
                $group: {
                    _id: "$Album",
                    junePlays: { $sum: "$Plays - June" },
                    julyPlays: { $sum: "$Plays - July" },
                    augustPlays: { $sum: "$Plays - August"},
                },
            },
            {
                $addFields: {
                    totalPlays: { $add: ["$junePlays", "$julyPlays", "$augustPlays"]}
                },
            }, 
            {
                $sort: { totalPlays: -1 }
            }
        ]);
        const albums = await albumsCursor.toArray();
        res.json(albums);
    },
};