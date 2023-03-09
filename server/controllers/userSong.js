const asyncHandler = require("express-async-handler");
const { getListUserSong, getTotalUserSong, createUserSong, updateUserSong, deleteUserSong } = require("../models/userSong");

module.exports = {
  getAllUserSong: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, userId } = req?.query;
      const result = await getListUserSong(
        limit,
        offset,
        userId
      );
      const totalSong = await getTotalUserSong(userId);
      
      return res.send({
        success: true,
        payload: { userSong: result, totalItem: totalSong },
      });

    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    }
  }),

  createUserSong: asyncHandler(async (req, res) => {
    try {
      const {userId} = req?.query
      const bodyData = req?.body;
      const songResult = await createUserSong(userId, bodyData);

      if (songResult) {
        return res.send({ success: true });
      }

      return res.send({
        success: false,
        error: "Tạo bài hát thất bại",
      });

    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo bài hát thất bại",
      });
    }
  }),

  updateUserSong: asyncHandler(async (req, res) => {
    try {
      const { userSongId } = req?.params;
      const bodyData = req?.body;

      const songResult = await updateUserSong(userSongId, bodyData);
      if (songResult) {
        return res.send({ success: true });
      }

      return res.send({
        success: false,
        error: "Cập nhật bài hát thất bại",
      });

    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật bài hát thất bại",
      });
    }
  }),

  deleteUserSong: asyncHandler(async (req, res) => {
    try {
      const { userSongId } = req?.params;
      const songResult = await deleteUserSong(userSongId);
      
      if (songResult) {
        return res.send({ success: true });
      }

      return res.send({
        success: false,
        error: "Xoá bài hát thất bại",
      });

    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá bài hát thất bại",
      });
    }
  }),
};
