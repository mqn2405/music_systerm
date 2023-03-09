const asyncHandler = require("express-async-handler");
const {
  getAllUserAccount,
  changeUserStatus,
  changeUserRank,
  getUserByEmail,
  getUserById,
  updateUserInfo,
  getTotalAccount,
  changeUserPassword,
  getUserSecretKey,
  saveUserSecretKey,
  changeUserPasswordByEmail,
} = require("../models/user");
const axios = require("axios");
const Speakeasy = require("speakeasy");
const sendMail = require("../middlewares/sendMail");
const { parseJSON } = require("../utils/utils");

module.exports = {
  getAllAccount: asyncHandler(async (req, res) => {
    try {
      const { limit, offset, except_id, keySearch } = req?.query;
      const listAccount = await getAllUserAccount(
        limit,
        offset,
        except_id,
        keySearch
      );
      const totalAccount = await getTotalAccount(except_id, keySearch);
      return res.send({
        success: true,
        payload: { user: listAccount, totalItem: totalAccount },
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy danh sách tài khoản thất bại",
      });
    }
  }),

  changeStatus: asyncHandler(async (req, res) => {
    try {
      const { userId } = req?.params;
      const { status } = req?.body;
      const result = await changeUserStatus(userId, status);
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

  changeRank: asyncHandler(async (req, res) => {
    try {
      const { userId } = req?.params;
      const { rank } = req?.body;
      const result = await changeUserRank(userId, rank);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thay đổi hạng thành viên thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thay đổi hạng thành viên thất bại",
      });
    }
  }),

  getUserById: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const result = await getUserById(id);
      return res.send({ success: true, payload: result });
    } catch (error) {
      return res.send({
        success: false,
        error: "Lấy thông tin người dùng thất bại",
      });
    }
  }),

  updateUserInfo: asyncHandler(async (req, res) => {
    try {
      const { id } = req?.params;
      const { name, email, birthday } = req?.body;
      const getUser = await getUserByEmail(email);

      if (getUser?._id && Number(getUser?._id) !== Number(id)) {
        return res.send({ success: false, error: "Email đã tồn tại" });
      }

      const result = await updateUserInfo(id, name, email, birthday);
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Cập nhật thông tin khách hàng thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Cập nhật thông tin khách hàng thất bại",
      });
    }
  }),

  getBase64: asyncHandler(async (req, res) => {
    try {
      const { url } = req?.body;
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      const result =
        "data:" + response.headers["content-type"] + ";base64," + base64;
      if (result) {
        return res.send({ success: true, payload: result });
      }
    } catch (error) {
      return res.send({
        success: false,
        error: "Convert thất bại",
      });
    }
  }),

  changeUserPassword: asyncHandler(async (req, res) => {
    try {
      const { userId } = req?.params;
      const { password } = req?.body;
      const result = await changeUserPassword(userId, password);

      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thay đổi mật khẩu thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thay đổi mật khẩu thất bại",
      });
    }
  }),

  checkEmailExist: asyncHandler(async (req, res) => {
    try {
      const { email } = req?.body;
      const user = await getUserByEmail(email);
      if (user?._id) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Người dùng không tồn tại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Kiểm tra tài khoản email thất bại",
      });
    }
  }),

  sendOtp: asyncHandler(async (req, res) => {
    try {
      const { email } = req?.body;

      const secretKey = Speakeasy.generateSecret({ length: 20 });
      const userSecretKey = await getUserSecretKey(email);
      let validSecrekKey = "";

      if (userSecretKey?.length) {
        validSecrekKey = userSecretKey;
      } else {
        validSecrekKey = JSON.stringify(secretKey);
        await saveUserSecretKey(email, JSON.stringify(secretKey));
      }

      const OTP = Speakeasy.totp({
        secret: validSecrekKey,
        encoding: "base32",
        step: 60,
        window: 1,
      });

      const sendMailResult = await sendMail.SEND_MAIL(email, OTP);

      if (sendMailResult) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Gửi OTP thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Gửi OTP thất bại",
      });
    }
  }),

  confirmOtp: asyncHandler(async (req, res) => {
    try {
      const { email, otp } = req?.body;

      const userSecretKey = await getUserSecretKey(email);
      const checkVerify = Speakeasy.totp.verifyDelta({
        secret: userSecretKey,
        encoding: "base32",
        token: otp,
        step: 60,
        window: 1,
      });

      if (checkVerify) {
        return res.send({ success: true });
      }

      return res.send({
        success: false,
        error: "Xác thực OTP thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Xác thực OTP thất bại",
      });
    }
  }),

  changeForgotPassword: asyncHandler(async (req, res) => {
    try {
      const { password, email } = req?.body;
      const result = await changeUserPasswordByEmail(email, password);
      
      if (result) {
        return res.send({ success: true });
      }
      return res.send({
        success: false,
        error: "Thay đổi mật khẩu thất bại",
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Thay đổi mật khẩu thất bại",
      });
    }
  }),
};
