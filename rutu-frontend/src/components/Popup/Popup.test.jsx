import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Popup } from "./Popup";

describe("Komponen Popup", () => {
  it("TIDAK boleh dirender di layar jika prop isOpen bernilai false", () => {
    render(
      <Popup
        isOpen={false}
        title="Pesan Rahasia"
        description="Ini tidak boleh terlihat"
        buttonText="OK"
      />,
    );

    expect(screen.queryByText("Pesan Rahasia")).not.toBeInTheDocument();
  });

  it("harus tampil dengan judul, deskripsi, dan teks tombol yang benar saat isOpen true", () => {
    render(
      <Popup
        isOpen={true}
        title="Sukses Menyimpan"
        description="Data profil kamu sudah diperbarui."
        buttonText="Tutup Jendela"
      />,
    );

    expect(screen.getByText("Sukses Menyimpan")).toBeInTheDocument();
    expect(
      screen.getByText("Data profil kamu sudah diperbarui."),
    ).toBeInTheDocument();
    expect(screen.getByText("Tutup Jendela")).toBeInTheDocument();
  });

  it("harus memanggil fungsi onAction saat tombol di dalam popup ditekan", () => {
    const mockAction = vi.fn();

    render(
      <Popup
        isOpen={true}
        title="Konfirmasi"
        buttonText="Lanjutkan"
        onAction={mockAction}
      />,
    );

    const actionButton = screen.getByText("Lanjutkan");
    fireEvent.click(actionButton);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
