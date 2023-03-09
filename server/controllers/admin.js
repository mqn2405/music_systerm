const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {
  getAdminByEmail,
  createNewAccount,
  getAllAdminAccount,
  deleteAdminAccount,
  changeAdminStatus,
} = require("../models/admin");
const { getSongDownloadData, getSongFavouriteData, getTotalSongByDate } = require("../models/song");
const { getTotalUserByDate } = require("../models/user");

module.exports = {
  LOGIN: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const getAdmin = await getAdminByEmail(email);

    if (!getAdmin?._id) {
      return res.send({ success: false, error: "Email không tồn tại" });
    }

    const isMatchAdmin = bcrypt.compareSync(password, getAdmin?.password || "");

    if (!isMatchAdmin) {
      return res.send({ success: false, error: "Sai mật khẩu" });
    }

    if (!getAdmin?.status) {
      return res.send({ success: false, error: "Tài khoản đã bị vô hiệu hoá" });
    }
    return res.send({
      success: true,
      payload: { ...getAdmin, role: 2 },
    });
  }),

  createNewAccount: asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    const getAdmin = await getAdminByEmail(email);

    if (getAdmin?._id) {
      return res.send({ success: false, error: "Email đã tồn tại" });
    }

    const signupResult = await createNewAccount(email, name, password);

    if (!signupResult) {
      return res.send({ success: false, error: "Tạo tài khoản thất bại" });
    }
    return res.send({ success: true });
  }),

  getAllAccount: asyncHandler(async (req, res) => {
    try {
      const listAccount = await getAllAdminAccount();
      return res.send({ success: true, payload: listAccount });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách tài khoản thất bại",
      });
    }
  }),

  deleteAccount: asyncHandler(async (req, res) => {
    try {
      const { adminId } = req?.params;
      const listAccount = await deleteAdminAccount(adminId);
      if (listAccount) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Xoá tài khoản thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xoá tài khoản thất bại",
      });
    }
  }),

  changeStatus: asyncHandler(async (req, res) => {
    try {
      const { adminId } = req?.params;
      const { status } = req?.body;
      const result = await changeAdminStatus(adminId, status);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thay đổi trạng thái thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thay đổi trạng thái thất bại",
      });
    }
  }),

  getAdminStatistical: asyncHandler(async (req, res) => {
    try {
      const { fromDate, toDate } = req?.query;
      const songDownload = await getSongDownloadData(fromDate, toDate);
      const songFavourite = await getSongFavouriteData(fromDate, toDate);
      const totalUser = await getTotalUserByDate(fromDate, toDate);
      const totalSong = await getTotalSongByDate(fromDate, toDate);
      return res.send({ success: true, payload: { songDownload, songFavourite, totalUser, totalSong } });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin thống kê thất bại",
      });
    }
  }),
};
