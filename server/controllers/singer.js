const asyncHandler = require("express-async-handler");
const {
  getListSinger,
  createNewSinger,
  updateSingerData,
  deleteSingerData,
  changeSingerEffect,
  getPopularSingerData,
  getSingerById,
  getTotalSinger,
} = require("../models/singer");

module.exports = {
  getAllSinger: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, country, searchText } = req?.query;
      const listSinger = await getListSinger(
        limit,
        offset,
        country,
        searchText
      );
      const totalSinger = await getTotalSinger(country, searchText);
      return res.send({
        success: true,
        payload: { singer: listSinger, totalItem: totalSinger },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách ca sĩ thất bại",
      });
    }
  }),

  getSingerDetail: asyncHandler(async (req, res) => {
    try {
      const { singerId } = req?.params;
      const result = await getSingerById(singerId);
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin ca sĩ thất bại",
      });
    }
  }),

  createSinger: asyncHandler(async (req, res) => {
    try {
      const { name, description, avatar, countryId } = req?.body;
      const result = await createNewSinger(
        name,
        description,
        avatar,
        countryId
      );
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo ca sĩ thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo ca sĩ thất bại",
      });
    }
  }),

  updateSinger: asyncHandler(async (req, res) => {
    try {
      const { name, description, avatar, countryId } = req?.body;
      const { singerId } = req?.params;
      const result = await updateSingerData(
        singerId,
        name,
        description,
        avatar,
        countryId
      );
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Cập nhật ca sĩ thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật ca sĩ thất bại",
      });
    }
  }),

  deleteSinger: asyncHandler(async (req, res) => {
    try {
      const { singerId } = req?.params;
      const result = await deleteSingerData(singerId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá ca sĩ thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá ca sĩ thất bại",
      });
    }
  }),

  changeSingerEffect: asyncHandler(async (req, res) => {
    try {
      const { effect } = req?.body;
      const { singerId } = req?.params;
      const result = await changeSingerEffect(singerId, effect);
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Chuyển đổi trạng thái thất bại",
      });
    }
  }),

  getPopularSinger: asyncHandler(async (req, res) => {
    try {
      const result = await getPopularSingerData();
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Chuyển đổi trạng thái thất bại",
      });
    }
  }),
};
