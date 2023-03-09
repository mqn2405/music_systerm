import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomModal from "../../../../components/CustomModal";
import RTextField from "../../../../components/RedditTextField";
import {
  changeUserPassword,
  getUserById,
  updateUserInfo,
} from "../../../../services/user";
import { RANK_ENUM, USER_KEY } from "../../../../utils/constants";
import { formaDateInput, parseJSON } from "../../../../utils/utils";

export default function Personal() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    birdthday: "",
  });
  const [visiblePasswordModal, setVisiblePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const userData = parseJSON(localStorage.getItem(USER_KEY), {});

  const getUserInfo = async () => {
    try {
      const result = await getUserById(userData?._id);
      if (result?.data?.success) {
        setUserInfo({
          ...result?.data?.payload,
          birdthday: formaDateInput(result?.data?.payload?.birdthday),
        });
      }
    } catch (error) {
      console.log("get user info error >>> ", error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      getUserInfo();
    }
  }, []);

  const handleUpdateUserInfo = async () => {
    try {
      if (userData?._id) {
        const { email, name, birdthday } = userInfo;
        if (!email?.trim()) {
          return toast.error("Email không thể bỏ trống");
        }

        const result = await updateUserInfo(
          userData?._id,
          name,
          email,
          birdthday
        );
        if (result?.data?.success) {
          return toast.success("Cập nhật thông tin thành công");
        }
        return toast.error(result?.data?.error || "Cập nhật thất bại");
      }
      toast.error("Cập nhật thất bại");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Cập nhật thất bại");
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword?.trim()?.length < 6) {
        return toast.error("Mật khẩu cần ít nhất 6 kí tự");
      }

      if (newPassword !== confirmNewPassword) {
        return toast.error("Mật khẩu nhập lại không hợp lệ");
      }

      const result = await changeUserPassword(
        userData?._id,
        newPassword?.trim()
      );
      if (result?.data?.success) {
        setNewPassword("");
        setConfirmNewPassword("");
        setVisiblePasswordModal(false);
        return toast.success("Cập nhật mật khẩu thành công");
      }
      return toast.error(result?.data?.error ||"Cập nhật thất bại")
    } catch (error) {
      toast.error(error?.response?.data?.error || "Cập nhật thất bại");
    }
  };

  return (
    <div>
      {visiblePasswordModal && (
        <CustomModal
          visible={visiblePasswordModal}
          onClose={() => {
            setNewPassword("");
            setConfirmNewPassword("");
            setVisiblePasswordModal(false);
          }}
          title={"Đổi mật khẩu"}
          content={
            <div>
              <RTextField
                label="Mật khẩu mới"
                value={newPassword || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setNewPassword(event?.target?.value)}
                type="password"
              />

              <RTextField
                label="Nhập lại mật khẩu"
                value={confirmNewPassword || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setConfirmNewPassword(event?.target?.value)
                }
                type="password"
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleChangePassword();
              }}
            >
              {"Đổi mật khẩu"}
            </LoadingButton>
          }
        />
      )}

      <RTextField
        label="Hạng thành viên"
        defaultValue=""
        id="rank"
        variant="filled"
        style={{ marginTop: 11, width: "100%" }}
        value={RANK_ENUM[userInfo?.rank] || ""}
        sx={{
          ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
            marginTop: "12px",
          },
        }}
        disabled={true}
      />

      <RTextField
        label="Email"
        defaultValue=""
        id="email"
        variant="filled"
        style={{ marginTop: 11, width: "100%" }}
        value={userInfo?.email || ""}
        sx={{
          ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
            marginTop: "12px",
          },
        }}
        onChange={(event) => {
          setUserInfo({ ...userInfo, email: event.target.value });
        }}
      />

      <RTextField
        label="Tên"
        defaultValue=""
        id="name"
        variant="filled"
        style={{ marginTop: 11, width: "100%" }}
        value={userInfo?.name || ""}
        sx={{
          ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
            marginTop: "12px",
          },
        }}
        onChange={(event) => {
          setUserInfo({ ...userInfo, name: event.target.value });
        }}
      />

      <RTextField
        label="Ngày sinh"
        defaultValue=""
        id="birdthday"
        variant="filled"
        style={{ marginTop: 11, width: "100%" }}
        value={userInfo?.birdthday}
        sx={{
          ".css-10botns-MuiInputBase-input-MuiFilledInput-input": {
            marginTop: "12px",
          },
        }}
        type="date"
        onChange={(event) => {
          setUserInfo({
            ...userInfo,
            birdthday: event.target.value,
          });
        }}
      />

      <div
        style={{ cursor: "pointer", color: "#1976D2", marginTop: "20px" }}
        onClick={() => setVisiblePasswordModal(true)}
      >
        Quên mật khẩu
      </div>

      <Box
        sx={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          sx={{ color: "white !important" }}
          onClick={() => handleUpdateUserInfo()}
        >
          Cập nhật
        </Button>
      </Box>
    </div>
  );
}
