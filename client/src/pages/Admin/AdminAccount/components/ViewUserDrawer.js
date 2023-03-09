import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import { Box, Drawer, Stack, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { dateTimeConverter } from "../../../../utils/utils";
import StarIcon from "@mui/icons-material/Star";

const inputStyle = {
  width: "90%",
  height: "50px",
  border: "1px solid #1876D1",
  padding: "10px",
  borderRadius: "5px",
  marginLeft: "20px",
};

export default function SwipeableTemporaryDrawer(props) {
  const { visible, initData, onClose } = props;

  return (
    <React.Fragment key="right">
      <Drawer anchor="right" open={visible} onClose={() => onClose()}>
        <Box sx={{ width: "50vw", minWidth: "300px", paddingTop: "80px" }}>
          <Stack justifyContent={"end"}>
            <Box>
              <Button onClick={() => onClose()}>
                <CloseIcon />
              </Button>
            </Box>
          </Stack>
          <Divider />
          <Box sx={{ padding: "20px" }}>
            <Box
              sx={{
                textAlign: "center",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              PERSONAL INFORMATION
            </Box>
            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <PersonIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>{initData?.name}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <EmailIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>{initData?.email}</Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <Box>
                <CalendarMonthIcon sx={{ color: "#1876D1" }} />
              </Box>
              <Box sx={inputStyle}>
                {dateTimeConverter(initData?.created_day)}
              </Box>
            </Stack>

            <Stack
              flexWrap="nowrap"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Tooltip title="status" placement="top">
                <Box>
                  <StarIcon sx={{ color: "#1876D1" }} />
                </Box>
              </Tooltip>
              <Box sx={inputStyle}>
                {initData?.status ? "Active" : "Inactive"}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
