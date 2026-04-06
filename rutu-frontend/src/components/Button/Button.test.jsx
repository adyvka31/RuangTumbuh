import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Komponen Button", () => {
  it("harus merender teks (children) dengan benar", () => {
    render(<Button>Simpan Data</Button>);
    expect(screen.getByText("Simpan Data")).toBeInTheDocument();
  });

  it("harus memanggil fungsi onClick saat ditekan", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    fireEvent.click(screen.getByText("Klik Saya"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("tidak boleh memanggil fungsi onClick jika tombol didisable", () => {
    const handleClick = vi.fn();

    render(
      <Button disabled={true} onClick={handleClick}>
        Tombol Mati
      </Button>,
    );

    const buttonElement = screen.getByText("Tombol Mati");

    expect(buttonElement).toBeDisabled();

    fireEvent.click(buttonElement);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
