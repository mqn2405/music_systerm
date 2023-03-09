/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryDetail } from "../../../services/category";
import { getAllSong } from "../../../services/song";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../slices/songSlice";
import "./style.scss";
import PlayMusicIcon from "../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../assets/image/stop-music.svg";

const PAGE_LIMIT = 12;

export default function CategoryDetail() {
  const [categoryDetail, setCategoryDetail] = useState({});
  const [songList, setSongList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const { listSongPlaying } = useSelector(songData);
  const { listType } = useSelector(songData);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { id } = useParams();

  const getCategoryData = async () => {
    try {
      const result = await getCategoryDetail(id);
      if (result?.data?.success) {
        setCategoryDetail(result?.data?.payload);
      }
    } catch (error) {
      console.log("category detail error >>> ", error);
    }
  };

  const setAllSongPlaying = async () => {
    const result = await getAllSong(undefined, undefined, undefined, id);
    if (result?.data?.success) {
      dispatch(setListSongPlaying(result?.data?.payload?.song));
    }
  };

  const getSongList = async () => {
    try {
      const result = await getAllSong(PAGE_LIMIT, page, undefined, id);
      if (result?.data?.success) {
        setSongList(result?.data?.payload?.song);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get album error >>> ", error);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    getSongList();
  }, [page]);

  return (
    <div style={{ marginBottom: "100px" }}>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(/img/bg-img/breadcumb3.jpg)" }}
      ></section>
      <div className="category-name">{categoryDetail?.name}</div>

      <div className="category-song" style={{ padding: "20px 40px" }}>
        <div className="category-song-list" style={{ flexWrap: "wrap" }}>
          {songList?.map((it, id) => {
            return (
              <div class="card hover" key={`category-song-${id}`}>
                <div
                  class="card-img"
                  style={{ backgroundImage: `url(${it?.avatar})` }}
                >
                  <div class="overlay">
                    <div class="overlay-content">
                      <a
                        class="hover"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (it?._id !== song?._id) {
                            if (
                              !listSongPlaying?.length ||
                              listType?.type !== `category-detail-${id}`
                            ) {
                              setAllSongPlaying();
                              dispatch(
                                setListType({
                                  type: `category-detail-${id}`,
                                  ...listType,
                                })
                              );
                            }

                            dispatch(setSongPlaying({ ...it, playing: true }));
                          } else {
                            if (song?.playing) {
                              dispatch(setSongState(false));
                            } else {
                              if (
                                !listSongPlaying?.length ||
                                listType?.type !== `category-detail-${id}`
                              ) {
                                setAllSongPlaying();
                                dispatch(
                                  setListType({
                                    type: `category-detail-${id}`,
                                    ...listType,
                                  })
                                );
                              }
                              dispatch(setSongState(true));
                            }
                          }
                        }}
                      >
                        {song?._id === it?._id && song?.playing ? (
                          <img
                            src={StopMusicIcon}
                            alt="play-icon"
                            style={{
                              width: "35px",
                              height: "35px",
                              marginTop: "-5px",
                            }}
                          />
                        ) : (
                          <img
                            src={PlayMusicIcon}
                            alt="play-icon"
                            style={{
                              width: "35px",
                              height: "35px",
                              marginTop: "-5px",
                            }}
                          />
                        )}
                      </a>
                    </div>
                  </div>
                </div>

                <div class="card-content">
                  <a>
                    <p style={{ margin: 0, padding: 0 }}>
                      {it?.singer?.length
                        ? it?.singer?.map((i) => i.name)?.join(", ")
                        : ""}
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/song/${it?._id}`)}
                    >
                      {it?.name}
                    </p>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {totalPage > 1 ? (
          <div className="container" style={{ marginTop: "40px" }}>
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
                    <a className="btn oneMusic-btn">Sau</a>
                  </div>
                  <div className="load-more-btn text-center">
                    <a
                      className="btn oneMusic-btn"
                      style={{ padding: 0, minWidth: "100px", width: "100px" }}
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
                    <a className="btn oneMusic-btn">Trước</a>
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
