import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../../components/CustomModal";
import RTextField from "../../../../components/RedditTextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-hot-toast";
import storage from "../../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserSong, getUserSong } from "../../../../services/userSong";
import { parseJSON } from "../../../../utils/utils";
import { USER_KEY } from "../../../../utils/constants";
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
import PlayIcon from "../../../../assets/image/play-music.svg";
import StopIcon from "../../../../assets/image/stop-music.svg";

const PAGE_LIMIT = 20;

export default function UploadMusic() {
  const [visibleCreatePlModal, setVisibleCreatePlModal] = useState(false);
  const [songDataInfo, setSongDataInfo] = useState({
    name: "",
    link: "",
    avatar: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const userInfo = parseJSON(localStorage.getItem(USER_KEY), {});
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [userSong, setUserSong] = useState([]);
  const dispatch = useDispatch();
  const { song, listType } = useSelector(songData);
  const { listSongPlaying } = useSelector(songData);

  const setPLayListSong = async () => {
    const result = await getUserSong(undefined, undefined, userInfo?._id);
    if (result?.data?.success) {
      const userSong = [...result?.data?.payload?.userSong]?.map((item) => {
        return {
          ...item,
          _id: item?._id + "upload",
        };
      });
      dispatch(setListSongPlaying(userSong));
    }
  };

  const getAllListSong = async () => {
    try {
      const result = await getUserSong(undefined, undefined, userInfo?._id);
      if (result?.data?.success) {
        const userSong = [...result?.data?.payload?.userSong]?.map((item) => {
          return {
            ...item,
            _id: item?._id + "upload",
          };
        });
        dispatch(setListSongPlaying(userSong));
        dispatch(
          setListType({
            type: "user-upload",
            id: userInfo?._id,
            playing: true,
          })
        );
      }
    } catch (error) {
      console.log("get song error >>> ", error);
    }
  };

  const getListUserSong = async () => {
    try {
      const result = await getUserSong(PAGE_LIMIT, page, userInfo?._id);
      if (result?.data?.success) {
        setUserSong(result?.data?.payload?.userSong);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get list user song error >>> ", error);
    }
  };

  useEffect(() => {
    getListUserSong();
  }, [page]);

  const handleCreateSong = async () => {
    try {
      const { name, link, avatar } = songDataInfo;

      if (
        !name?.trim()?.length ||
        (typeof avatar === "string" && !avatar?.length) ||
        (typeof link === "string" && !link?.length)
      ) {
        return toast.error("Dữ liệu không được bỏ trống");
      }

      let newAvatar = avatar;
      if (typeof avatar !== "string") {
        const imageName = "song-avatar-" + new Date().getTime();
        const storageRef = ref(storage, imageName);

        const updateImageRes = await uploadBytes(storageRef, avatar);
        if (updateImageRes) {
          const pathReference = ref(storage, imageName);
          const url = await getDownloadURL(pathReference);
          newAvatar = url;
        } else {
          return toast.error("Can't upload avatar");
        }
      }

      let newLink = link;
      if (typeof link !== "string") {
        const songLink = "song-link-" + new Date().getTime();
        const storageRef = ref(storage, songLink);

        const updateImageRes = await uploadBytes(storageRef, link);
        if (updateImageRes) {
          const pathReference = ref(storage, songLink);
          const url = await getDownloadURL(pathReference);
          newLink = url;
        } else {
          return toast.error("Can't upload song");
        }
      }
      const song = {
        ...songDataInfo,
        avatar: newAvatar,
        link: newLink,
      };
      const createRes = await createUserSong(userInfo?._id, song);
      if (createRes?.data?.success) {
        toast.success("Thêm mới bài hát thành công");
        getListUserSong();
        return setVisibleCreatePlModal(false);
      } else {
        return toast.error(
          createRes?.data?.error || "Thêm mới bài hát thất bại"
        );
      }
    } catch (error) {
      console.log("Create update song error >>> ", error);
    }
  };

  return (
    <div>
      {visibleCreatePlModal && (
        <CustomModal
          visible={visibleCreatePlModal}
          onClose={() => {
            setVisibleCreatePlModal(false);
            setSongDataInfo({
              name: "",
              link: "",
              avatar: "",
            });
          }}
          title={"Thêm mới bài hát"}
          content={
            <>
              <RTextField
                label="Name"
                value={songDataInfo.name || ""}
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                onChange={(event) =>
                  setSongDataInfo({
                    ...songDataInfo,
                    name: event.target.value,
                  })
                }
              />

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
                Avatar:
              </Typography>
              <RTextField
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11 }}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setSongDataInfo({
                    ...songDataInfo,
                    avatar: event.target.files[0],
                  });
                }}
              />

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
                Link:
              </Typography>
              <RTextField
                defaultValue=""
                id="post-title"
                variant="filled"
                style={{ marginTop: 11 }}
                type="file"
                accept=".mp3"
                onChange={(event) => {
                  setSongDataInfo({
                    ...songDataInfo,
                    link: event.target.files[0],
                  });
                }}
              />
            </>
          }
          action={
            <LoadingButton
              autoFocus
              onClick={async () => {
                setSubmitLoading(true);
                await handleCreateSong(songDataInfo);
                setSubmitLoading(false);
              }}
              loading={submitLoading}
            >
              {"Thêm mới"}
            </LoadingButton>
          }
        />
      )}

      <div style={{ paddingLeft: "20px" }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => {
            setVisibleCreatePlModal(true);
          }}
        >
          Upload bài nhạc
        </Button>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <div className="upload-song-play-button">
          <button
            onClick={() => {
              if (
                listType?.type !== "user-upload" ||
                (listType?.type === "user-upload" &&
                  listType?.id !== userInfo?._id)
              ) {
                return getAllListSong();
              }

              if (
                listType?.type === "user-upload" &&
                listType?.id === userInfo?._id
              ) {
                if (listType?.playing) {
                  dispatch(
                    setListType({
                      type: "user-upload",
                      id: userInfo?._id,
                      playing: false,
                    })
                  );
                  dispatch(setSongState(false));
                } else {
                  dispatch(
                    setListType({
                      type: "user-upload",
                      id: userInfo?._id,
                      playing: true,
                    })
                  );
                  dispatch(setSongState(true));
                }
              }
            }}
          >
            <div>Phát nhạc</div>
            <div style={{ marginLeft: "10px" }}>
              {listType?.type === "user-upload" &&
              listType?.id === userInfo?._id &&
              listType?.playing ? (
                <img
                  src={StopIcon}
                  alt=""
                  style={{ width: "25px", height: "25px" }}
                />
              ) : (
                <img
                  src={PlayIcon}
                  alt=""
                  style={{ width: "25px", height: "25px" }}
                />
              )}
            </div>
          </button>
        </div>

        <div className="one-music-songs-area mb-70 mt-70">
          <div className="row">
            {userSong?.map((item, index) => {
              return (
                <div className="col-12">
                  <div className="single-song-area mb-30 d-flex align-items-end">
                    <div
                      className="song-thumbnail"
                      style={{
                        width: "85px",
                        height: "85px",
                        border: "0.5px solid gray",
                        maxWidth: "85px",
                      }}
                    >
                      <img
                        src={item?.avatar}
                        alt=""
                        style={{ width: "85px", height: "84px" }}
                      />
                    </div>
                    <div
                      className="song-play-area d-flex align-items-center"
                      style={{
                        maxWidth: "unset",
                        flex: "unset",
                        justifyContent: "space-between",
                        width: "calc(100% - 140px)",
                      }}
                    >
                      <div>
                        <div className="song-name">
                          <p style={{ cursor: "pointer" }}>{item?.song_name}</p>
                        </div>
                      </div>
                      <div>
                        {song?._id === item?._id + "upload" && song?.playing ? (
                          <img
                            src={StopMusicIcon}
                            alt="play music"
                            style={{
                              width: "50px",
                              height: "50px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              dispatch(setSongState(false));
                              if (listType?.playing) {
                                dispatch(
                                  setListType({
                                    type: "user-upload",
                                    id: userInfo?._id,
                                    playing: false,
                                  })
                                );
                              }
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
                                !listType?.playing &&
                                listType?.type === "user-upload" &&
                                listType?.id === userInfo?._id
                              ) {
                                dispatch(
                                  setListType({
                                    type: "user-upload",
                                    id: userInfo?._id,
                                    playing: true,
                                  })
                                );
                              }

                              if (!listSongPlaying?.length || listType?.type !== 'user-upload') {
                                setPLayListSong();
                                dispatch(
                                  setListType({
                                    type: "user-upload",
                                    ...listType
                                  })
                                );
                              }

                              dispatch(
                                setSongPlaying({
                                  ...item,
                                  _id: item?._id + "upload",
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
            })}
          </div>
        </div>

        {totalPage > 1 ? (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="load-more-btn text-center"
                    onClick={() => {
                      if (page > 0) {
                        setPage(page - 1);
                      }
                    }}
                  >
                    <a className="btn oneMusic-btn">Trước</a>
                  </div>
                  <div className="load-more-btn text-center">
                    <a
                      className="btn oneMusic-btn"
                      style={{
                        padding: 0,
                        minWidth: "100px",
                        width: "100px",
                      }}
                    >
                      {page + 1} / {totalPage}
                    </a>
                  </div>

                  <div
                    className="load-more-btn text-center"
                    onClick={() => {
                      if (page + 1 < totalPage) {
                        setPage(page + 1);
                      }
                    }}
                  >
                    <a className="btn oneMusic-btn">Sau</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
