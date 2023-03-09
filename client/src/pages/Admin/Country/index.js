import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import SettingsIcon from "@mui/icons-material/Settings";
import CustomPopover from "../../../components/CustomPopover";
import CustomModal from "../../../components/CustomModal";
import RTextField from "../../../components/RedditTextField";
import { toast } from "react-hot-toast";
import {
  createNewCountry,
  deleteCountryData,
  getAllCountry,
  updateCountry,
} from "../../../services/country";

const columns = [
  { id: "stt", label: "#", minWidth: 50, align: "center" },
  {
    id: "name",
    label: "Name",
    minWidth: 170,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminCountry() {
  const [listCountry, setListCountry] = useState([]);
  const [addCountryModal, setAddCountryModal] = useState({
    status: false,
    type: "",
  });
  const [editCountry, setEditCountry] = useState({
    countryName: "",
    countryId: -1,
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [popoverId, setPopoverId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListCountry = async () => {
    try {
      const res = await getAllCountry();
      if (res?.data?.success) {
        setListCountry(res?.data?.payload);
      }
    } catch (error) {
      console.log("get list country error >>> ", error);
    }
  };

  useEffect(() => {
    getListCountry();
  }, []);

  const handleCreateUpdateCountry = async () => {
    const { countryName } = editCountry;
    if (!countryName.trim().length) {
      return toast.error("Dữ liệu không được bỏ trống ");
    } else if (countryName.trim().length <= 1) {
      return toast.error("Name must be more than 1 characters");
    } else {
      if (addCountryModal.type === "add") {
        const createRes = await createNewCountry(countryName);
        if (createRes?.data?.success) {
          toast.success("Thêm mới quốc gia thành công");
          getListCountry();
          return setAddCountryModal({ status: false, type: "" });
        } else {
          return toast.error(
            createRes?.data?.error || "Thêm mới quốc gia thất bại"
          );
        }
      } else {
        const updateRes = await updateCountry(
          editCountry?.countryId,
          countryName
        );

        if (updateRes?.data?.success) {
          toast.success("Update country success");
          getListCountry();
          setAddCountryModal({ status: false, type: "" });
        } else {
          toast.error(updateRes?.data?.error || "Update country failed");
        }
      }
    }
  };

  const deleteCountry = async (countryId) => {
    try {
      const deleteRes = await deleteCountryData(countryId);
      if (deleteRes?.data?.success) {
        toast.success("Delete country success");
        getListCountry();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error || "Delete country failed");
      }
    } catch (error) {
      toast.error("Delete country failed");
    }
  };

  return (
    <>
      <div>
        <CustomModal
          visible={addCountryModal.status}
          onClose={() =>
            setAddCountryModal({ ...addCountryModal, status: false })
          }
          title={
            addCountryModal.type === "add"
              ? "Thêm mới quốc gia"
              : "Cập nhật quốc gia"
          }
          content={
            <>
              <RTextField
                label="Name"
                defaultValue={editCountry.countryName || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setEditCountry({
                    ...editCountry,
                    countryName: event.target.value,
                  })
                }
              />
            </>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreateUpdateCountry();
              }}
            >
              {addCountryModal.type === "add" ? "Thêm mới" : "Cập nhật"}
            </LoadingButton>
          }
        />
      </div>
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
          Quản lí thông tin quốc gia
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditCountry({ countryName: "", description: "" });
              setAddCountryModal({ status: true, type: "add" });
            }}
          >
            Thêm mới
          </Button>
        </div>
      </Stack>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listCountry
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                              <Stack
                                flexDirection={"row"}
                                justifyContent="center"
                              >
                                <CustomPopover
                                  open={popoverId === row?._id}
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() => deleteCountry(row?._id)}
                                  noti="Are you sure you want to delete the country?"
                                >
                                  <Button
                                    color="error"
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                      if (popoverId === row?._id) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(row?._id);
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </CustomPopover>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    setEditCountry({
                                      countryName: row?.name,
                                      description: row?.description,
                                      countryId: row?._id,
                                    });
                                    setAddCountryModal({
                                      status: true,
                                      type: "update",
                                    });
                                  }}
                                >
                                  <SettingsIcon />
                                </Button>
                              </Stack>
                            ) : column.id === "stt" ? (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                {index + 1}
                              </div>
                            ) : column.id === "name" ? (
                              <div style={{ fontWeight: 600 }}>{value}</div>
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
          count={listCountry.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
