import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSong, getHotSongList } from "../../../services/song";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../slices/songSlice";
import PlayMusicIcon from "../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../assets/image/stop-music.svg";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import PlayIcon from "../../../assets/image/play-music.svg";
import StopIcon from "../../../assets/image/stop-music.svg";

export default function HotSong() {
  const [listSong, setListSong] = useState([]);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const navigate = useNavigate();
  const { listType } = useSelector(songData);
  const { listSongPlaying } = useSelector(songData);

  const getHotSong = async () => {
    try {
      const result = await getHotSongList();
      if (result?.data?.success) {
        setListSong(result?.data?.payload);
      }
    } catch (error) {
      console.log("get hot song error >>> ", error);
    }
  };

  useEffect(() => {
    getHotSong();
  }, []);

  return (
    <div style={{ marginBottom: "100px" }}>
      <section
        className="breadcumb-area bg-img bg-overlay"
        style={{ backgroundImage: "url(img/bg-img/breadcumb3.jpg)" }}
      >
        <div className="bradcumbContent">
          <h2>Top 100</h2>
        </div>
      </section>

      <div className="newsong-player-button">
        <button
          onClick={() => {
            if (
              listType?.type !== "hot-song" ||
              (listType?.type === "hot-song" && listType?.id !== "hot-song")
            ) {
              dispatch(setListSongPlaying(listSong));
              dispatch(
                setListType({
                  type: "hot-song",
                  id: "hot-song",
                  playing: true,
                })
              );
            }

            if (listType?.type === "hot-song" && listType?.id === "hot-song") {
              if (listType?.playing) {
                dispatch(
                  setListType({
                    type: "hot-song",
                    id: "hot-song",
                    playing: false,
                  })
                );
                dispatch(setSongState(false));
              } else {
                dispatch(
                  setListType({
                    type: "hot-song",
                    id: "hot-song",
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
            {listType?.type === "hot-song" &&
            listType?.id === "hot-song" &&
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
        <div className="container">
          <div className="row">
            {listSong?.map((item, index) => {
              return (
                <div className="col-12">
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
                            onClick={() => navigate(`/song/${item?._id}`)}
                            style={{ cursor: "pointer" }}
                          >
                            {item?.name}
                          </p>
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
                              if (listType?.playing) {
                                dispatch(
                                  setListType({
                                    type: "hot-song",
                                    id: "hot-song",
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
                                listType?.type === "hot-song" &&
                                listType?.id === "hot-song"
                              ) {
                                dispatch(
                                  setListType({
                                    type: "hot-song",
                                    id: "hot-song",
                                    playing: true,
                                  })
                                );
                              }

                              if (!listSongPlaying?.length || listType?.type !== 'hot-song') {
                                dispatch(setListSongPlaying(listSong));
                                dispatch(
                                  setListType({
                                    type: "hot-song",
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
          </div>
        </div>
      </div>
    </div>
  );
}
