import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Add Candidate page at /candidates/add", () => {
  render(<App />);
  expect(screen.getByText(/add candidate/i)).toBeInTheDocument();
});
