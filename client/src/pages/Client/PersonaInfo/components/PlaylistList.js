import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  createNewPlaylist,
  deletePlaylistData,
  deletePlaylistSong,
  getAllPlaylist,
  getPlaylistSong,
  updatePlaylistName,
} from "../../../../services/playlist";
import { USER_KEY } from "../../../../utils/constants";
import { parseJSON } from "../../../../utils/utils";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../../components/CustomModal";
import RTextField from "../../../../components/RedditTextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-hot-toast";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../../slices/songSlice";
import PlayMusicIcon from "../../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../../assets/image/stop-music.svg";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import EditIcon from "@mui/icons-material/Edit";

export default function PersonalPlaylist() {
  const [listPlaylist, setListPlayList] = useState([]);
  const [expandPlaylist, setExpandPlaylist] = useState(-1);
  const [visibleCreatePlModal, setVisibleCreatePlModal] = useState(false);
  const [playListName, setPlayListName] = useState("");
  const [playListSong, setPlayListSong] = useState([]);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({
    playlistId: -1,
    songId: -1,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { listType } = useSelector(songData);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [editData, setEditData] = useState({
    _id: -1,
    name: "",
  });
  const { listSongPlaying } = useSelector(songData);
  const userData = parseJSON(localStorage.getItem(USER_KEY), {});

  const getUserPlayList = async () => {
    try {
      const result = await getAllPlaylist(undefined, undefined, userData?._id);
      if (result?.data?.success) {
        setListPlayList(result?.data?.payload?.playlist);
      }
    } catch (error) {
      console.log("get user playlist error >>> ", error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!playListName?.trim()?.length) {
        return toast.error("Tên playlist không được bỏ trống");
      }

      const result = await createNewPlaylist(userData?._id, playListName);
      if (result?.data?.success) {
        toast.success("Thêm mới playlist thành công");
        getUserPlayList();
        setVisibleCreatePlModal(false);
        return setPlayListName("");
      }
      toast.error(result?.data?.error || "Thêm mới playlist thất bại");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Thêm mới playlist thất bại");
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      if (!editData?.name?.trim()?.length) {
        return toast.error("Tên playlist không được bỏ trống");
      }

      const result = await updatePlaylistName(
        editData?._id,
        editData?.name?.trim(),
        userData?._id
      );
      if (result?.data?.success) {
        setVisibleEditModal(false);
        setEditData({
          _id: -1,
          name: "",
        });
        setListPlayList(
          listPlaylist?.map((item, index) => {
            if (item?._id === editData?._id) {
              return {
                ...item,
                name: editData?.name,
              };
            }
            return item;
          })
        );
        return toast.success("Cập nhật playlist thành công");
      }
      toast.error(result?.data?.error || "Cập nhật playlist thất bại");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Cập nhật playlist thất bại");
    }
  };

  useEffect(() => {
    if (userData?._id) {
      getUserPlayList();
    }
  }, []);

  const getPlayListSong = async (playListId) => {
    try {
      const result = await getPlaylistSong(playListId);
      if (result?.data?.success) {
        setPlayListSong(result?.data?.payload);
      }
    } catch (error) {
      console.log("get playlist song error >>> ", error);
    }
  };

  const setAllSongPlaying = async (playListId) => {
    const result = await getPlaylistSong(playListId);
    if (result?.data?.success) {
      dispatch(setListSongPlaying(result?.data?.payload));
    }
  };

  const playAllListSong = async (playListId) => {
    try {
      const result = await getPlaylistSong(playListId);
      if (result?.data?.success) {
        dispatch(setListSongPlaying(result?.data?.payload));
        dispatch(
          setListType({
            type: "playlist",
            id: playListId,
            playing: true,
          })
        );
      }
    } catch (error) {
      console.log("get song error >>> ", error);
    }
  };

  useEffect(() => {
    if (expandPlaylist > -1) {
      getPlayListSong(expandPlaylist);
    }
  }, [expandPlaylist]);

  const handleDeletePlaylist = async () => {
    try {
      const result = await deletePlaylistData(deleteData?.playlistId);
      if (result?.data?.success) {
        toast.success("Xoá playlist thành công");
        getUserPlayList();
        setDeleteData({
          playlistId: -1,
          songId: -1,
        });
        return setVisibleDeleteModal(false);
      }
      toast.error("Xoá playlist thất bại");
    } catch (error) {
      toast.error("Xoá playlist thất bại");
    }
  };

  const handleDeletePlaylistSong = async () => {
    try {
      const result = await deletePlaylistSong(
        deleteData?.playlistId,
        deleteData?.songId
      );
      if (result?.data?.success) {
        toast.success("Xoá playlist thành công");
        getPlayListSong(deleteData?.playlistId);
        setDeleteData({
          playlistId: -1,
          songId: -1,
        });
        return setVisibleDeleteModal(false);
      }
      toast.error("Xoá playlist thất bại");
    } catch (error) {
      toast.error("Xoá playlist thất bại");
    }
  };

  const expandIcon = (id) => {
    if (expandPlaylist === id) {
      return setExpandPlaylist(-1);
    }
    setExpandPlaylist(id);
  };

  return (
    <div>
      {visibleCreatePlModal && (
        <CustomModal
          visible={visibleCreatePlModal}
          onClose={() => {
            setVisibleCreatePlModal(false);
          }}
          title={"Tạo mới Playlist"}
          content={
            <div>
              <RTextField
                label="Name"
                value={playListName || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) => setPlayListName(event?.target?.value)}
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleCreatePlaylist();
              }}
            >
              {"Thêm mới"}
            </LoadingButton>
          }
        />
      )}

      {visibleEditModal && (
        <CustomModal
          visible={visibleEditModal}
          onClose={() => {
            setVisibleEditModal(false);
          }}
          title={"Sửa Playlist"}
          content={
            <div>
              <RTextField
                label="Name"
                value={editData?.name || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    name: event?.target?.value,
                  })
                }
              />
            </div>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                handleUpdatePlaylist();
              }}
            >
              {"Cập nhật"}
            </LoadingButton>
          }
        />
      )}

      {visibleDeleteModal && (
        <CustomModal
          visible={visibleDeleteModal}
          onClose={() => {
            setVisibleDeleteModal(false);
          }}
          title={"Xác nhận xoá"}
          content={<div>Bạn có chắc chắn xoá nội dung này?</div>}
          action={
            <LoadingButton
              autoFocus
              onClick={() => {
                if (deleteData?.songId === -1 || !deleteData?.songId) {
                  handleDeletePlaylist();
                } else {
                  handleDeletePlaylistSong();
                }
              }}
            >
              {"Xác nhận"}
            </LoadingButton>
          }
        />
      )}

      {listPlaylist?.length ? (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              style={{ fontSize: "24px", color: "black", fontWeight: 700 }}
            >
              Danh sách Playlist
            </ListSubheader>
          }
        >
          {listPlaylist?.map((item, index) => {
            return (
              <div
                key={`playlist-item-${index}`}
                style={{ paddingLeft: "20px", marginTop: "20px" }}
              >
                <ListItemButton
                  sx={{ border: ".5px solid black", width: "90vw" }}
                >
                  <ListItemText
                    primary={item?.name}
                    style={{
                      color: "black",
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                    sx={{
                      ".css-10hburv-MuiTypography-root": { fontSize: "20px" },
                    }}
                  />
                  <ListItemIcon>
                    <div
                      onClick={() => {
                        if (
                          listType?.type !== "playlist" ||
                          (listType?.type === "playlist" &&
                            listType?.id !== item?._id)
                        ) {
                          return playAllListSong(item?._id);
                        }

                        if (
                          listType?.type === "playlist" &&
                          listType?.id === item?._id
                        ) {
                          if (listType?.playing) {
                            dispatch(
                              setListType({
                                type: "playlist",
                                id: item?._id,
                                playing: false,
                              })
                            );
                            dispatch(setSongState(false));
                          } else {
                            dispatch(
                              setListType({
                                type: "playlist",
                                id: item?._id,
                                playing: true,
                              })
                            );
                            dispatch(setSongState(true));
                          }
                        }
                      }}
                    >
                      {listType?.type === "playlist" &&
                      listType?.id === item?._id &&
                      listType?.playing ? (
                        <PauseCircleOutlineIcon />
                      ) : (
                        <PlayCircleOutlineIcon />
                      )}
                    </div>
                  </ListItemIcon>
                  <ListItemIcon>
                    <DeleteOutlineIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => {
                        setVisibleDeleteModal(true);
                        setDeleteData({
                          playlistId: item?._id,
                        });
                      }}
                    />
                  </ListItemIcon>
                  <ListItemIcon sx={{ color: "blue", cursor: "pointer" }}>
                    <EditIcon
                      sx={{ color: "#1976D2", cursor: "pointer" }}
                      onClick={() => {
                        setVisibleEditModal(true);
                        setEditData({
                          _id: item?._id,
                          name: item?.name,
                        });
                      }}
                    />
                  </ListItemIcon>
                  {expandPlaylist === item?._id ? (
                    <ExpandLess
                      onClick={() => {
                        expandIcon(item?._id);
                      }}
                    />
                  ) : (
                    <ExpandMore
                      onClick={() => {
                        expandIcon(item?._id);
                      }}
                    />
                  )}
                </ListItemButton>
                <Collapse
                  in={expandPlaylist === item?._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                    style={{
                      width: "85vw",
                      marginLeft: "5vw",
                      paddingTop: "40px",
                    }}
                    sx={{ width: "85vw" }}
                  >
                    {playListSong?.length ? (
                      playListSong?.map((it, index) => {
                        return (
                          <div className="single-song-area mb-30 d-flex align-items-end">
                            <div
                              className="song-thumbnail"
                              style={{
                                width: "80px",
                                height: "80px",
                                border: "0.5px solid gray",
                                maxWidth: "80px",
                                cursor: "pointer",
                              }}
                              onClick={() => navigate(`/song/${it?._id}`)}
                            >
                              <img
                                src={it?.avatar}
                                alt=""
                                style={{
                                  width: "80px",
                                  height: "79px",
                                }}
                              />
                            </div>
                            <div
                              className="song-play-area d-flex align-items-center"
                              style={{
                                maxWidth: "unset",
                                flex: "unset",
                                justifyContent: "space-between",
                                width: "80vw",
                                height: "80px",
                              }}
                            >
                              <div>
                                <div className="song-name">
                                  <p
                                    onClick={() => navigate(`/song/${it?._id}`)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {it?.name}
                                  </p>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <DeleteOutlineIcon
                                    sx={{ color: "red", cursor: "pointer" }}
                                    onClick={() => {
                                      setVisibleDeleteModal(true);
                                      setDeleteData({
                                        playlistId: item?._id,
                                        songId: it?._id,
                                      });
                                    }}
                                  />
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  {song?._id === it?._id && song?.playing ? (
                                    <img
                                      src={StopMusicIcon}
                                      alt="play music"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        if (listType?.playing) {
                                          dispatch(
                                            setListType({
                                              type: "playlist",
                                              id: item?._id,
                                              playing: false,
                                            })
                                          );
                                        }

                                        dispatch(setSongState(false));
                                      }}
                                    />
                                  ) : (
                                    <img
                                      src={PlayMusicIcon}
                                      alt="play music"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        if (
                                          listType?.playing &&
                                          listType?.type === "playlist" &&
                                          listType?.id !== item?._id
                                        ) {
                                          dispatch(
                                            setListType({
                                              type: "",
                                              id: -1,
                                              playing: false,
                                            })
                                          );
                                          dispatch(setListSongPlaying([]));
                                        }

                                        if (
                                          !listType?.playing &&
                                          listType?.type === "playlist" &&
                                          listType?.id === item?._id
                                        ) {
                                          dispatch(
                                            setListType({
                                              type: "playlist",
                                              id: item?._id,
                                              playing: true,
                                            })
                                          );
                                        }

                                        if (!listSongPlaying?.length || listType?.type !== "playlist"){
                                          setAllSongPlaying(item?._id)
                                          dispatch(
                                            setListType({
                                              type: "playlist",
                                              ...listType
                                            })
                                          );
                                        }

                                        dispatch(
                                          setSongPlaying({
                                            ...it,
                                            playing: true,
                                          })
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          marginTop: "-20px",
                        }}
                      >
                        Không tồn tại bản nhạc trong playlist
                      </div>
                    )}
                  </List>
                </Collapse>
              </div>
            );
          })}
        </List>
      ) : (
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          Không tồn tại playlist cá nhân
        </div>
      )}

      <div style={{ paddingLeft: "20px" }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => {
            setVisibleCreatePlModal(true);
          }}
        >
          Thêm mới playlist
        </Button>
      </div>
    </div>
  );
}
