import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  Checkbox,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import SettingsIcon from "@mui/icons-material/Settings";
import CustomPopover from "../../../components/CustomPopover";
import CustomModal from "../../../components/CustomModal";
import RTextField from "../../../components/RedditTextField";
import { toast } from "react-hot-toast";
import {
  createNewAlbum,
  deleteAlbumData,
  getAllAlbum,
  updateAlbum,
} from "../../../services/album";
import storage from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAllSinger } from "../../../services/singer";
import { getAllCountry } from "../../../services/country";
import { parseJSON } from "../../../utils/utils";
import { MenuProps, useStyles } from "../Song/utils";

const columns = [
  { id: "stt", label: "#", minWidth: 50, align: "center" },
  {
    id: "avatar",
    label: "Avatar",
    minWidth: 170,
    align: "center",
  },
  {
    id: "name",
    label: "Name",
    minWidth: 170,
    align: "left",
  },
  {
    id: "singer_name",
    label: "Tên ca sĩ",
    minWidth: 170,
    align: "left",
  },
  {
    id: "country_name",
    label: "Quốc gia",
    minWidth: 170,
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    minWidth: 170,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

export default function AdminAlbum() {
  const [listAlbum, setListAlbum] = useState([]);
  const [addAlbumModal, setAddAlbumModal] = useState({
    status: false,
    type: "",
  });
  const [editAlbum, setEditAlbum] = useState({
    albumName: "",
    description: "",
    avatar: "",
    albumId: -1,
    singer: [],
    countryId: -1,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [popoverId, setPopoverId] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [singerList, setSingerList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getListAlbum = async () => {
    try {
      const res = await getAllAlbum();
      if (res?.data?.success) {
        setListAlbum(res?.data?.payload?.album);
      }
    } catch (error) {
      console.log("get list brand error >>> ", error);
    }
  };

  const getListSinger = async () => {
    try {
      const res = await getAllSinger();
      if (res?.data?.success) {
        setSingerList(res?.data?.payload?.singer);
      }
    } catch (error) {
      console.log("get singer error >>> ", error);
    }
  };

  const getListCountry = async () => {
    try {
      const res = await getAllCountry();
      if (res?.data?.success) {
        setCountryList(res?.data?.payload);
      }
    } catch (error) {
      console.log("get country error >>> ", error);
    }
  };

  useEffect(() => {
    getListCountry();
    getListSinger();
    getListAlbum();
  }, []);

  const handleCreateUpdateAlbum = async () => {
    const { albumName, description, avatar, singer, countryId } = editAlbum;
    if (
      !albumName.trim().length ||
      !description.trim().length ||
      !singer?.length ||
      countryId === -1 ||
      (typeof avatar === "string" && !avatar?.length)
    ) {
      return toast.error("Dữ liệu không được bỏ trống ");
    } else if (albumName.trim().length < 2) {
      return toast.error("Tên có ít nhất 2 kí tự");
    } else if (description.length <= 10) {
      return toast.error("Mô tả ít nhất 10 kí tự");
    } else {
      let newAvatar = avatar;
      if (typeof avatar !== "string") {
        const imageName = "album-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, avatar);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          newAvatar = url;
        } else {
          return toast.error("Không thể tải hình ảnh");
        }
      }

      if (addAlbumModal.type === "add") {
        const createRes = await createNewAlbum(
          albumName,
          description,
          newAvatar,
          singer,
          countryId
        );
        if (createRes?.data?.success) {
          toast.success("Thêm mới album thành công");
          getListAlbum();
          return setAddAlbumModal({ status: false, type: "" });
        } else {
          return toast.error(
            createRes?.data?.error || "Thêm mới album thất bại"
          );
        }
      } else {
        const updateRes = await updateAlbum(
          editAlbum?.albumId,
          albumName,
          description,
          newAvatar,
          singer,
          countryId
        );

        if (updateRes?.data?.success) {
          toast.success("Cập nhật album thành công");
          getListAlbum();
          setAddAlbumModal({ status: false, type: "" });
        } else {
          toast.error(updateRes?.data?.error || "Cập nhật album thất bại");
        }
      }
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      const deleteRes = await deleteAlbumData(albumId);
      if (deleteRes?.data?.success) {
        toast.success("Xoá album thành công");
        getListAlbum();
        setPopoverId("");
      } else {
        toast.error(deleteRes?.data?.error || "Xoá album thất bại");
      }
    } catch (error) {
      toast.error("Xoá album thất bại");
    }
  };

  return (
    <>
      <div>
        <CustomModal
          visible={addAlbumModal.status}
          onClose={() => setAddAlbumModal({ ...addAlbumModal, status: false })}
          title={
            addAlbumModal.type === "add" ? "Thêm mới album" : "Cập nhật album"
          }
          content={
            <>
              <RTextField
                label="Name"
                defaultValue={editAlbum.albumName || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setEditAlbum({
                    ...editAlbum,
                    albumName: event.target.value,
                  })
                }
              />

              <Typography
                variant="p"
                component="p"
                sx={{
                  fontSize: "17px",
                  color: "black",
                  marginTop: "10px",
                }}
              >
                Quốc gia:
              </Typography>

              <Select
                placeholder="Enter Country"
                value={editAlbum?.countryId || -1}
                sx={{ width: "100%" }}
                label="Country"
                onChange={(event) => {
                  setEditAlbum({
                    ...editAlbum,
                    countryId: event.target.value,
                  });
                }}
              >
                {countryList?.map((item, index) => {
                  return (
                    <MenuItem value={item?._id} key={`country-item-${index}`}>
                      {item?.name}
                    </MenuItem>
                  );
                })}
              </Select>

              <Typography
                variant="p"
                component="p"
                sx={{
                  fontSize: "17px",
                  color: "black",
                  marginTop: "10px",
                }}
              >
                Ca sĩ:
              </Typography>
              <Select
                labelId="mutiple-select-label"
                multiple
                sx={{ width: "100%" }}
                value={editAlbum?.singer}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value[value.length - 1] === "all") {
                    setEditAlbum({
                      ...editAlbum,
                      singer:
                        editAlbum?.singer.length === singerList.length
                          ? []
                          : singerList?.map((item) => {
                              return {
                                _id: item?._id,
                                name: item?.name,
                              };
                            }),
                    });
                    return;
                  }
                  const songSinger = [...editAlbum?.singer];
                  const valueParse = parseJSON(
                    value[value.length - 1],
                    value[value.length - 1]
                  );
                  const findSinger = songSinger?.find(
                    (item) => item?._id === valueParse?._id
                  );

                  if (!findSinger) {
                    setEditAlbum({
                      ...editAlbum,
                      singer: value?.map((item) => parseJSON(item, item)),
                    });
                  } else {
                    setEditAlbum({
                      ...editAlbum,
                      singer: songSinger?.filter(
                        (item) => item?._id !== valueParse?._id
                      ),
                    });
                  }
                }}
                renderValue={(selected) =>
                  selected?.map((item) => item?.name).join(", ")
                }
                MenuProps={MenuProps}
              >
                <MenuItem
                  value="all"
                  classes={{
                    root:
                      editAlbum?.singer?.length > 0 &&
                      editAlbum?.singer?.length === singerList?.length
                        ? classes.selectedAll
                        : "",
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      classes={{ indeterminate: classes.indeterminateColor }}
                      checked={
                        editAlbum?.singer?.length > 0 &&
                        editAlbum?.singer?.length === singerList?.length
                      }
                      indeterminate={
                        editAlbum?.singer.length > 0 &&
                        editAlbum?.singer.length < singerList.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.selectAllText }}
                    primary="Select All"
                  />
                </MenuItem>
                {singerList.map((option, index) => (
                  <MenuItem
                    key={`singer-item-${index}`}
                    value={JSON.stringify({
                      _id: option?._id,
                      name: option?.name,
                    })}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={
                          editAlbum?.singer?.findIndex(
                            (item) => item?._id === option?._id
                          ) >= 0
                            ? true
                            : false
                        }
                      />
                    </ListItemIcon>
                    <ListItemText primary={option?.name} />
                  </MenuItem>
                ))}
              </Select>

              <Typography
                variant="p"
                component="p"
                sx={{
                  fontSize: "17px",
                  color: "black",
                  marginBottom: "-10px",
                  marginTop: "10px",
                }}
              >
                Ảnh đại diện:
              </Typography>
              <RTextField
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11 }}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setEditAlbum({
                    ...editAlbum,
                    avatar: event.target.files[0],
                  });
                }}
              />

              <TextareaAutosize
                defaultValue={editAlbum.description || ""}
                aria-label="minimum height"
                minRows={10}
                placeholder="Description"
                style={{ width: "100%", marginTop: "20px", padding: "10px" }}
                onChange={(event) =>
                  setEditAlbum({
                    ...editAlbum,
                    description: event.target.value,
                  })
                }
              />
            </>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={async () => {
                setSubmitLoading(true);
                await handleCreateUpdateAlbum();
                setSubmitLoading(false);
              }}
              loading={submitLoading}
            >
              {addAlbumModal.type === "add" ? "Thêm mới" : "Cập nhật"}
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
          Quản lí Album
        </Typography>
        <div>
          <Button
            variant="contained"
            onClick={() => {
              setEditAlbum({
                albumName: "",
                description: "",
                avatar: "",
                singer: [],
                countryId: -1,
              });
              setAddAlbumModal({ status: true, type: "add" });
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
              {listAlbum
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
                                  handleSubmit={() => deleteAlbum(row?._id)}
                                  noti="Are you sure you want to delete the album?"
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
                                    setEditAlbum({
                                      albumName: row?.name,
                                      description: row?.description,
                                      avatar: row?.avatar,
                                      albumId: row?._id,
                                      singer: row?.singer,
                                      countryId: row?.country_id || -1,
                                    });
                                    setAddAlbumModal({
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
                            ) : column.id === "description" ? (
                              <div
                                style={{
                                  maxWidth: "200px",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {value}
                              </div>
                            ) : column.id === "avatar" ? (
                              <img
                                src={value}
                                alt="avatar"
                                width={70}
                                height={70}
                                style={{ border: "0.5px solid gray" }}
                              />
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
          count={listAlbum.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
