import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSong } from "../../../../services/song";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../../slices/songSlice";
import PlayMusicIcon from "../../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../../assets/image/stop-music.svg";

const PAGE_LIMIT = 20;

export default function SongList({ singerId }) {
  const [songList, setSongList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const { listSongPlaying } = useSelector(songData);
  const { listType } = useSelector(songData);

  const setAllSongPlaying = async () => {
    const result = await getAllSong(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      singerId
    );
    if (result?.data?.success) {
      dispatch(setListSongPlaying(result?.data?.payload?.song));
    }
  };

  const getSongList = async () => {
    try {
      const result = await getAllSong(
        PAGE_LIMIT,
        page,
        undefined,
        undefined,
        undefined,
        singerId
      );
      if (result?.data?.success) {
        setSongList(result?.data?.payload?.song);
        setTotalPage(Math.ceil(result?.data?.payload?.totalItem / PAGE_LIMIT));
      }
    } catch (error) {
      console.log("get singer song error >>> ", error);
    }
  };

  useEffect(() => {
    getSongList();
  }, [page]);

  return (
    <div className="singer-song">
      <div className="title">Danh sách nhạc</div>
      <div className="one-music-songs-area mb-70 mt-30">
        <div className="row">
          {songList?.map((item, index) => {
            return (
              <div className="col-12" key={`song-item-${index}`}>
                <div className="single-song-area mb-30 d-flex align-items-end">
                  <div
                    className="song-thumbnail"
                    style={{
                      width: "118px",
                      height: "118px",
                      border: "0.5px solid gray",
                      maxWidth: "118px",
                    }}
                  >
                    <img
                      src={item?.avatar}
                      alt=""
                      style={{ width: "118px", height: "118px" }}
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
                        <p>{item?.name}</p>
                      </div>
                      <div className="singer-name">
                        <p>
                          {item?.singer?.length
                            ? item?.singer?.map((it) => it?.name).join(", ")
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
                            if (!listSongPlaying?.length || listType?.type !== 'singer-song') {
                              setAllSongPlaying();
                              dispatch(
                                setListType({
                                  type: "singer-song",
                                  ...listType
                                })
                              );
                            }

                            dispatch(
                              setSongPlaying({ ...item, playing: true })
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
                      <a className="btn oneMusic-btn">Sau</a>
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
    </div>
  );
}
