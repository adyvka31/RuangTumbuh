import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});
global.fetch = vi.fn();

describe("Halaman DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() =>
      JSON.stringify({ id: "user-123", name: "Rafif" }),
    );
  });

  it("harus merender statistik dashboard tanpa error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        timeBalance: 100,
        learningMinutes: 300,
        upcomingSessions: 2,
        mentoringSessions: [],
      }),
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Pastikan ada teks sambutan atau elemen spesifik dashboard
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
