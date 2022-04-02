require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
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

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    // Get the context of response from request object
    const { response } = request;

    if (response instanceof ClientError) {
      // Create a new response from response toolkit for error handling needs
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.statusCode(response.statusCode);
      return newResponse;
    }

    // And if there's no ClientError proceed to the actual response
    return response.continue || response;
  })

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
