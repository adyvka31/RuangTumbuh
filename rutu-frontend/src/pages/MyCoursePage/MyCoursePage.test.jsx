import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import MyCoursePage from "./MyCoursePage";
import axios from "axios";

// Mock Axios
vi.mock("axios");

// Mock Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

// Mock Fetch
global.fetch = vi.fn();

describe("Halaman MyCoursePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => JSON.stringify({ id: "user-123" }));

    // PERBAIKAN: Mock Fetch untuk API Booking
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    // PERBAIKAN: Mock Axios untuk API Course
    axios.get.mockResolvedValue({
      data: { data: [], meta: { totalItems: 0 } },
    });
  });

  it("harus merender tab kelas saya tanpa error jaringan", async () => {
    render(
      <BrowserRouter>
        <MyCoursePage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const elements = screen.getAllByText(/Kursus Saya/i);
      expect(elements.length).toBeGreaterThan(0); // Pastikan minimal ada 1 yang dirender
    });
  });
});
