import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSong } from "../../../services/song";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../slices/songSlice";
import PlayMusicIcon from "../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../assets/image/stop-music.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getAlbumById } from "../../../services/album";
import "./style.scss";
import PlayIcon from "../../../assets/image/play-music.svg";
import StopIcon from "../../../assets/image/stop-music.svg";

const PAGE_LIMIT = 20;

export default function AlbumDetail() {
  const [listSong, setListSong] = useState([]);
  const [albumDetail, setAlbumDetail] = useState({});
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const { listSongPlaying } = useSelector(songData);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { listType } = useSelector(songData);
  const { id } = useParams();
  const navigate = useNavigate();

  const setAllSongPlaying = async () => {
    const result = await getAllSong(undefined, undefined, id);
    if (result?.data?.success) {
      dispatch(setListSongPlaying(result?.data?.payload?.song));
    }
  };

  const getAllListSong = async () => {
    try {
      const result = await getAllSong(undefined, undefined, id);
      if (result?.data?.success) {
        dispatch(setListSongPlaying(result?.data?.payload?.song));
        dispatch(
          setListType({
            type: "album",
            id,
            playing: true,
          })
        );
      }
    } catch (error) {
      console.log("get song error >>> ", error);
    }
  };

  const getListSong = async () => {
    try {
      const result = await getAllSong(PAGE_LIMIT, page, id);
      if (result?.data?.success) {
        setListSong(result?.data?.payload?.song);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get song error >>> ", error);
    }
  };

  const getAlbumDetail = async () => {
    try {
      const result = await getAlbumById(id);
      if (result?.data?.success) {
        setAlbumDetail(result?.data?.payload);
      }
    } catch (error) {
      console.log("get album detail error >>> ", error);
    }
  };

  useEffect(() => {
    getAlbumDetail();
  }, []);

  useEffect(() => {
    getListSong();
  }, [page]);

  return (
    <div style={{ marginBottom: "100px" }}>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      ></section>

      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div style={{ marginTop: "70px" }}>
              <img
                src={albumDetail?.avatar}
                alt=""
                style={{
                  width: "290px",
                  height: "290px",
                  borderRadius: "20px",
                  border: "0.5px solid gray",
                }}
              />
            </div>
            <div className="album-detail-name">{albumDetail?.name}</div>

            <div className="album-player-button">
              <button
                onClick={() => {
                  if (
                    listType?.type !== "album" ||
                    (listType?.type === "album" && listType?.id !== id)
                  ) {
                    return getAllListSong();
                  }

                  if (listType?.type === "album" && listType?.id === id) {
                    if (listType?.playing) {
                      dispatch(
                        setListType({
                          type: "album",
                          id,
                          playing: false,
                        })
                      );
                      dispatch(setSongState(false));
                    } else {
                      dispatch(
                        setListType({
                          type: "album",
                          id,
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
                  {listType?.type === "album" &&
                  listType?.id === id &&
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
          </div>
          <div className="col-12 col-lg-8">
            <div className="one-music-songs-area mb-70 mt-70">
              <div className="container">
                <div style={{ marginBottom: "10px", fontSize: "20px" }}>
                  Bài hát
                </div>
                <div className="row">
                  {!listSong?.length ? (
                    <div
                      style={{
                        marginLeft: "16px",
                        fontSize: "24px",
                        fontWeight: 700,
                      }}
                    >
                      Chưa cập nhật bài hát
                    </div>
                  ) : (
                    listSong?.map((item, index) => {
                      return (
                        <div className="col-12" key={`album-song-${index}`}>
                          <div className="single-song-area mb-30 d-flex align-items-end">
                            <div
                              className="song-thumbnail"
                              style={{
                                width: "118px",
                                height: "118px",
                                border: "0.5px solid gray",
                                maxWidth: "118px",
                                cursor: "pointer",
                              }}
                              onClick={() => navigate(`/song/${item?._id}`)}
                            >
                              <img
                                src={item?.avatar}
                                alt=""
                                style={{ width: "118px", height: "117px" }}
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
                                  <p
                                    onClick={() =>
                                      navigate(`/song/${item?._id}`)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {item?.name}
                                  </p>
                                </div>
                                <div className="singer-name">
                                  <p>
                                    {item?.singer?.length
                                      ? item?.singer
                                          ?.map((it) => it?.name)
                                          .join(", ")
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <div>
                                {song?._id === item?._id && song?.playing ? (
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
                                            type: "album",
                                            id,
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
                                        listType?.type === "album" &&
                                        listType?.id === item?._id
                                      ) {
                                        dispatch(
                                          setListType({
                                            type: "album",
                                            id,
                                            playing: true,
                                          })
                                        );
                                      }

                                      if (!listSongPlaying?.length || listType?.type !== 'album') {
                                        setAllSongPlaying();
                                        dispatch(
                                          setListType({
                                            type: "album",
                                            ...listType
                                          })
                                        );
                                      }

                                      dispatch(
                                        setSongPlaying({
                                          ...item,
                                          playing: true,
                                        })
                                      );
                                    }}
                                  />
                                )}
                              </div>
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
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
