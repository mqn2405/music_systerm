const asyncHandler = require("express-async-handler");
const {
  getListCountry,
  createNewCountry,
  updateCountryData,
  deleteCountryData,
  getCountryById,
} = require("../models/country");

module.exports = {
  getAllCountry: asyncHandler(async (req, res) => {
    try {
      const listCountry = await getListCountry();
      return res.send({ success: true, payload: listCountry });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách quốc gia thất bại",
      });
    }
  }),

  getCountryDetail: asyncHandler(async (req, res) => {
    try {
      const { countryId } = req?.params;
      const result = await getCountryById(countryId);
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy chi tiết thông tin quốc gia thất bại",
      });
    }
  }),

  createCountry: asyncHandler(async (req, res) => {
    try {
      const { name } = req?.body;
      const result = await createNewCountry(name);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo quốc gia thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo quốc gia thất bại",
      });
    }
  }),

  updateCountry: asyncHandler(async (req, res) => {
    try {
      const { name } = req?.body;
      const { countryId } = req?.params;
      const result = await updateCountryData(countryId, name);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Cập nhật quốc gia thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật quốc gia thất bại",
      });
    }
  }),

  deleteCountry: asyncHandler(async (req, res) => {
    try {
      const { countryId } = req?.params;
      const result = await deleteCountryData(countryId);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá quốc gia thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá quốc gia thất bại",
      });
    }
  }),
};
