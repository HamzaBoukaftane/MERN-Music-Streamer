import { render } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar";

describe("NavBar tests", () => {
  const expectedLinks = ["index", "create_playlist", "about"];

  it("should render NavBar", () => {
    render(<NavBar />, { wrapper: BrowserRouter });
    const navBar = document.getElementById("nav-bar");
    expect(navBar).toBeInTheDocument();
  });

  it("should render 3 NavLinks with corresponding links", () => {
    render(<NavBar />, { wrapper: BrowserRouter });
    const navlinks = document.querySelectorAll("a");
    Array.from(navlinks).forEach((link, index) => {
      expect(link.href.endsWith(expectedLinks[index]));
    });
  });

  it("should render NavBar with index page as active class", () => {
    render(
      <MemoryRouter initialEntries={[`/${expectedLinks[0]}`]}>
        <NavBar />
      </MemoryRouter>
    );
    const activeLink = document.querySelectorAll("a")[0];
    expect(activeLink.classList.value).toBe("active-page");
  });

  it("should render NavBar with create_playlist page as active class", () => {
    render(
      <MemoryRouter initialEntries={[`/${expectedLinks[1]}`]}>
        <NavBar />
      </MemoryRouter>
    );
    const activeLink = document.querySelectorAll("a")[1];
    expect(activeLink.classList.value).toBe("active-page");
  });

  it("should render NavBar with about page as active class", () => {
    render(
      <MemoryRouter initialEntries={[`/${expectedLinks[2]}`]}>
        <NavBar />
      </MemoryRouter>
    );
    const activeLink = document.querySelectorAll("a")[2];
    expect(activeLink.classList.value).toBe("active-page");
  });
});
