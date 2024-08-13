import { db } from '../db.js';

export const songRoute = {
    path: '/api/songs',
    method: 'get',
    handler: async (req, res) => {

        const { artist, writer, album, year } = req.query;

        if (artist) {
            const regex = new RegExp(artist, 'i')
            const songsByArtist = await db.collection('songs').find({ Artist: regex });
            const allSongsByArtist = await songsByArtist.toArray();

            if (allSongsByArtist.length) {
                return res.json(allSongsByArtist);
            }

            else {
                return res.status(404).json({ message: `No songs from the artist ${artist}`})
            }
        }

        if (writer) {
            const regex = new RegExp(writer, 'i')
            const songsByWriter = await db.collection('songs').find({ Writer: regex });
            const allSongsByWriter = await songsByWriter.toArray();

            if (allSongsByWriter.length) {
                return res.json(allSongsByWriter);
            }

            else {
                return res.status(404).json({ message: `No songs from the writer ${writer}` });
            }
        }

        if (album) {
            const songsByAlbum = await db.collection('songs').find({ Album: album });
            const allSongsByAlbum = await songsByAlbum.toArray();
            
            if (allSongsByAlbum.length) {
                return res.json(allSongsByAlbum);
            }

            else {
                return res.status(404).json({ message: `No songs from the album ${album}` });
            }
        }

        if (year) {
            const songsByYear = await db.collection('songs').find({ Year: parseInt(year) })
            const allSongsByYear = await songsByYear.toArray();
            
            if (allSongsByYear.length) {
                return res.json(allSongsByYear);
            }

            else {
                return res.status(404).json({ message: `No songs from the year ${year}` });
            }
        }

        const songs = await db.collection('songs').find({}, { sort: { Song: 1 }})
        const allSongs = await songs.toArray();
        res.json(allSongs);
    },
};