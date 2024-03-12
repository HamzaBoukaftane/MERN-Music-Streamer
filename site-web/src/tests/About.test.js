import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "../pages/About";

describe("About tests", () => {
  it("should render About page", async () => {
    const view = render(<About />, { wrapper: BrowserRouter });
    expect(view.getByText("PolyPlay")).toBeInTheDocument();
  });
});
