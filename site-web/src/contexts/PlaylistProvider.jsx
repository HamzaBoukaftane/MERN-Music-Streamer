import React, { useReducer } from "react";
import PlaylistContext from "./PlaylistContext";
import reducer from "../reducers/reducer";
import HTTPManager from "../assets/js/http_manager";

const PlaylistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    songs: [],
    currentSongIndex: 0,
    currentSong: "rien",
    shuffle: false,
    audio: new Audio(),
  });
  const api = new HTTPManager();
  return <PlaylistContext.Provider value={{ state, dispatch, api }}>{children}</PlaylistContext.Provider>;
};

export default PlaylistProvider;
