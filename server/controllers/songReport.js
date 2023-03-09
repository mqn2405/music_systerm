const asyncHandler = require("express-async-handler");
const { getSongReport, getTotalSongReport, createSongReport, deleteSongReport } = require("../models/songReport");

module.exports = {
  getAllSongReport: asyncHandler(async (req, res) => {
    try {
      const { limit, offset } = req?.query;
      const listSongReport = await getSongReport(limit, offset);
      const totalItem = await getTotalSongReport();

      return res.send({
        success: true,
        payload: { songReport: listSongReport, totalItem },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách báo cáo bài nhạc thất bại",
      });
    }
  }),

  createSongReportData: asyncHandler(async (req, res) => {
    try {
      const { song_id, user_id, reason } = req?.body;
      const result = await createSongReport(user_id, song_id, reason);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Tạo báo cáo bài nhạc thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Tạo báo cáo bài nhạc thất bại",
      });
    }
  }),

  deleteSongReport: asyncHandler(async (req, res) => {
    try {
      const {id} = req?.params;
      const result = await deleteSongReport(id);
      if(result){
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá báo cáo bài nhạc thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá báo cáo bài nhạc thất bại",
      });
    }
  })
};
