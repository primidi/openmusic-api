const mapAlbumDbToModel = ({
  id,
  name,
  year,
  cover,
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

const mapSongDbToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapPlaylistDbToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapNestedSongs = ({
  song_id,
  song_title,
  performer,
}) => ({
  id: song_id,
  title: song_title,
  performer,
});

module.exports = {
  mapAlbumDbToModel,
  mapSongDbToModel,
  mapPlaylistDbToModel,
  mapNestedSongs,
};
