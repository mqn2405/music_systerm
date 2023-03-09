import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

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

export default function CustomModal(props) {
  return (
    <BootstrapDialog
      onClose={(event, reason) => {
        if (reason && reason === "backdropClick" && "escapeKeyDown") return;
        props.onClose();
      }}
      aria-labelledby="customized-dialog-title"
      open={props.visible}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={props.onClose}
      >
        {props.title}
      </BootstrapDialogTitle>
      <DialogContent dividers>{props.content}</DialogContent>
      <DialogActions>{props.action}</DialogActions>
    </BootstrapDialog>
  );
}
