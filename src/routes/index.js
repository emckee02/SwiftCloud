import { getSongsRoute } from './getSongsRoute.js';
import { getSongRoute } from './getSongRoute.js';
import { postSongRoute } from './postSongRoute.js';
import { deleteSongRoute } from './deleteSongRoute.js';
import { putSongRoute } from './putSongRoute.js';
import { putSongPlaysRoute } from './putSongPlaysRoute.js';

export const routes = [
    getSongRoute,
    getSongsRoute,
    postSongRoute,
    putSongRoute,
    putSongPlaysRoute,
    deleteSongRoute
];
