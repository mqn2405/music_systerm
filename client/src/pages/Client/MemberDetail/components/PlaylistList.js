import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllPlaylist, getPlaylistSong } from "../../../../services/playlist";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
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

export default function PersonalPlaylist({ userId }) {
  const [listPlaylist, setListPlayList] = useState([]);
  const [expandPlaylist, setExpandPlaylist] = useState(-1);
  const [playListSong, setPlayListSong] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { listType } = useSelector(songData);
  const { listSongPlaying } = useSelector(songData);

  const getUserPlayList = async () => {
    try {
      const result = await getAllPlaylist(undefined, undefined, userId);
      if (result?.data?.success) {
        setListPlayList(result?.data?.payload?.playlist);
      }
    } catch (error) {
      console.log("get user playlist error >>> ", error);
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
            type: "member-playlist",
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
    if (userId) {
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

  useEffect(() => {
    if (expandPlaylist > -1) {
      getPlayListSong(expandPlaylist);
    }
  }, [expandPlaylist]);

  const expandIcon = (id) => {
    if (expandPlaylist === id) {
      return setExpandPlaylist(-1);
    }
    setExpandPlaylist(id);
  };

  return (
    <div>
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
                  {/* <ListItemIcon>
                    <PlayCircleOutlineIcon />
                  </ListItemIcon> */}
                  <ListItemIcon>
                    <div
                      onClick={() => {
                        if (
                          listType?.type !== "member-playlist" ||
                          (listType?.type === "member-playlist" &&
                            listType?.id !== item?._id)
                        ) {
                          return playAllListSong(item?._id);
                        }

                        if (
                          listType?.type === "member-playlist" &&
                          listType?.id === item?._id
                        ) {
                          if (listType?.playing) {
                            dispatch(
                              setListType({
                                type: "member-playlist",
                                id: item?._id,
                                playing: false,
                              })
                            );
                            dispatch(setSongState(false));
                          } else {
                            dispatch(
                              setListType({
                                type: "member-playlist",
                                id: item?._id,
                                playing: true,
                              })
                            );
                            dispatch(setSongState(true));
                          }
                        }
                      }}
                    >
                      {listType?.type === "member-playlist" &&
                      listType?.id === item?._id &&
                      listType?.playing ? (
                        <PauseCircleOutlineIcon />
                      ) : (
                        <PlayCircleOutlineIcon />
                      )}
                    </div>
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
                                  height: "80px",
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
                                              type: "member-playlist",
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
                                          listType?.type ===
                                            "member-playlist" &&
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
                                          listType?.type ===
                                            "member-playlist" &&
                                          listType?.id === item?._id
                                        ) {
                                          dispatch(
                                            setListType({
                                              type: "member-playlist",
                                              id: item?._id,
                                              playing: true,
                                            })
                                          );
                                        }

                                        if (!listSongPlaying?.length || listType?.type !== "member-playlist"){
                                          setAllSongPlaying(item?._id)
                                          dispatch(
                                            setListType({
                                              type: "member-playlist",
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
    </div>
  );
}
