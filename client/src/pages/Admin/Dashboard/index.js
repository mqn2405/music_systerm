import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import { getAdminStatistical } from "../../../services/admin";
const mdTheme = createTheme();

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function Dashboard() {
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalFavourite, setTotalFavourite] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalSong, setTotalSong] = useState(0);

  useEffect(() => {
    setFilterFromDate(formatDate(new Date()));
    setFilterToDate(formatDate(new Date()));
  }, []);

  const getStatisticalDataByDate = async (fromDate, toDate) => {
    try {
      const result = await getAdminStatistical(fromDate, toDate);
      if (result?.data?.success) {
        setTotalDownload(result?.data?.payload?.songDownload);
        setTotalFavourite(result?.data?.payload?.songFavourite);
        setTotalUser(result?.data?.payload?.totalUser);
        setTotalSong(result?.data?.payload?.totalSong);
      }
    } catch (error) {
      console.log("Lấy thông tin thống kê thất bại");
    }
  };

  useEffect(() => {
    getStatisticalDataByDate(filterFromDate, filterToDate);
  }, [filterFromDate, filterToDate]);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box style={{ paddingLeft: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack flexDirection={"row"} justifyContent={"flex-start"}>
              <Box sx={{ margin: "20px 0" }}>
                <Typography variant="h6" component="h2">
                  Từ ngày:
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type={"date"}
                  value={filterFromDate}
                  sx={{
                    width: "300px",
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                  }}
                  onChange={(event) => {
                    setFilterFromDate(event.target.value);
                  }}
                />
              </Box>
              <Box sx={{ margin: "20px 0 20px 30px" }}>
                <Typography variant="h6" component="h2">
                  Đến ngày:
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type={"date"}
                  sx={{
                    width: "300px",
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                  }}
                  value={filterToDate}
                  onChange={(event) => {
                    setFilterToDate(event.target.value);
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box style={{ paddingLeft: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "30px",
                flexWrap: "wrap",
                gap: "50px",
              }}
            >
              <div
                style={{
                  width: "47%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  height: "200px",
                  background: "#1C82AD",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  Số lượt tải
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  {totalDownload}
                </div>
              </div>
              <div
                style={{
                  width: "47%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  padding: "20px auto",
                  background: "#5B8FB9",
                  height: "200px",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  Số lượt yêu thích
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  {totalFavourite}
                </div>
              </div>
              <div
                style={{
                  width: "47%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  height: "200px",
                  background: "#5B8FB9",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  Số người dùng mới
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  {totalUser}
                </div>
              </div>

              <div
                style={{
                  width: "47%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  height: "200px",
                  background: "#1C82AD",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  Bài hát mới
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700 }}>
                  {totalSong}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
