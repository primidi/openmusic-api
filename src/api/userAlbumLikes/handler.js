const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._albumsService.getAlbumById(albumId);

      const albumAlreadyLiked = await this._userAlbumLikesService.verifyLikedAlbum(
        credentialId,
        albumId,
      );

      let message = '';

      if (albumAlreadyLiked) {
        await this._userAlbumLikesService.unlikeAlbum(credentialId, albumId);
        message = 'Album unliked.';
      } else {
        await this._userAlbumLikesService.likeAlbum(credentialId, albumId);
        message = 'Album liked.';
      }

      const response = h.response({
        status: 'success',
        message,
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Oops, server is error!',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getUserAlbumLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;

      const { likes, source } = await this._userAlbumLikesService.getLikesCount(albumId);

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', source);
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Oops, server is error!',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UserAlbumLikesHandler;
