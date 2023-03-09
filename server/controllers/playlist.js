const asyncHandler = require("express-async-handler");
const {
  getPlaylist,
  getTotalPlaylist,
  createPlaylist,
  deletePlaylist,
  deletePlayListDetail,
  createPlayListDetail,
  getPlayListDetail,
  getSongPlayList,
  deleteSongPlayListDetail,
  updatePlaylistName,
  checkPlaylistName,
} = require("../models/playlist");

module.exports = {
  getAllPlaylist: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, user_id } = req?.query;
      const listPlaylist = await getPlaylist(limit, offset, user_id);
      const totalItem = await getTotalPlaylist(user_id);

      return res.send({
        success: true,
        payload: { playlist: listPlaylist, totalItem },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách playlist thất bại",
      });
    }
  }),

  createNewPlaylist: asyncHandler(async (req, res) => {
    try {
      const { user_id, name } = req?.body;
      const checkName = await checkPlaylistName(name, user_id);
      if (!checkName) {
        const result = await createPlaylist(user_id, name);
        if (result) {
          return res.send({ success: true });
        }
        return res.send({
          success: false,
          error: "Tạo playlist thất bại",
        });
      }
      return res.send({
        success: false,
        error: "Tên playlist đã tồn tại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo playlist thất bại",
      });
    }
  }),

  deletePlaylist: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const result = await deletePlayListDetail(id);
      if (result) {
        await deletePlaylist(id);
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá playlist thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá playlist thất bại",
      });
    }
  }),

  createPlaylistSong: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const { song_id } = req?.body;
      const result = await createPlayListDetail(id, song_id);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thêm nhạc vào playlist thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thêm nhạc vào playlist thất bại",
      });
    }
  }),

  getPlaylistSong: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const result = await getPlayListDetail(id);

      return res.send({
        success: true,
        payload: result,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách nhạc trong playlist thất bại",
      });
    }
  }),

  checkPlaylistSong: asyncHandler(async (req, res) => {
    try {
      const { playlistId, songId } = req?.params;

      const result = await getSongPlayList(playlistId, songId);

      if (result?.playlist_id) {
        return res.send({
          success: true,
          payload: true,
        });
      }
      return res.send({
        success: true,
        payload: false,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Kiểm tra thất bại thất bại",
      });
    }
  }),

  deletePlaylistSong: asyncHandler(async (req, res) => {
    try {
      const { playlistId, songId } = req?.params;
      const result = deleteSongPlayListDetail(playlistId, songId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá bài nhạc trong playlist thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá bài nhạc trong playlist thất bại",
      });
    }
  }),

  updatePlaylistName: asyncHandler(async (req, res) => {
    try {
      const { playlistId } = req?.params;
      const { name, userId } = req?.body;
      const checkName = await checkPlaylistName(name, userId);
      if (!checkName) {
        const result = await updatePlaylistName(playlistId, name);
        if (result) {
          return res.send({ success: true });
        }
        return res.send({
          success: false,
          error: "Cập nhật playlist thất bại",
        });
      }
      return res.send({
        success: false,
        error: "Tên playlist đã tồn tại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật playlist thất bại",
      });
    }
  }),
};
