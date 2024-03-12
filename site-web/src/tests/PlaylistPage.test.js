import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SERVER_URL } from "../assets/js/consts";
import PlaylistContext from "../contexts/PlaylistContext";

import Playlist from "../pages/Playlist";

const customRender = (ui, { providerProps }) => {
  return render(<PlaylistContext.Provider {...providerProps}>{ui}</PlaylistContext.Provider>, {
    wrapper: BrowserRouter,
  });
};

jest.mock("../components/Song", () => () => {
  return <p className="mock-song"> Test-Song</p>;
});

describe("Playlist Page tests", () => {
  let songs;
  let playlist;
  let providerProps;
  beforeEach(() => {
    playlist = {
      id: "a",
      name: "Test",
      description: "Test Description",
      thumbnail: "abc",
      songs: [{ id: 0 }, { id: 1 }],
    };
    songs = [
      { id: 0, name: "Test", genre: "Rock", artist: "Test Artist", liked: false },
      { id: 1, name: "Test2", genre: "Classis", artist: "Test Artist2", liked: true },
    ];
    providerProps = {
      value: {
        dispatch: jest.fn(() => {}),
        api: {
          getPlaylistById: jest.fn(async () => playlist),
          fetchSong: jest.fn(async () => songs[0]),
        },
      },
    };
  });

  it("should render Playlist page with 2 songs and playlist information", async () => {
    const view = customRender(<Playlist />, { providerProps });
    await waitFor(() => view.getAllByText("Test-Song"));
    const songs = document.getElementsByClassName("mock-song");
    expect(songs.length).toBe(2);

    expect(document.getElementById("playlist-title").textContent).toBe(playlist.name);
    expect(document.getElementById("playlist-img").src).toBe(`${SERVER_URL}/${playlist.thumbnail}`);
  });

  it("should render Playlist with a link to /create_playlist", async () => {
    const view = customRender(<Playlist />, { providerProps });
    await waitFor(() => view.getAllByText("Test-Song"));
    const link = document.getElementById("playlist-edit");
    expect(link.href.includes(`/create_playlist`)).toBeTruthy();
  });
});
