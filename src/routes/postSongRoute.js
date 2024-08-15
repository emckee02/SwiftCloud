import { db } from '../db.js';

export const postSongRoute = {
    path: '/api/v1.0/songs',
    method: 'post',
    handler: async (req, res) => {
        const { song, artist, writer, album, year } = req.body;

        if (song && artist && writer && album && Number.isInteger(parseInt(year))) {
            const result = await db.collection('songs').insertOne({ 
                Song: song,
                Artist: artist,
                Writer: writer,
                Album: album,
                Year: parseInt(year),
                'Plays - June': 0,
                'Plays - July': 0,
                'Plays - August': 0,
            });

            const { insertedId } = result;
            const id = insertedId.toString();
            res.status(201).json({ id });
        } 
        else {
            res.status(404).json({ message: 'Missing or invalid form data'});
        }
    },
};