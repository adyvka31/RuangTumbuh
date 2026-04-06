import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "./ProfilePage";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

global.fetch = vi.fn();

describe("Halaman ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() =>
      JSON.stringify({ id: "user-123", name: "Rafif Sava" }),
    );

    // PERBAIKAN: Gunakan mockResolvedValue (tanpa Once) agar aman dari re-render
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        name: "Rafif Sava",
        email: "rafif@example.com",
        timeBalance: 500,
        stats: { learningMinutes: 120, teachingSessions: 5 },
      }),
    });
  });

  it("harus merender halaman dan menampilkan nama user dari backend", async () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Profil Saya")).toBeInTheDocument();

      // Menggunakan getAllByText karena nama "Rafif Sava" muncul di Topbar dan di Konten Profil
      const nameElements = screen.getAllByText("Rafif Sava");
      expect(nameElements.length).toBeGreaterThan(0);

      expect(screen.getByText("rafif@example.com")).toBeInTheDocument();
    });
  });
});
