import { CircularProgress, Popover, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setListType, setSongPlaying, songData } from "../../slices/songSlice";
import { USER_KEY } from "../../utils/constants";
import { parseJSON } from "../../utils/utils";
import SearchIcon from "@mui/icons-material/Search";
import "./style.scss";
import { InputAdornment } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { createKeyWordSearch } from "../../services/search";
import ControlList from "../../pages/Client/SongDetail/components/ControlList";
import DownloadIcon from "@mui/icons-material/Download";
import { getBase64 } from "../../services/user";
import { toast } from "react-hot-toast";
import {
  createSongDownload,
  createUserListenHistory,
} from "../../services/song";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";

export default function ClientLayout(props) {
  const { song } = useSelector(songData);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const userData = parseJSON(localStorage.getItem(USER_KEY), {});
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = React.useState(null);
  const searchText = useRef("");
  const { listSongPlaying } = useSelector(songData);
  const [songPlayingIndex, setSongPlayingIndex] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { listType } = useSelector(songData);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);

  const open = Boolean(anchorEl);
  const searchOpen = Boolean(searchAnchorEl);

  const pauseAndPlaySong = () => {
    if (song.playing) {
      audioRef?.current?.play();
    } else {
      audioRef?.current?.pause();
    }
  };

  useEffect(() => {
    if (audioRef) {
      pauseAndPlaySong();
    }
  }, [song.playing]);

  useEffect(() => {
    if (audioRef) {
      const findIndex = [...listSongPlaying]?.findIndex(
        (item) => item?._id === song?._id
      );
      if (findIndex >= 0 && findIndex !== songPlayingIndex) {
        setSongPlayingIndex(findIndex);
      }
      audioRef?.current?.load();
      pauseAndPlaySong();
    }
  }, [song._id]);

  useEffect(() => {
    if (userData?.role === 2) {
      window.location.reload();
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (listSongPlaying?.length) {
      const findIndex = [...listSongPlaying]?.findIndex(
        (item) => item?._id === song?._id
      );

      if (findIndex >= 0) {
        setSongPlayingIndex(findIndex);
        dispatch(
          setSongPlaying({ ...listSongPlaying[findIndex], playing: true })
        );
      } else {
        setSongPlayingIndex(0);
        dispatch(setSongPlaying({ ...listSongPlaying[0], playing: true }));
      }
    }
  }, [listSongPlaying]);

  useEffect(() => {
    if (listSongPlaying?.length) {
      setSongPlayingIndex(0);
      dispatch(setSongPlaying({ ...listSongPlaying[0], playing: true }));
    }
  }, [listType?.type]);

  const fastBackWard = () => {
    audioRef.current.currentTime = audioRef.current.currentTime - 10;
  };

  const fastForward = () => {
    audioRef.current.currentTime = audioRef.current.currentTime + 10;
  };

  const nextAndBackSong = (type) => {
    if (listSongPlaying?.length > 1) {
      if (songPlayingIndex === listSongPlaying?.length - 1 && type === "next") {
        setSongPlayingIndex(0);
        dispatch(
          setSongPlaying({
            ...listSongPlaying[0],
            playing: true,
          })
        );
      } else if (songPlayingIndex === 0 && type === "back") {
        setSongPlayingIndex(listSongPlaying?.length - 1);
        dispatch(
          setSongPlaying({
            ...listSongPlaying?.[listSongPlaying?.length - 1],
            playing: true,
          })
        );
      } else {
        setSongPlayingIndex(
          type === "next" ? songPlayingIndex + 1 : songPlayingIndex - 1
        );
        dispatch(
          setSongPlaying({
            ...listSongPlaying[
              type === "next" ? songPlayingIndex + 1 : songPlayingIndex - 1
            ],
            playing: true,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (userData?._id && song._id) {
      if (!song?.song_name && song?.name) {
        (async () => {
          await createUserListenHistory(song?._id, userData?._id);
        })();
      }
    }
  }, [song._id]);

  return (
    <>
      <header className="header-area">
        {/* Navbar Area */}
        <div className="oneMusic-main-menu">
          <div className="classy-nav-container breakpoint-off">
            <div className="container">
              {/* Menu */}
              <nav
                className="classy-navbar justify-content-between"
                id="oneMusicNav"
              >
                {/* Nav brand */}
                <a href="/" className="nav-brand">
                  <img src="img/core-img/logo.png" alt="" />
                </a>
                {/* Navbar Toggler */}
                <div className="classy-navbar-toggler">
                  <span className="navbarToggler">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                {/* Menu */}
                <div className="classy-menu">
                  {/* Close Button */}
                  <div className="classycloseIcon">
                    <div className="cross-wrap">
                      <span className="top" />
                      <span className="bottom" />
                    </div>
                  </div>
                  {/* Nav Start */}
                  
                  <div className="classynav">
                    <ul>
                      <li>
                        <a href="/">Trang chủ</a>
                      </li>
                      <li>
                        <a href="/album">Albums</a>
                      </li>
                      <li>
                        <a href="/category">Thể loại</a>
                      </li>
                      <li>
                        <a href="/new-song">Nhạc mới</a>
                      </li>
                      <li>
                        <a href="/member">Thành viên</a>
                      </li> 
                      {/* <li>
                        <a href="/chucnang">Chức năng</a>
                      </li> */}
                      <li>
                        <SearchIcon
                          style={{ color: "white", cursor: "pointer" }}
                          onClick={(event) => {
                            setSearchAnchorEl(event.currentTarget);
                           
                          }}
                        />
                        <Popover
                          id={"user-info-popover"}
                          open={searchOpen}
                          anchorEl={searchAnchorEl}
                          onClose={() => setSearchAnchorEl(null)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          style={{ marginTop: "30px", marginLeft: "-430px" }}
                        >
                          <div
                            style={{
                              minWidth: "300px",
                              minHeight: "80px",
                              padding: "20px 20px",
                            }}
                          >
                            <TextField
                              sx={{ width: "500px" }}
                              style={{ width: "500px" }}
                              onChange={(event) =>
                                (searchText.current = event.target.value)
                              }
                              
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment>
                                    <IconButton
                                      onClick={async () => {
                                        await createKeyWordSearch(
                                          searchText.current
                                        );
                                        navigate(
                                          `/search?search=${searchText.current}`
                                        );
                                        window.location.reload();
                                      }}
                                    >
                                      <SearchIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </Popover>
                      </li>
                    </ul>

                    <div className="login-register-cart-button d-flex align-items-center">
                      <div className="login-register-btn mr-50">
                        {userData?._id ? (
                          <>
                            <a
                              id="loginBtn"
                              onClick={(event) => {
                                setAnchorEl(event.currentTarget);
                              }}
                            >
                              {userData?.email}
                            </a>
                            <Popover
                              id={"user-info-popover"}
                              open={open}
                              anchorEl={anchorEl}
                              onClose={() => setAnchorEl(null)}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              style={{ marginTop: "10px" }}
                            >
                              <div
                                style={{
                                  minWidth: "150px",
                                  minHeight: "80px",
                                  padding: "10px 20px",
                                }}
                              >
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="user-link"
                                  onClick={() => {
                                    navigate("/personal-info");
                                  }}
                                >
                                  Trang cá nhân
                                </div>
                                <hr style={{ margin: "10px 0" }} />
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="user-link"
                                  onClick={() => {
                                    navigate("/");
                                    localStorage.clear();
                                  }}
                                >
                                  Đăng xuất
                                </div>
                              </div>
                            </Popover>
                          </>
                        ) : (
                          <a href="/login" id="loginBtn">
                            Đăng nhập / Đăng kí
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Nav End */}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div style={{ marginBottom: "100px" }}>{props.children}</div>
      {song?._id ? (
        <div className="fixed-playing-song">
          <div
            className="single-new-item d-flex align-items-center justify-content-between"
            data-wow-delay="100ms"
          >
            <div
              className="first-part d-flex align-items-center"
              style={{ gap: "20px" }}
            >
              <div
                className="thumbnail"
                style={{
                  minWidth: "73px",
                  minHeight: "73px",
                  border: "0.5px solid gray",
                }}
              >
                <img
                  src={song?.avatar}
                  alt=""
                  style={{ width: "73px", height: "73px" }}
                />
              </div>
              <div className="content-">
                <h6 style={{ color: "white" }}>
                  {song?.name || song?.song_name}
                </h6>
                <p style={{ color: "white" }}>
                  {song?.singer?.length
                    ? song?.singer?.map((it) => it?.name).join(", ")
                    : ""}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {listSongPlaying?.length > 1 ? (
                  <Tooltip
                    title={shuffle ? "Tắt phát ngẫu nhiên" : "Phát ngẫu nhiên"}
                    placement="top"
                  >
                    <ShuffleIcon
                      style={{
                        color: shuffle ? "red" : "white",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShuffle(!shuffle)}
                    />
                  </Tooltip>
                ) : (
                  <></>
                )}

                {listSongPlaying?.length > 1 ? (
                  <Tooltip title="Bài phía trước" placement="top">
                    <ArrowBackIosIcon
                      style={{ color: "white" }}
                      sx={{ width: "30px", cursor: "pointer" }}
                      onClick={() => nextAndBackSong("back")}
                    />
                  </Tooltip>
                ) : (
                  <></>
                )}

                <Tooltip title="Chậm 10s" placement="top">
                  <KeyboardDoubleArrowLeftIcon
                    style={{ color: "white", marginRight: "10px" }}
                    sx={{ width: "30px", height: "30px", cursor: "pointer" }}
                    onClick={() => fastBackWard()}
                  />
                </Tooltip>
                <audio
                  preload="auto"
                  controls
                  ref={audioRef}
                  onPause={(event) => {
                    if (listType?.playing) {
                      dispatch(setListType({ ...listType, playing: false }));
                    }
                    dispatch(setSongPlaying({ ...song, playing: false }));
                  }}
                  onPlaying={() => {
                    if (!song?.playing) {
                      dispatch(setSongPlaying({ ...song, playing: true }));
                    }
                    if (!listType?.playing) {
                      dispatch(setListType({ ...listType, playing: true }));
                    }
                  }}
                  controlsList="nodownload"
                  onEnded={() => {
                    if (repeat) {
                      if (listSongPlaying?.length) {
                        if (!shuffle) {
                          if (
                            songPlayingIndex ===
                            listSongPlaying?.length - 1
                          ) {
                            setSongPlayingIndex(0);
                            dispatch(
                              setSongPlaying({
                                ...listSongPlaying[0],
                                playing: true,
                              })
                            );
                          } else {
                            setSongPlayingIndex(songPlayingIndex + 1);
                            dispatch(
                              setSongPlaying({
                                ...listSongPlaying[songPlayingIndex + 1],
                                playing: true,
                              })
                            );
                          }
                        } else {
                          const random =
                            Math.floor(
                              Math.random() * (listSongPlaying?.length - 1)
                            ) + 0;
                          setSongPlayingIndex(random);
                          dispatch(
                            setSongPlaying({
                              ...listSongPlaying[random],
                              playing: true,
                            })
                          );
                        }
                      }
                    } else {
                      audioRef.current.load();
                      audioRef.current.play();
                    }
                  }}
                >
                  <source src={song?.link} />
                </audio>
                <Tooltip title="Nhanh 10s" placement="top">
                  <KeyboardDoubleArrowRightIcon
                    style={{ color: "white", marginLeft: "10px" }}
                    sx={{ width: "30px", height: "30px", cursor: "pointer" }}
                    onClick={() => fastForward()}
                  />
                </Tooltip>

                {listSongPlaying?.length > 1 ? (
                  <Tooltip title="Bài phía sau" placement="top">
                    <ArrowForwardIosIcon
                      style={{ color: "white" }}
                      sx={{ width: "30px", cursor: "pointer" }}
                      onClick={() => nextAndBackSong("next")}
                    />
                  </Tooltip>
                ) : (
                  <></>
                )}

                {listSongPlaying?.length > 1 ? (
                  <Tooltip
                    title={repeat ? "Lặp lại" : "Tắt lặp lại"}
                    placement="top"
                  >
                    <RepeatIcon
                      style={{
                        color: repeat ? "white" : "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setRepeat(!repeat)}
                    />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>

              <div className="song-control-list">
                {!song?.song_name ? (
                  <ControlList songId={song?._id} color="white" />
                ) : (
                  <></>
                )}
                <Tooltip title="Tải xuống" placement="top">
                  <div
                    onClick={async () => {
                      if (userData?.rank === "SILVER") {
                        if (!downloadLoading) {
                          setDownloadLoading(true);
                          const result = await getBase64(song?.link);
                          if (result?.data?.success) {
                            var a = document.createElement("a");
                            a.href = result?.data?.payload;
                            a.download = `${song?.name || song?.song_name}.mp3`;
                            a.click();
                            toast.success("Tải về thành công");
                            if (!song?.song_name) {
                              await createSongDownload(
                                song?._id,
                                userData?._id || -1
                              );
                            }
                          }
                          setDownloadLoading(false);
                        }

                      }else {
                        return toast.error('Chức năng này chỉ dành cho tài khoản VIP')
                      }
                    }}
                  >
                    {downloadLoading ? (
                      <CircularProgress size={"20px"} sx={{ color: "white" }} />
                    ) : (
                      <DownloadIcon
                        sx={{ color: "white", cursor: "pointer" }}
                      />
                    )}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
