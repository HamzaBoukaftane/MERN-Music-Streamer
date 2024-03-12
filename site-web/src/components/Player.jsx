/*
* This JSX file contains the Player
* component.
* file Player.jsx
* Authors Hamza Boukaftane and Arman Lidder
* date     2  april 2023
* Modified 11 april 2023
*/

import React, { useContext, useState, useEffect } from "react";
import { ACTIONS } from "../reducers/reducer";
import { formatTime } from "../assets/js/utils";
import { SHORTCUTS, SKIP_TIME } from "../assets/js/consts";
import PlaylistContext from "../contexts/PlaylistContext";

export default function Player() {

  const shortcuts = new Map();
  const { state, dispatch } = useContext(PlaylistContext);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [timeLine, setTimeLine] = useState(0);

  const playSong = () => {
    dispatch({ type: ACTIONS.PLAY, payload: { index: -1 } });
  };

  const playNextSong = () => { 
    dispatch({ type: ACTIONS.NEXT});
  };

  const playPreviousSong = () => {
    dispatch({ type: ACTIONS.PREVIOUS});
  };

  const seek = (newTime) => {
    dispatch({ type: ACTIONS.SEEK, payload: { time: newTime } });
  };

  const scrubTime = (delta) => { 
    dispatch({ type: ACTIONS.SCRUB, payload: { delta: delta } });
  };

  const muteToggle = () => {
    dispatch({ type: ACTIONS.MUTE });
  };

  const shuffleToggle = () => {
    dispatch({ type: ACTIONS.SHUFFLE });
  };

  const shortcutHandler = (event) => {
    if (shortcuts.has(event.key)) {
      shortcuts.get(event.key)();
    }
  };

  const bindShortcuts = () => {

    shortcuts.set(SHORTCUTS.GO_FORWARD, () => scrubTime(SKIP_TIME));
    shortcuts.set(SHORTCUTS.GO_BACK, () => scrubTime(-SKIP_TIME));
    shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => playSong());
    shortcuts.set(SHORTCUTS.NEXT_SONG, () => playNextSong());
    shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => playPreviousSong());
    shortcuts.set(SHORTCUTS.MUTE, () => muteToggle());

    document.addEventListener("keydown", shortcutHandler);
  };

  useEffect(() => {
    state.audio.addEventListener("timeupdate", () => {
      const position = (100 * state.audio.currentTime) / state.audio.duration;
      setCurrentTime(formatTime(state.audio.currentTime));
      setTimeLine(!isNaN(state.audio.duration) ? position : 0);
    });

    state.audio.addEventListener("ended", () => {
      playNextSong();
    });

    bindShortcuts();

    return () => {
      document.removeEventListener("keydown", shortcutHandler);
      dispatch({ type: ACTIONS.STOP });
    };
  }, []);
  return (
    <>
      <div id="now-playing">On joue : {state.currentSong}</div>
      <div id="controls" className="flex-column">
        <section id="buttons-container" className="flex-row">
          <button
            className="control-btn fa fa-2x fa-arrow-left"
            id="previous"
            onClick={() => { 
              playPreviousSong();
            }}
          ></button>
          <button
            className={`control-btn fa fa-2x ${state.audio.paused ? "fa-play" : "fa-pause"}`}
            id="play"
            onClick={() => {
              playSong();
            }}
          ></button>
          <button
            className="control-btn fa fa-2x fa-arrow-right"
            id="next"
            onClick={() => { 
              playNextSong();
            }}
          ></button>
          <button
            className={`${state.shuffle ? "control-btn-toggled" : ""} control-btn fa fa-2x fa-shuffle`}
            id="shuffle"
            onClick={() => { 
              shuffleToggle();
            }}
          ></button>
          <button
            className={`control-btn fa fa-2x ${state.mute ? "fa-volume-mute" : "fa-volume-high"}`}
            id="mute"
            onClick={() => { 
              muteToggle();
            }}
          ></button>
        </section>
        <section id="timeline-container" className="flex-row">
          <span id="timeline-current">{currentTime}</span>
          <input
            id="timeline"
            type="range"
            max="100"
            value={timeLine}
            onInput={(e) => {
              seek(e.target.value);
            }}
          />
          <span id="timeline-end">{state.audio.duration ? formatTime(state.audio.duration) : "5:00"}</span>
        </section>
      </div>
    </>
  );
}
