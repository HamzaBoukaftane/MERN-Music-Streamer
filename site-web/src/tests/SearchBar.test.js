import { fireEvent, render } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar tests", () => {
  it("should render SearchBar", () => {
    render(<SearchBar handleSearch={() => {}} />);
    const searchBar = document.getElementById("search-bar");
    expect(searchBar).toBeInTheDocument();
  });

  it("should call handleSearch on click", () => {
    const handleMock = jest.fn((e) => {
      e.preventDefault();
    });
    render(<SearchBar handleSearch={handleMock} />);

    const button = document.getElementById("search-btn");
    fireEvent.click(button);

    expect(handleMock).toHaveBeenCalled();
  });

  it("should call handleSearch with correct search query and exact search = true", () => {
    const handleMock = jest.fn((e) => {
      e.preventDefault();
    });
    const searchQuery = "Co";
    render(<SearchBar handleSearch={handleMock} />);
    const textInput = document.getElementById("search-input");
    fireEvent.change(textInput, { target: { value: searchQuery } });
    const exactInput = document.getElementById("exact-search");
    fireEvent.click(exactInput);

    const button = document.getElementById("search-btn");
    fireEvent.click(button);

    expect(handleMock.mock.calls[0][1]).toBe("Co");
    expect(handleMock.mock.calls[0][2]).toBe(true);
  });

  it("should call handleSearch with correct search query and exact search = false", () => {
    const handleMock = jest.fn((e) => {
      e.preventDefault();
    });
    const searchQuery = "Co";
    render(<SearchBar handleSearch={handleMock} />);
    const textInput = document.getElementById("search-input");
    fireEvent.change(textInput, { target: { value: searchQuery } });

    const button = document.getElementById("search-btn");
    fireEvent.click(button);

    expect(handleMock.mock.calls[0][1]).toBe("Co");
    expect(handleMock.mock.calls[0][2]).toBe(false);
  });
});
