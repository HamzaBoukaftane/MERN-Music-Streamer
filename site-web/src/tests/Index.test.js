import { fireEvent, render, waitFor } from "@testing-library/react";
import PlaylistContext from "../contexts/PlaylistContext";

import Index from "../pages/Index";

const customRender = (ui, { providerProps }) => {
  return render(<PlaylistContext.Provider {...providerProps}>{ui}</PlaylistContext.Provider>);
};

jest.mock("../components/Playlist", () => () => {
  return <p className="mock-playlist">Test-Playlist</p>;
});

jest.mock("../components/Song", () => () => {
  return <p className="mock-song">Test-Song</p>;
});

describe("Index tests", () => {
  let songs;
  let playlist;
  let providerProps;
  beforeEach(() => {
    playlist = { id: "a", name: "Test", description: "Test Description", thumbnail: "", songs: [{ id: 0 }, { id: 1 }] };
    songs = [
      { id: 0, name: "Test", genre: "Rock", artist: "Test Artist", liked: false },
      { id: 1, name: "Test2", genre: "Classis", artist: "Test Artist2", liked: true },
    ];
    providerProps = {
      value: {
        api: {
          fetchAllPlaylists: jest.fn(async () => {
            return [playlist];
          }),
          fetchAllSongs: jest.fn(async () => songs),
          search: jest.fn(async () => {
            return {
              playlists: [playlist],
              songs,
            };
          }),
        },
      },
    };
  });

  it("should render Index with a search bar", async () => {
    customRender(<Index />, { providerProps });
    const searchBar = await waitFor(() => document.getElementById("search-bar"));
    expect(searchBar).toBeInTheDocument();
  });

  it("should render Index with 1 playlist", async () => {
    const view = customRender(<Index />, { providerProps });
    await waitFor(() => view.getByText("Test-Playlist"));
    const playlistContainer = document.getElementById("playlist-container");
    expect(playlistContainer).toBeInTheDocument();
    expect(playlistContainer.children.length).toBe(1);
  });

  it("should render Index with no playlists if an error occurs", async () => {
    providerProps.value.api.fetchAllPlaylists = jest.fn(async () => {
      throw new Error();
    });
    const view = customRender(<Index />, { providerProps });
    await waitFor(() => view.getByText("Mes Playlists"));
    const playlistContainer = document.getElementById("playlist-container");
    expect(playlistContainer).toBeInTheDocument();
    expect(playlistContainer.children.length).toBe(0);
  });

  it("should render Index with 2 songs", async () => {
    const view = customRender(<Index />, { providerProps });
    await waitFor(() => view.getAllByText("Test-Song"));
    const songs = document.getElementsByClassName("mock-song");
    expect(songs.length).toBe(2);
  });

  it("should render Index with no songs if an error occurs", async () => {
    providerProps.value.api.fetchAllSongs = jest.fn(async () => {
      throw new Error();
    });
    const view = customRender(<Index />, { providerProps });
    await waitFor(() => view.getByText("Mes Chansons"));
    const songsContainer = document.getElementById("songs-list");
    expect(songsContainer).toBeInTheDocument();
    expect(songsContainer.children.length).toBe(1); // le titre est le 1er enfant de songs-list
  });

  it("handleSearch should be called when clicking on child button", async () => {
    const view = customRender(<Index />, { providerProps });
    fireEvent.click(document.getElementById("search-btn"));
    await waitFor(() => view.getAllByText("Test-Song"));
    expect(providerProps.value.api.search).toHaveBeenCalled();
  });
});
