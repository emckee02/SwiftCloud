import { db } from '../db.js';
import { ObjectId } from 'mongodb';

export const putSongRoute = {
    path: '/api/songs/:id',
    method: 'put',
    handler: async (req, res) => {
        try {
            const { id } = req.params;
            const { song, artist, writer, album, year} = req.body;

            if (song && artist && writer && album && Number.isInteger(parseInt(year))) {
                const result = await db.collection('songs').findOneAndUpdate(
                    { _id: ObjectId.createFromHexString(id)},
                    { $set: {
                        Song: song, 
                        Artist: artist,
                        Writer: writer, 
                        Album: album, 
                        Year: year
                    }}
                );

                if (result) {
                    const url = `http://localhost:8080/api/songs/${id}`;
                    return res.status(200).json({ url })
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