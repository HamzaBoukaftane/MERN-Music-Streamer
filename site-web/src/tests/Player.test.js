import { createEvent, fireEvent, render } from "@testing-library/react";
import PlaylistContext from "../contexts/PlaylistContext";

import Player from "../components/Player";
import { ACTIONS } from "../reducers/reducer";
import { SHORTCUTS, SKIP_TIME } from "../assets/js/consts";

const customRender = (ui, { providerProps }) => {
  return render(<PlaylistContext.Provider {...providerProps}>{ui}</PlaylistContext.Provider>);
};

describe("Player tests", () => {
  let songs;
  let providerProps;
  beforeEach(() => {
    songs = [
      { id: 1, name: "Test" },
      { id: 2, name: "Test2" },
    ];
    providerProps = {
      value: {
        dispatch: jest.fn(() => {}),
        state: { songs, audio: new Audio(), currentSong: songs[0].name, mute: false, shuffle: false },
      },
    };
  });

  describe("Interface changes", () => {
    it("should render Player", () => {
      const view = customRender(<Player />, { providerProps });
      expect(view.getByText(`On joue : ${providerProps.value.state.currentSong}`)).toBeInTheDocument();
    });

    it("should play next song when the audio ends", () => {
      customRender(<Player />, { providerProps });
      const audioElement = providerProps.value.state.audio;
      fireEvent(audioElement, createEvent("ended", audioElement));
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.NEXT });
    });

    it("should modify currentTime and timeLine while audio is playing", () => {
      providerProps.value.state.audio = document.createElement("span"); // besoin d'un element quelconque
      providerProps.value.state.audio.currentTime = 30;
      providerProps.value.state.audio.duration = 60;
      customRender(<Player />, { providerProps });
      const audioElement = providerProps.value.state.audio;
      fireEvent(audioElement, createEvent("timeupdate", audioElement));

      const currentTime = document.getElementById("timeline-current");
      expect(currentTime.textContent).toBe("00:30");
      const timelineInput = document.getElementById("timeline");
      expect(timelineInput.value).toBe("50");
    });

    it("should set timeLine to 0 before audio is loaded", () => {
      providerProps.value.state.audio = document.createElement("span"); // besoin d'un element quelconque
      providerProps.value.state.audio.currentTime = 30;
      providerProps.value.state.audio.duration = "invalid";
      customRender(<Player />, { providerProps });
      const audioElement = providerProps.value.state.audio;
      fireEvent(audioElement, createEvent("timeupdate", audioElement));

      const timelineInput = document.getElementById("timeline");
      expect(timelineInput.value).toBe("0");
    });
  });

  describe("Button changes", () => {
    it("should display play icon by default", () => {
      customRender(<Player />, { providerProps });
      expect(document.getElementsByClassName("fa-play")).toBeTruthy();
    });

    it("should display pause icon if audio.paused is false", () => {
      providerProps.value.state.audio = { paused: false, addEventListener: () => {} };
      customRender(<Player />, { providerProps });
      expect(document.getElementsByClassName("fa-pause")).toBeTruthy();
    });

    it("should display shuffle icon as not toggled by default", () => {
      customRender(<Player />, { providerProps });
      expect(document.getElementById("shuffle").classList.contains("control-btn-toggled")).toBeFalsy();
    });

    it("should display shuffle icon as toggled if state.shuffle is true ", () => {
      providerProps.value.state.shuffle = true;
      customRender(<Player />, { providerProps });
      expect(document.getElementById("shuffle").classList.contains("control-btn-toggled")).toBeTruthy();
    });

    it("should display volume high icon by default", () => {
      customRender(<Player />, { providerProps });
      expect(document.getElementById("mute").classList.contains("fa-volume-high")).toBeTruthy();
    });

    it("should display volume mute icon if state.mute is true ", () => {
      providerProps.value.state.mute = true;
      customRender(<Player />, { providerProps });
      expect(document.getElementById("mute").classList.contains("fa-volume-mute")).toBeTruthy();
    });
  });

  describe("Dispatch actions", () => {
    it("should call dispatch with ACTIONS.PREVIOUS when clicking on previous button", () => {
      customRender(<Player />, { providerProps });
      const button = document.getElementById("previous");
      fireEvent.click(button);
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.PREVIOUS });
    });

    it("should call dispatch with ACTIONS.NEXT when clicking on next button", () => {
      customRender(<Player />, { providerProps });
      const button = document.getElementById("next");
      fireEvent.click(button);
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.NEXT });
    });

    it("should call dispatch with ACTIONS.PLAY when clicking on play button", () => {
      customRender(<Player />, { providerProps });
      const button = document.getElementById("play");
      fireEvent.click(button);
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.PLAY, payload: { index: -1 } });
    });

    it("should call dispatch ACTIONS.SHUFFLE when clicking on shuffle button", () => {
      customRender(<Player />, { providerProps });
      const button = document.getElementById("shuffle");
      fireEvent.click(button);
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.SHUFFLE });
    });

    it("should call dispatch ACTIONS.MUTE when clicking on shuffle button", () => {
      customRender(<Player />, { providerProps });
      const button = document.getElementById("mute");
      fireEvent.click(button);
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.MUTE });
    });

    it("should call dispatch ACTIONS.SEEK when changing the timeline input", () => {
      customRender(<Player />, { providerProps });
      const timeline = document.getElementById("timeline");
      const newTime = "50";
      fireEvent.input(timeline, { target: { valueAsNumber: newTime, value: newTime } });
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.SEEK, payload: { time: newTime } });
    });

    it("should call dispatch ACTIONS.SCRUB with the GO_BACK and GO_FORWARD shortcuts", () => {
      customRender(<Player />, { providerProps });
      fireEvent.keyDown(document, { key: SHORTCUTS.GO_BACK });
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({
        type: ACTIONS.SCRUB,
        payload: { delta: -SKIP_TIME },
      });

      fireEvent.keyDown(document, { key: SHORTCUTS.GO_FORWARD });
      expect(providerProps.value.dispatch).toHaveBeenCalled();
      expect(providerProps.value.dispatch).toHaveBeenCalledWith({
        type: ACTIONS.SCRUB,
        payload: { delta: SKIP_TIME },
      });
    });

    it("should not call dispatch with an invalid shortcut", () => {
      customRender(<Player />, { providerProps });
      fireEvent.keyDown(document, { key: "g" });
      expect(providerProps.value.dispatch).not.toHaveBeenCalled();
    });
  });
});
