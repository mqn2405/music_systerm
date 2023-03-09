import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SwipeableTemporaryDrawer from "./components/ViewUserDrawer";
import { dateTimeConverter } from "../../../utils/utils";
import { getAllUserAccount } from "../../../services/user";
import ChangeStatusModal from "./components/ChangeStatusModal";
import ChangeRankModal from "./components/ChangeRankModel";
import { COPPER_RANK, RANK_ENUM } from "../../../utils/constants";

const columns = [
  { id: "stt", label: "#", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 170,
    align: "center",
  },
  {
    id: "rank",
    label: "Hạng",
    minWidth: 170,
    align: "center",
  },
  {
    id: "created_day",
    label: "Ngày tạo",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
    align: "center",
  },
];

const displayRank = (rank) => {
  if (!rank) {
    return 'Thường';
  }
  return RANK_ENUM[rank];
};

export default function UserAccount() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableData, setTableData] = useState([]);
  const [viewUserData, setViewUserData] = useState({});
  const [visibleUserDrawer, setVisibleUserDrawer] = useState(false);
  const [visibleStatusModal, setVisibleStatusModal] = useState(false);
  const [visibleRankModal, setVisibleRankModal] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllAccount = async () => {
    try {
      const listAccount = await getAllUserAccount();
      if (listAccount?.data?.success) {
        setTableData(listAccount?.data?.payload?.user);
      }
    } catch (error) {
      console.log("get user account error >>> ", error);
    }
  };

  useEffect(() => {
    getAllAccount();
  }, []);

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí tài khoản khách hàng
        </Typography>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <TableCell
                    key={column?.id}
                    align={column?.align}
                    style={{ minWidth: column?.minWidth }}
                  >
                    {column?.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  flexWrap: "nowrap",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setViewUserData(row);
                                    setVisibleUserDrawer(true);
                                  }}
                                  size="small"
                                >
                                  {value}
                                  <RemoveRedEyeIcon />
                                </Button>
                              </div>
                            ) : column.id === "stt" ? (
                              index + 1
                            ) : column.id === "created_day" ? (
                              dateTimeConverter(value)
                            ) : column.id === "status" ? (
                              <div
                                onClick={() => {
                                  setVisibleStatusModal(true);
                                  setViewUserData(row);
                                }}
                              >
                                <Chip
                                  sx={{ cursor: "pointer" }}
                                  label={value ? "Active" : "Inactive"}
                                  color={value ? "success" : "error"}
                                />
                              </div>
                            ) : column.id === "name" ? (
                              !value ? (
                                "Chưa thiết lập"
                              ) : (
                                value
                              )
                            ) : column.id === "rank" ? (
                              <div
                                onClick={() => {
                                  setVisibleRankModal(true);
                                  setViewUserData(row);
                                }}
                              >
                                <Chip
                                  sx={{ cursor: "pointer" }}
                                  label={displayRank(value)}
                                  color="primary"
                                  variant="outlined"
                                />
                              </div>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {visibleUserDrawer && (
        <SwipeableTemporaryDrawer
          visible={visibleUserDrawer}
          initData={viewUserData}
          onClose={() => setVisibleUserDrawer(false)}
        />
      )}

      {visibleStatusModal && (
        <ChangeStatusModal
          onClose={() => {
            setVisibleStatusModal(false);
            setViewUserData({});
          }}
          visible={visibleStatusModal}
          user={viewUserData}
          handleChangeStatus={(id, status) => {
            const user = [...tableData];
            const userChangeId = user?.findIndex((item) => item?._id === id);
            if (userChangeId >= 0) {
              user[userChangeId].status = status;
              setTableData(user);
            }
          }}
        />
      )}

      {visibleRankModal && (
        <ChangeRankModal
          onClose={() => {
            setVisibleRankModal(false);
            setViewUserData({});
          }}
          visible={visibleRankModal}
          user={viewUserData}
          handleChangeRank={(id, rank) => {
            const user = [...tableData];
            const userChangeId = user?.findIndex((item) => item?._id === id);
            if (userChangeId >= 0) {
              user[userChangeId].rank = rank;
              setTableData(user);
            }
          }}
        />
      )}
    </>
  );
}
