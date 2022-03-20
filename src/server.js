require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./services/albums/AlbumsService');
const SongsServices = require('./services/songs/SongsService');
const AlbumsValidator = require('./validators/albums');
const SongsValidator = require('./validators/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
