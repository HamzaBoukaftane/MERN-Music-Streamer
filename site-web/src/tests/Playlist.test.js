import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Playlist from "../components/Playlist";

describe("Playlist tests", () => {
  it("should render Playlist", () => {
    const playlist = { name: "Test", description: "Test Description", thumbnail: "" };
    const view = render(<Playlist playlist={playlist} />, { wrapper: BrowserRouter });
    expect(view.getByText(`${playlist.name}`)).toBeInTheDocument();
    expect(view.getByText(`${playlist.description}`)).toBeInTheDocument();
  });

  it("should render a NavLink with reference to playlist page", () => {
    const playlist = { id: "abc", name: "Test", description: "Test Description", thumbnail: "" };
    render(<Playlist playlist={playlist} />, { wrapper: BrowserRouter });
    const anchor = document.querySelector("a");
    expect(anchor.href).toContain(`playlist/${playlist.id}`);
  });
});
