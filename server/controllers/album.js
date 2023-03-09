const asyncHandler = require("express-async-handler");
const {
  getListAlbum,
  createNewAlbum,
  updateAlbumData,
  deleteAlbumData,
  getTotalAlbum,
  getAlbumDetail,
  createAlbumSinger,
  deleteAlbumSinger,
  getAlbumSinger,
} = require("../models/album");

module.exports = {
  getAllAlbum: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, keyFilter, country, singer, searchText } =
        req?.query;
      const listAlbum = await getListAlbum(
        limit,
        offset,
        keyFilter,
        country,
        searchText,
        singer
      );
      for (let i = 0; i < listAlbum?.length; i++) {
        const singer = await getAlbumSinger(listAlbum?.[i]?._id);
        listAlbum[i].singer = singer;
        listAlbum[i].singer_name = singer?.map((item) => item?.name)?.join(", ");
      }
      const totalAlbum = await getTotalAlbum(keyFilter, country, searchText, singer);
      return res.send({
        success: true,
        payload: { album: listAlbum, totalItem: totalAlbum },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách album thất bại",
      });
    }
  }),

  getAlbumById: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const albumDetail = await getAlbumDetail(id);
      const singer = await getAlbumSinger(id);
      albumDetail.singer = singer;
      albumDetail.singer_name = singer?.map((item) => item?.name)?.join(", ");

      return res.send({
        success: true,
        payload: albumDetail,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin chi tiết album thất bại",
      });
    }
  }),

  createAlbum: asyncHandler(async (req, res) => {
    try {
      const { name, description, avatar, countryId, singer } = req?.body;
      const result = await createNewAlbum(name, description, avatar, countryId);

      if (result?._id) {
        for (let i = 0; i < singer?.length; i++) {
          await createAlbumSinger(result?._id, singer?.[i]?._id);
        }

        return res.send({
          success: true,
        });
      }
      return res.send({
        success: false,
        error: "Tạo album thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo album thất bại",
      });
    }
  }),

  updateAlbum: asyncHandler(async (req, res) => {
    try {
      const { name, description, avatar, singer, countryId } = req?.body;
      const { albumId } = req?.params;
      const result = await updateAlbumData(
        albumId,
        name,
        description,
        avatar,
        countryId
      );

      if (result) {
        await deleteAlbumSinger(albumId);
        for (let i = 0; i < singer?.length; i++) {
          await createAlbumSinger(albumId, singer?.[i]?._id);
        }

        return res.send({
          success: true,
        });
      }

      return res.send({
        success: false,
        error: "Cập nhật album thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật album thất bại",
      });
    }
  }),

  deleteAlbum: asyncHandler(async (req, res) => {
    try {
      const { albumId } = req?.params;
      const result = await deleteAlbumData(albumId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá album thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá album thất bại",
      });
    }
  }),
};
