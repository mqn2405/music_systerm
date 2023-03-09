const asyncHandler = require("express-async-handler");
const {
  createSongSinger,
  createNewSong,
  getListSong,
  getSongSinger,
  deleteSongSinger,
  deleteSong,
  updateSongData,
  getTotalSong,
  getSongById,
  getSongView,
  updateSongView,
  getHotSongData,
  createSongDownloadData,
  getUserSongFavourite,
  changeUserFavouriteSong,
  createUserListenSong,
  getUserListenData,
  getSongMostListen,
  getSongMostFavourite,
} = require("../models/song");

module.exports = {
  getAllSong: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, album, category, country, singer, searchText } =
        req?.query;
      const result = await getListSong(
        limit,
        offset,
        category,
        album,
        country,
        singer,
        searchText
      );
      const totalSong = await getTotalSong(
        category,
        album,
        country,
        singer,
        searchText
      );

      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }

        return res.send({
          success: true,
          payload: { song: result, totalItem: totalSong },
        });
      }

      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    }
  }),

  createSong: asyncHandler(async (req, res) => {
    try {
      const bodyData = req?.body;
      const { singer } = bodyData;
      const songResult = await createNewSong(bodyData);

      if (songResult?._id) {
        for (let i = 0; i < singer?.length; i++) {
          await createSongSinger(songResult?._id, singer?.[i]?._id);
        }

        return res.send({
          success: true,
        });
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

  updateSong: asyncHandler(async (req, res) => {
    try {
      const { songId } = req?.params;
      const bodyData = req?.body;
      const { singer } = bodyData;

      const songResult = await updateSongData(songId, bodyData);
      if (songResult) {
        await deleteSongSinger(songId);
        for (let i = 0; i < singer?.length; i++) {
          await createSongSinger(songId, singer?.[i]?._id);
        }

        return res.send({
          success: true,
        });
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

  deleteSong: asyncHandler(async (req, res) => {
    try {
      const { songId } = req?.params;
      const songResult = await deleteSong(songId);
      if (songResult) {
        return res.send({
          success: true,
        });
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

  getSongDetail: asyncHandler(async (req, res) => {
    try {
      const { songId } = req?.params;
      const result = await getSongById(songId);
      const singer = await getSongSinger(songId);
      result.singer = [...singer];

      return res.send({
        success: true,
        payload: result,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin bài hát thất bại",
      });
    }
  }),

  updateSongView: asyncHandler(async (req, res) => {
    try {
      const { songId } = req?.params;
      const view = await getSongView(songId);
      const result = await updateSongView(songId, view + 1);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Cập nhật lượt view bài hát thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật lượt view bài hát thất bại",
      });
    }
  }),

  getHotSong: asyncHandler(async (req, res) => {
    try {
      const result = await getHotSongData();
      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }

        return res.send({
          success: true,
          payload: result,
        });
      }

      return res.send({
        success: false,
        error: "Lấy danh sách bài hát thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách bài hát hot thất bại",
      });
    }
  }),

  addSongDownloadData: asyncHandler(async (req, res) => {
    try {
      const { songId } = req?.params;
      const { userId } = req?.body;
      const result = await createSongDownloadData(songId, userId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thêm dữ liệu thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thêm dữ liệu thất bại",
      });
    }
  }),

  getUserSongFavourite: asyncHandler(async (req, res) => {
    try {
      const { userId, songId } = req.query;
      const favouriteRes = await getUserSongFavourite(userId, songId);
      res.send({ success: true, payload: favouriteRes });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy dữ liệu thất bại",
      });
    }
  }),

  changeUserFavouriteSong: asyncHandler(async (req, res) => {
    try {
      const { userId, songId } = req.query;
      const { status } = req.body;
      const changeRes = await changeUserFavouriteSong(userId, songId, status);
      res.send({ success: changeRes });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật dữ liệu thất bại",
      });
    }
  }),

  createUserListenTime: asyncHandler(async (req, res) => {
    try {
      const { songId } = req.params;
      const { userId } = req?.body;
      const result = await createUserListenSong(userId, songId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo dữ liệu thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo dữ liệu thất bại",
      });
    }
  }),

  getUserListenData: asyncHandler(async (req, res) => {
    try {
      const { userId } = req.query;
      const songs = await getUserListenData(userId);
      let result = songs.rows;
      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }
      }
      return res.send({ success: true, payload: result});
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy dữ liệu thất bại",
      });
    }
  }),

  getMostListenList: asyncHandler(async (req, res) => {
    try {
      const result = await getSongMostListen();
      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }
      }
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy dữ liệu thất bại",
      });
    }
  }),

  getMostFavourite: asyncHandler(async (req, res) => {
    try {
      const result = await getSongMostFavourite();
      if (result) {
        for (let i = 0; i < result?.length; i++) {
          const singer = await getSongSinger(result?.[i]?._id);
          result[i].singer = [...singer];
        }
      }
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy dữ liệu thất bại",
      });
    }
  }),
};
