const asyncHandler = require("express-async-handler");
const {
  getUserReport,
  getTotalUserReport,
  createUserReport,
  deleteUserReport,
} = require("../models/userReport");

module.exports = {
  getAllUserReport: asyncHandler(async (req, res) => {
    try {
      const { limit, offset } = req?.query;
      const listUserReport = await getUserReport(limit, offset);
      const totalItem = await getTotalUserReport();

      return res.send({
        success: true,
        payload: { userReport: listUserReport, totalItem },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách báo cáo tài khoản thất bại",
      });
    }
  }),

  createUserReportData: asyncHandler(async (req, res) => {
    try {
      const { user_id, reported, reason } = req?.body;
      const result = await createUserReport(user_id, reported, reason);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo báo cáo tài khoản thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo báo cáo tài khoản thất bại",
      });
    }
  }),

  deleteUserReport: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const result = await deleteUserReport(id);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá báo cáo tài khoản thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá báo cáo tài khoản thất bại",
      });
    }
  }),
};
