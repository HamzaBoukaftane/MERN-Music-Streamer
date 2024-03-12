import { fireEvent, render, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import PlaylistContext from "../contexts/PlaylistContext";

import CreatePlaylist from "../pages/CreatePlaylist";

const customRender = (ui, { providerProps }) => {
  return render(<PlaylistContext.Provider {...providerProps}>{ui}</PlaylistContext.Provider>, {
    wrapper: BrowserRouter,
    route: "/create_playlist/abc",
  });
};

const customRenderWithRoute = (ui, { providerProps }) => {
  return render(
    <PlaylistContext.Provider {...providerProps}>
      <MemoryRouter initialEntries={["/create_playlist/abc"]}>
        <Routes>
          <Route path="/create_playlist/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </PlaylistContext.Provider>
  );
};

jest.mock("../components/Playlist", () => () => {
  return <p className="mock-playlist">Test-Playlist</p>;
});

jest.mock("../assets/js/utils", () => ({
  ...jest.requireActual("../assets/js/utils"),
  loadForEdit: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("CreatePlaylist tests", () => {
  let songs;
  let playlist;
  let providerProps;
  beforeEach(() => {
    playlist = {
      id: "a",
      name: "Test",
      description: "Test Description",
      thumbnail: "a",
      songs: [{ id: 0 }, { id: 1 }],
    };
    songs = [
      { id: 0, name: "Test", genre: "Rock", artist: "Test Artist", liked: false },
      { id: 1, name: "Test2", genre: "Classis", artist: "Test Artist2", liked: true },
    ];
    providerProps = {
      value: {
        api: {
          getPlaylistById: jest.fn(async () => playlist),
          getAllSongs: jest.fn(async () => songs),
          updatePlaylist: jest.fn(() => {}),
          addNewPlaylist: jest.fn(() => {}),
          deletePlaylist: jest.fn(() => {}),
        },
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render CreatePlaylist", async () => {
    customRender(<CreatePlaylist />, { providerProps });
    await waitFor(() => document.getElementsByTagName("option"));
    const legends = document.getElementsByTagName("legend");
    expect(legends.length).toBe(2);
  });

  it("should render CreatePlaylist for editing if an id is present in URL", async () => {
    const view = customRenderWithRoute(<CreatePlaylist />, { providerProps });
    await waitFor(() => view.findByText("Modifier la playlist"));
    const modButton = document.getElementById("playlist-submit");
    expect(modButton.value).toBe("Modifier la playlist");
  });

  it("should call updatePlaylist if there is an id", async () => {
    customRenderWithRoute(<CreatePlaylist />, { providerProps });
    await waitFor(() => expect(providerProps.value.api.getPlaylistById).toHaveBeenCalled());
    const modButton = document.getElementById("playlist-submit");
    fireEvent.click(modButton);
    expect(providerProps.value.api.updatePlaylist).toHaveBeenCalled();
  });

  it("should call addNewPlaylist if there is no id", async () => {
    customRender(<CreatePlaylist />, { providerProps });
    await waitFor(() => document.getElementsByTagName("option"));
    const modButton = document.getElementById("playlist-submit");
    const nameInput = document.getElementById("name");
    fireEvent.change(nameInput, { target: { value: "a" } });
    const descriptionInput = document.getElementById("description");
    fireEvent.change(descriptionInput, { target: { value: "b" } });

    fireEvent.click(modButton);
    expect(providerProps.value.api.addNewPlaylist).toHaveBeenCalled();
  });

  it("should add a new field on add-song-btn click", async () => {
    customRender(<CreatePlaylist />, { providerProps });
    await waitFor(() => document.getElementsByTagName("option"));
    const addButton = document.getElementById("add-song-btn");
    fireEvent.click(addButton);
    const songInputs = document.getElementsByClassName("song-input");
    expect(songInputs.length).toBe(2);
  });

  it("should remove a field on button click", async () => {
    customRender(<CreatePlaylist />, { providerProps });
    await waitFor(() => document.getElementsByTagName("option"));
    const addButton = document.getElementById("add-song-btn");
    fireEvent.click(addButton);
    const removeButton = document.getElementsByClassName("fa-minus")[0];
    fireEvent.click(removeButton);
    const songInputs = document.getElementsByClassName("song-input");
    expect(songInputs.length).toBe(1);
  });

  it("should modify song on input change", async () => {
    customRender(<CreatePlaylist />, { providerProps });
    await waitFor(() => document.getElementsByTagName("option"));
    const songInput = document.getElementsByClassName("song-input")[0];
    fireEvent.change(songInput, { target: { value: "New Song" } });
    await waitFor(() => document.getElementsByTagName("option"));
    expect(document.getElementsByClassName("song-input")[0].value).toBe("New Song");
  });

  it("should call deletePlaylist on button click", async () => {
    customRenderWithRoute(<CreatePlaylist />, { providerProps });
    await waitFor(() => expect(providerProps.value.api.getPlaylistById).toHaveBeenCalled());
    const deleteButton = document.getElementById("playlist-delete");
    fireEvent.click(deleteButton);
    expect(providerProps.value.api.deletePlaylist).toHaveBeenCalled();
  });
});
