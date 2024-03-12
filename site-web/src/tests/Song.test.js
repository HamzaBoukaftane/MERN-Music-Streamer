import { fireEvent, render } from "@testing-library/react";
import PlaylistContext from "../contexts/PlaylistContext";

import Song from "../components/Song";
import { ACTIONS } from "../reducers/reducer";

const customRender = (ui, { providerProps }) => {
  return render(<PlaylistContext.Provider {...providerProps}>{ui}</PlaylistContext.Provider>);
};

describe("Song tests", () => {
  let song;
  let providerProps;
  beforeEach(() => {
    song = { id: 1, name: "Test", genre: "Rock", artist: "Test Artist", liked: false };
    providerProps = {
      value: {
        dispatch: jest.fn(() => {}),
        api: {
          updateSong: jest.fn(() => {}),
        },
      },
    };
  });
  it("should render Song", () => {
    const view = customRender(<Song song={song} />, { providerProps });
    expect(view.getByText(`${song.name}`)).toBeInTheDocument();
    expect(view.getByText(`${song.genre}`)).toBeInTheDocument();
    expect(view.getByText(`${song.artist}`)).toBeInTheDocument();
  });

  it("should call api.updateSong with clicking on button", () => {
    customRender(<Song song={song} />, { providerProps });
    const button = document.querySelector(".fa-heart");
    fireEvent.click(button);
    expect(providerProps.value.api.updateSong).toHaveBeenCalled();
  });

  it("should not call api.updateSong with clicking on button if created with index", () => {
    customRender(<Song song={song} index={2} />, { providerProps });
    const button = document.querySelector(".fa-heart");
    fireEvent.click(button);
    expect(providerProps.value.api.updateSong).not.toHaveBeenCalled();
  });

  it("should call dispatch with clicking on the whole section", () => {
    customRender(<Song song={song} index={2} />, { providerProps });
    const section = document.querySelector(".song-item");
    fireEvent.click(section);
    expect(providerProps.value.dispatch).toHaveBeenCalled();
    expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.PLAY, payload: { index: 1 } });
  });

  it("should not call dispatch with clicking on the whole section if there was no index", () => {
    customRender(<Song song={song} />, { providerProps });
    const section = document.querySelector(".song-item");
    fireEvent.click(section);
    expect(providerProps.value.dispatch).not.toHaveBeenCalled();
  });
});
