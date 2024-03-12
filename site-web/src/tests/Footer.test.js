import { render } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Footer from "../components/Footer";

jest.mock("../components/Player", () => () => {
  return <p>Test-Player</p>;
});
describe("Footer tests", () => {
  beforeEach(() => {});
  it("should render Footer", () => {
    const view = render(<Footer />, { wrapper: BrowserRouter });
    expect(view.getByText(/Choisir une playlist à travers/i)).toBeInTheDocument();
  });

  it("should render Player component", () => {
    const playlistRoute = "/playlist";
    const view = render(
      <MemoryRouter initialEntries={[playlistRoute]}>
        <Footer />
      </MemoryRouter>
    );
    expect(view.getByText(/Test-Player/i)).toBeInTheDocument();
  });
});
