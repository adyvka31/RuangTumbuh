import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SchedulePage from "./SchedulePage";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});
global.fetch = vi.fn();

describe("Halaman SchedulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => JSON.stringify({ id: "user-123" }));
  });

  it("harus merender kalender jadwal", async () => {
    // Tirukan balikan list jadwal kosong
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <BrowserRouter>
        <SchedulePage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Cek tulisan dari banner Jadwal Belajar
      expect(screen.getByText(/Atur Kegiatan Kamu/i)).toBeInTheDocument();
      // Pastikan kalender muncul dengan mengecek keberadaan hari
      expect(screen.getByText("Sun")).toBeInTheDocument();
      expect(screen.getByText("Mon")).toBeInTheDocument();
    });
  });
});
