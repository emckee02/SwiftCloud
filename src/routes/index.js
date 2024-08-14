import { getSongsRoute } from './getSongsRoute.js';
import { getSongRoute } from './getSongRoute.js';
import { postSongRoute } from './postSongRoute.js';
import { deleteSongRoute } from './deleteSongRoute.js';
import { putSongRoute } from './putSongRoute.js';

export const routes = [
    getSongRoute,
    getSongsRoute,
    postSongRoute,
    putSongRoute,
    deleteSongRoute
];
