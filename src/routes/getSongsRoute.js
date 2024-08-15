import { db } from '../db.js';

export const getSongsRoute = {
    path: '/api/v1.0/songs',
    method: 'get',
    handler: async (req, res) => {
        const { artist, writer, album, year, startYear, endYear, pn, ps, sort } = req.query;

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
            const songsByYear = await db.collection('songs').find({ Year: parseInt(year) });
            const allSongsByYear = await songsByYear.toArray();
            
            if (allSongsByYear.length) {
                return res.json(allSongsByYear);
            }

            else {
                return res.status(404).json({ message: `No songs from the year ${year}` });
            }
        }

        let pageNum = 1;
        let pageSize = 10;

        if (pn && Number.isInteger(parseInt(pn))) {
            pageNum = parseInt(pn);
        }

        if (ps && Number.isInteger(parseInt(ps))) {
            pageSize = parseInt(ps);
        }

        const pageStart = (pageSize * (pageNum - 1));
        const pagination = [
            { $skip: pageStart },
            { $limit: pageSize}
        ];

        if (startYear && endYear) {
            const query = { $match: { Year: {$lte: parseInt(endYear), $gte: parseInt(startYear) }}}
            const filterByYearPipeline = [query, ...pagination]
            const songsByYearRange = await db.collection('songs').aggregate(filterByYearPipeline);
            const filteredSongs = await songsByYearRange.toArray();

            if (filteredSongs.length) {
                return res.json(filteredSongs);
            }

            else {
                return res.status(404).json({ message: `No songs between ${startYear} and ${endYear}` });
            }
        }

        if (sort) {
            if (sort === 'June' || sort === 'July' || sort === 'August') {
                const filterMonthPipeline = [
                    { $project: { 
                        Song: 1, 
                        Artist: 1, 
                        [`Plays - ${sort}`]: 1 
                    }}, {
                        $sort: { [`Plays - ${sort}`]: -1}
                    }, ...pagination
                ];
                
                const allSongsByMonth = await db.collection('songs').aggregate(filterMonthPipeline);
                const songsPopularByMonth = await allSongsByMonth.toArray(); 
                return res.json(songsPopularByMonth);
            } 
            else if (sort === 'All') {
                const filterAllPipeline = [
                    { $project: { 
                        Song: 1, 
                        Artist: 1,
                        Total_Plays: { $add: ["$Plays - June", "$Plays - July", "$Plays - August" ] }
                    }}, {
                        $sort: { Total_Plays: -1 }
                    }, ...pagination
                ];

                const popularSongs = await db.collection('songs').aggregate(filterAllPipeline);
                const songsWithMostPlays = await popularSongs.toArray();
                return res.json(songsWithMostPlays);
            }
            else {
                return res.status(404).json({ message: 'Sort parameter invalid' });
            }
        }

        const sortSongAsc = { $sort: { Song: 1 }};
        const defaultAgg = [sortSongAsc, ...pagination];
        const allSongsByTitle = await db.collection('songs').aggregate(defaultAgg);
        const songsSortedByTitle = await allSongsByTitle.toArray();
        res.json(songsSortedByTitle);
    },
};