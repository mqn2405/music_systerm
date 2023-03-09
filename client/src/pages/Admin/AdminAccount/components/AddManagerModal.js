import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import {IconButton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import RTextField from "../../../../components/RedditTextField";
import { toast } from "react-hot-toast";
import { validateEmail } from "../../../../utils/utils";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function AddManagerModal(props) {
  const { visible, onClose, handleSubmit } = props;
  const [editUserData, setEditUserData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={visible}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Thêm mới nhân viên quản lí
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <RTextField
            label="Email"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, email: event.target.value })
            }
          />

          <RTextField
            label="Name"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, fullName: event.target.value })
            }
          />

          <RTextField
            label="Password"
            id="post-title"
            variant="filled"
            type="password"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({ ...editUserData, password: event.target.value })
            }
          />

          <RTextField
            label="Confirm password"
            id="post-title"
            variant="filled"
            type="password"
            style={{ marginTop: 11, textAlign: "left" }}
            onChange={(event) =>
              setEditUserData({
                ...editUserData,
                confirmPassword: event.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={modalLoading}
            autoFocus
            onClick={async () => {
              const { email, fullName, password, confirmPassword } =
                editUserData;
              if (
                email.length <= 0 ||
                fullName.length <= 0 ||
                password.length <= 0
              ) {
                return toast.error("Dữ liệu không được bỏ trống");
              } else if (!validateEmail(email)) {
                return toast.error("Wrong email format");
              } else if (fullName.trim().length <= 5) {
                return toast.error("Name needs more than 5 characters");
              } else if (password.trim().length <= 6) {
                return toast.error("Password needs more than 6 characters");
              } else if (password !== confirmPassword) {
                return toast.error(
                  "Confirm password does not match the password"
                );
              } else {
                setModalLoading(true);
                const submitRes = await handleSubmit(editUserData);
                if (!submitRes.success) {
                  setModalLoading(false);
                }
              }
            }}
          >
            Thêm mới
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
