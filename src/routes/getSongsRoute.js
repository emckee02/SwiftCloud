import { db } from '../db.js';
import { isValidMonth } from '../util.js';

export const getSongsRoute = {
    path: '/api/v1.0/songs',
    method: 'get',
    handler: async (req, res) => {
        const { artist, writer, album, year, startYear, endYear, pn, ps, sort } = req.query;
        let pageNum = 1;
        let pageSize = 10;

        if (pn && Number.isInteger(parseInt(pn))) {
            pageNum = parseInt(pn);
        }

        if (ps && Number.isInteger(parseInt(ps))) {
            pageSize = parseInt(ps);
        }

        const pageStart = (pageSize * (pageNum - 1));
        const pagination = [{ $skip: pageStart }, { $limit: pageSize }];

        if (artist) {
            const artistRegex = new RegExp(artist, 'i');
            const songsByArtistCursor = await db.collection('songs').find({ Artist: artistRegex });
            const songsByArtist = await songsByArtistCursor.toArray();

            if (songsByArtist.length) {
                return res.json(songsByArtist);
            }
            else {
                return res.status(404).json({ message: `No songs from the artist ${artist}`})
            }
        }

        if (writer) {
            const writerRegex = new RegExp(writer, 'i');
            const songsByWriterCursor = await db.collection('songs').find({ Writer: writerRegex });
            const songsByWriter = await songsByWriterCursor.toArray();

            if (songsByWriter.length) {
                return res.json(songsByWriter);
            }
            else {
                return res.status(404).json({ message: `No songs from the writer ${writer}` });
            }
        }

        if (album) {
            const songsByAlbumCursor = await db.collection('songs').find({ Album: album });
            const songsByAlbum = await songsByAlbumCursor.toArray();
            
            if (songsByAlbum.length) {
                return res.json(songsByAlbum);
            }
            else {
                return res.status(404).json({ message: `No songs from the album ${album}` });
            }
        }

        if (year) {
            const songsByYearCursor = await db.collection('songs').find({ Year: parseInt(year) });
            const songsByYear = await songsByYearCursor.toArray();
            
            if (songsByYear.length) {
                return res.json(songsByYear);
            }
            else {
                return res.status(404).json({ message: `No songs from the year ${year}` });
            }
        }

        if (startYear && endYear) {
            const yearRangeQuery = { $match: { Year: {$lte: parseInt(endYear), $gte: parseInt(startYear) }}};
            const filterByYearPipeline = [yearRangeQuery, ...pagination];
            const songsByYearRangeCursor = await db.collection('songs').aggregate(filterByYearPipeline);
            const songsByYearRange = await songsByYearRangeCursor.toArray();

            if (songsByYearRange.length) {
                return res.json(songsByYearRange);
            }
            else {
                return res.status(404).json({ message: `No songs between ${startYear} and ${endYear}` });
            }
        }

        if (sort) {
            if (isValidMonth(sort)) {
                const sortMonthPipeline = [
                    { $project: { 
                            Song: 1, 
                            Artist: 1, 
                            [`Plays - ${sort}`]: 1 
                        }
                    }, {
                        $sort: { [`Plays - ${sort}`]: -1}
                    }, 
                    ...pagination
                ];

                const songsPopularByMonthCursor = await db.collection('songs').aggregate(sortMonthPipeline);
                const songsPopularByMonth = await songsPopularByMonthCursor.toArray(); 
                return res.json(songsPopularByMonth);
            } 
            else if (sort === 'All') {
                const sortAllMonthsPipeline = [
                    { $project: { 
                            Song: 1, 
                            Artist: 1,
                            TotalPlays: { $add: ["$Plays - June", "$Plays - July", "$Plays - August" ] }
                        }
                    }, { 
                        $sort: { TotalPlays: -1 }
                    }, 
                    ...pagination
                ];

                const mostPopularSongsCursor = await db.collection('songs').aggregate(sortAllMonthsPipeline);
                const mostPopularSongs = await mostPopularSongsCursor.toArray();
                return res.json(mostPopularSongs);
            }
            else {
                return res.status(404).json({ message: 'Sort parameter invalid' });
            }
        }

        const sortSongAsc = { $sort: { Song: 1 }};
        const defaultPipeline = [sortSongAsc, ...pagination];
        const allSongsCursor = await db.collection('songs').aggregate(defaultPipeline);
        const songsSortedByTitle = await allSongsCursor.toArray();
        res.json(songsSortedByTitle);
    },
};