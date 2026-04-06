import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import axios from "axios";

// MOCKING (Sama seperti Login)
vi.mock("axios");
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Komponen RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>,
    );
  };

  it("harus menampilkan pesan error frontend jika konfirmasi password tidak sama", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123" },
    });
    // Sengaja dibuat berbeda
    fireEvent.change(screen.getByLabelText("Confirm"), {
      target: { value: "Berbeda123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    // Karena ini error frontend (sebelum menembak API), kita tidak perlu nge-mock axios di test ini
    await waitFor(() => {
      expect(
        screen.getByText("Password dan Konfirmasi Password harus sama persis."),
      ).toBeInTheDocument();
    });

    // Pastikan API memang tidak dipanggil
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("harus menampilkan pesan error jika format nama salah (kurang dari 2 kata)", async () => {
    renderWithRouter();

    // Isi nama dengan 1 kata saja
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Budi" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "budi@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("Nama lengkap harus terdiri dari 2 hingga 5 kata."),
      ).toBeInTheDocument();
    });
  });

  it("harus menembak API backend dan menampilkan popup jika semua validasi lolos", async () => {
    // Siapkan mock axios untuk mengembalikan status sukses
    axios.post.mockResolvedValueOnce({ data: { message: "Berhasil" } });

    renderWithRouter();

    // Isi form dengan data yang benar (Lolos regex)
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@email.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "KuatBanget123!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm"), {
      target: { value: "KuatBanget123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      // Pastikan API dipanggil dengan endpoint yang benar
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5001/api/auth/register",
        {
          name: "John Doe",
          email: "john@email.com",
          password: "KuatBanget123!",
        },
      );

      // Pastikan popup sukses muncul
      expect(screen.getByText("Akun Dibuat!")).toBeInTheDocument();
    });
  });
});
