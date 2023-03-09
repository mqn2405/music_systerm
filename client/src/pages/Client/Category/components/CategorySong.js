import React, { useEffect, useState } from "react";
import { getCategorySong } from "../../../../services/category";
import PlayMusicIcon from "../../../../assets/image/play-music.svg";
import StopMusicIcon from "../../../../assets/image/stop-music.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setListSongPlaying,
  setListType,
  setSongPlaying,
  setSongState,
  songData,
} from "../../../../slices/songSlice";
import { useNavigate } from "react-router-dom";

export default function CategorySong() {
  const [categorySong, setCategorySong] = useState([]);
  const dispatch = useDispatch();
  const { song } = useSelector(songData);
  const navigate = useNavigate();
  const { listSongPlaying } = useSelector(songData);
  const { listType } = useSelector(songData);

  const getSong = async () => {
    try {
      const result = await getCategorySong();
      if (result?.data?.success) {
        setCategorySong(result?.data?.payload);
      }
    } catch (error) {
      console.log("category song error >>> ", error);
    }
  };

  useEffect(() => {
    getSong();
  }, []);

  return (
    <div className="category-song">
      {categorySong
        ?.filter((i) => i?.song?.length)
        ?.map((item, index) => {
          return (
            <div key={`category-song-${index}`}>
              <div
                className="category-title"
                style={{ marginTop: index > 1 ? "20px" : 0 }}
              >
                {item?.name}
              </div>
              <div className="category-song-list">
                {item?.song?.map((it, id) => {
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
                                  if (!listSongPlaying?.length || listType?.type !== `category-song-${item?._id}`) {
                                    dispatch(setListSongPlaying(item?.song));
                                    dispatch(
                                      setListType({
                                        type: `category-song-${item?._id}`,
                                        ...listType
                                      })
                                    );
                                  }

                                  dispatch(
                                    setSongPlaying({ ...it, playing: true })
                                  );
                                } else {
                                  if (song?.playing) {
                                    dispatch(setSongState(false));
                                  } else {
                                    if (!listSongPlaying?.length || listType?.type !== `category-song-${item?._id}`) {
                                      dispatch(setListSongPlaying(item?.song));
                                      dispatch(
                                        setListType({
                                          type: `category-song-${item?._id}`,
                                          ...listType
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
                          <p style={{ fontWeight: 700, fontSize: "16px", cursor: 'pointer' }} onClick={() => navigate(`/song/${it?._id}`)}>
                            {it?.name}
                          </p>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
