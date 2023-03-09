import React from "react";
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
import { useNavigate } from "react-router-dom";

export default function SongList({ songList, countryId }) {
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const navigate = useNavigate();
  const { listSongPlaying } = useSelector(songData);
  const { listType } = useSelector(songData);

  return (
    <div className="country-song">
      <div className="title">Bài hát</div>
      <div className="category-song" style={{ marginTop: "-20px" }}>
        <div
          className="category-song-list"
          style={{ flexWrap: "wrap", gap: "40px" }}
        >
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
                              listType?.type !== `country-song-${countryId}`
                            ) {
                              dispatch(setListSongPlaying(songList));
                              dispatch(
                                setListType({
                                  type: `country-song-${countryId}`,
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
                                listType?.type !== `country-song-${countryId}`
                              ) {
                                dispatch(setListSongPlaying(songList));
                                dispatch(
                                  setListType({
                                    type: `country-song-${countryId}`,
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
      </div>
    </div>
  );
}
