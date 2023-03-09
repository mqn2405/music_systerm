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

export default function Chucnang() {
const [listHit, setListHit] = useState([]);
   return (
    <p>Chucnang</p>
   ) 
}
