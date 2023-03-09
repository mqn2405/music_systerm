const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { userSignUp } = require("../models/auth");
const { getUserByEmail } = require("../models/user");

module.exports = {
  SIGNUP: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const getUser = await getUserByEmail(email);

    if (getUser?._id) {
      return res.send({ success: false, error: "Email đã tồn tại" });
    }

    const signupResult = await userSignUp(email, password);

    if (!signupResult) {
      return res.send({ success: false, error: "Đăng kí tài khoản thất bại" });
    }
    return res.send({ success: true });
  }),

  LOGIN: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const getUser = await getUserByEmail(email);

    if (!getUser?._id) {
      return res.send({ success: false, error: "Email không tồn tại" });
    }

    const isMatchUser = bcrypt.compareSync(password, getUser?.password || "");

    if (!isMatchUser) {
      return res.send({ success: false, error: "Sai mật khẩu" });
    }

    if (!getUser?.status) {
      return res.send({ success: false, error: "Tài khoản đã bị vô hiệu hoá" });
    }
    return res.send({
      success: true,
      payload: { ...getUser, role: 1 },
    });
  }),
};
