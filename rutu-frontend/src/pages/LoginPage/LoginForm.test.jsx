import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom"; // Wajib karena LoginForm pakai useNavigate dan Link
import { LoginForm } from "./LoginForm";
import axios from "axios";

// 1. MOCKING (Meniru fungsi eksternal)
vi.mock("axios"); // Meniru axios agar tidak menembak API asli
const mockNavigate = vi.fn();

// Meniru react-router-dom untuk mengambil kendali navigasi
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Komponen LoginForm", () => {
  // 2. SETUP SEBELUM TIAP TEST
  beforeEach(() => {
    vi.clearAllMocks(); // Bersihkan memori mock sebelum tiap test mulai
  });

  // Fungsi pembantu agar tidak capek menulis BrowserRouter terus
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>,
    );
  };

  it("harus merender form dengan input email, password, dan tombol submit", () => {
    renderWithRouter();

    // Pastikan elemen dasar UI ada
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("harus menampilkan pesan error merah jika API login gagal", async () => {
    // 3. SKENARIO API GAGAL
    // Kita atur agar axios.post selalu mengembalikan error
    const errorMessage = "Email atau password salah!";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    renderWithRouter();

    // Isi form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "salah@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "salah123" },
    });

    // Klik login
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // 4. WAIT FOR: Tunggu React menyelesaikan proses asynchronous (Promise)
    await waitFor(() => {
      // Pastikan pesan error merah muncul di layar
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("harus menampilkan popup sukses dan redirect jika API login berhasil", async () => {
    // 5. SKENARIO API BERHASIL
    axios.post.mockResolvedValueOnce({
      data: { token: "fake-token", user: { id: 1, name: "Budi" } },
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "benar@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "benar123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      // Pastikan Popup muncul
      expect(screen.getByText("Login Berhasil!")).toBeInTheDocument();
    });
  });
});
