import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { RegisterForm } from "./RegisterForm";
import api from "@/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/utils/api", () => ({
  default: { post: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogout = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

describe("Komponen RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderWithRouter = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      </QueryClientProvider>,
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
    fireEvent.change(screen.getByLabelText("Confirm"), {
      target: { value: "Berbeda123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password dan Konfirmasi Password harus sama persis."),
      ).toBeInTheDocument();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it("harus menampilkan pesan error jika format nama salah (kurang dari 2 kata)", async () => {
    renderWithRouter();

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
    api.post.mockResolvedValueOnce({ data: { message: "Berhasil" } });

    renderWithRouter();

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
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        name: "John Doe",
        email: "john@email.com",
        password: "KuatBanget123!",
        confirmPassword: "KuatBanget123!",
      });

      expect(screen.getByText("Akun Dibuat!")).toBeInTheDocument();
    });
  });
});
