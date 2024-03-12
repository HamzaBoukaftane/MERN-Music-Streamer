/*
* This JSX file contains the Song
* component.
* file Song.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/

import React, { useState, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";

import PlaylistContext from "../contexts/PlaylistContext";

export default function Song({ song, index }) {
  const { dispatch } = useContext(PlaylistContext);
  const [liked, setLiked] = useState(song.liked);
  const api = useContext(PlaylistContext).api;
  const toggleLike = () => {
    api.updateSong(song.id);
    setLiked(!liked);
   };

  const playSong = () => {
    dispatch({ type: ACTIONS.PLAY, payload: { index: index - 1 } });
  };
  return (
    <section
      className="song-item flex-row"
      onClick={() => { 
        if (index) {
          playSong();
        }
      }}
    >
      {index ? <span>{index}</span> : <></>}
      <p>{song.name}</p>
      <p>{song.genre}</p>
      <p>{song.artist}</p>
      <button
        className={`${liked ? "fa" : "fa-regular"} fa-2x fa-heart`}
        onClick={() => { 
          if (!index) {
            toggleLike();
          }
        }}
      ></button>
    </section>
  );
}
