import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SearchPage from "./SearchPage";
import axios from "axios";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

describe("Halaman SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => JSON.stringify({ id: "user-123" }));
  });

  it("harus merender input pencarian dan filter", async () => {
    axios.get.mockResolvedValue({
      data: { data: [] },
    });

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Pastikan ada input pencarian (placeholder biasanya 'Cari kelas')
      const searchInputs = screen.getAllByRole("textbox");
      expect(searchInputs.length).toBeGreaterThan(0);
    });
  });
});
