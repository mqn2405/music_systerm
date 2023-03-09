import React, { useState, useRef } from "react";
import TimeSlider from "react-input-slider";

import "../style.scss";
import PauseIcon from "@mui/icons-material/PauseCircleOutline";
import PlayIcon from "@mui/icons-material/PlayCircleOutline";
import CustomModal from "../../../../components/CustomModal";
import LoadingButton from "@mui/lab/LoadingButton";

const PlayMusicModal = ({ visible, onClose, musicData }) => {
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlay, setPlay] = useState(false);

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
    if (isPlay) audioRef.current.play();
  };

  const handlePausePlayClick = () => {
    if (isPlay) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlay(!isPlay);
  };

  const handleTimeSliderChange = ({ x }) => {
    audioRef.current.currentTime = x;
    setCurrentTime(x);

    if (!isPlay) {
      setPlay(true);
      audioRef.current.play();
    }
  };

  return (
    <CustomModal
      visible={visible}
      onClose={() => onClose()}
      title={"Play song"}
      content={
        <div className="playmusic-modal">
          <div className="App">
            <img className="Song-Thumbnail" src={musicData?.avatar} alt="tet" />
            <h2 className="Song-Title">{musicData?.name}</h2>
            <p className="Singer">
              {musicData?.singer?.length
                ? musicData?.singer?.map((item) => item.name).join(",")
                : ""}
            </p>
            <div className="Control-Button-Group">
              <div className="Pause-Play-Button" onClick={handlePausePlayClick}>
                {isPlay ? <PauseIcon /> : <PlayIcon />}
              </div>
            </div>
            <TimeSlider
              axis="x"
              xmax={duration}
              x={currentTime}
              onChange={handleTimeSliderChange}
              styles={{
                track: {
                  backgroundColor: "#e3e3e3",
                  height: "2px",
                },
                active: {
                  backgroundColor: "#333",
                  height: "2px",
                },
                thumb: {
                  marginTop: "-3px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#333",
                  borderRadius: 0,
                },
              }}
            />
            <audio
              ref={audioRef}
              src={musicData?.link}
              onLoadedData={handleLoadedData}
              onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
              onEnded={() => setPlay(false)}
            />
          </div>
        </div>
      }
      action={
        <LoadingButton
          autoFocus
          onClick={async () => {
            onClose();
          }}
        >
          Close
        </LoadingButton>
      }
    />
  );
};

export default PlayMusicModal;
