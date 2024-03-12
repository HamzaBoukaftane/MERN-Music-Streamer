/*
* This JSX file contains the Playlist
* component.
* file Playlist.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/

import React from "react";
import { SERVER_URL } from "../assets/js/consts";
import { NavLink } from "react-router-dom";

export default function Playlist({ playlist }) {
  return (
    <NavLink className="playlist-item flex-column" to={`/playlist/${playlist.id}`}>
      <div className="playlist-preview">
        <img alt="" src={`${SERVER_URL}/${playlist.thumbnail}`} />
        <i className="fa fa-2x fa-play-circle hidden playlist-play-icon"></i>
      </div>
      <p>{playlist.name}</p>
      <p>{playlist.description}</p>
    </NavLink>
  );
}
