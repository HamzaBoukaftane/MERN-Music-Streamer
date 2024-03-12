/*
* This JSX file contains the Playlist
* component.
* file Playlist.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/

import React, { useState, useEffect, useContext } from "react";
import { ACTIONS } from "../reducers/reducer";
import PlaylistContext from "../contexts/PlaylistContext";
import Song from "../components/Song";
import { SERVER_URL } from "../assets/js/consts";
import { NavLink, useParams } from "react-router-dom";

export default function Playlist() {
  const params = useParams();
  const [playlist, setPlaylist] = useState({});
  const [songs, setSongs] = useState([]);
  const { dispatch, api } = useContext(PlaylistContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const playlist = await api.getPlaylistById(params.id);
    const songsToLoad = await Promise.all(
      playlist.songs.map(async (song) => {
        return await api.fetchSong(song.id);
      })
    );
    setPlaylist(playlist);
    setSongs(songsToLoad);
    dispatch({ type: ACTIONS.LOAD, payload: { songs: songsToLoad } });
  };

  return (
    <main id="main-area" className="flex-column">
      <div id="songs-list">
        <header id="playlist-header" className="flex-row">
          <img
            id="playlist-img"
            width="80px"
            height="80px"
            alt=""
            src={playlist.thumbnail ? `${SERVER_URL}/${playlist.thumbnail}` : ""}
          />
          <h1 id="playlist-title">{playlist.name}</h1>
          <NavLink id="playlist-edit" to={`/create_playlist/${params.id}`}>
            <i className="fa fa-2x fa-pencil"></i>
          </NavLink>
        </header>
        <section id="song-container" className="flex-column">
          {songs.map((sItem, idx) => (
            <Song key={`${sItem.id}`} song={sItem} index={idx+1}/> //
          ))}
        </section>
      </div>
    </main>
  );
}
