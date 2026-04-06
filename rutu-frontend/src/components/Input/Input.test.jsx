import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Komponen Input", () => {
  it("harus merender label dan input text dengan benar", () => {
    render(<Input id="nama" name="nama" label="Nama Lengkap" type="text" />);

    expect(screen.getByText("Nama Lengkap")).toBeInTheDocument();

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("harus menampilkan pesan error jika prop errorMessage diberikan", () => {
    render(
      <Input
        id="email"
        label="Email"
        errorMessage="Format email tidak valid"
      />,
    );

    expect(screen.getByText("Format email tidak valid")).toBeInTheDocument();
  });

  it("harus merender elemen <textarea> jika prop isTextarea bernilai true", () => {
    render(<Input id="bio" label="Biografi" isTextarea={true} />);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement.tagName).toBe("TEXTAREA");
  });

  it("harus bisa mengubah tipe password menjadi text saat icon mata diklik", () => {
    render(<Input id="password" label="Kata Sandi" type="password" />);

    const inputElement = screen.getByLabelText("Kata Sandi");
    expect(inputElement).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(inputElement).toHaveAttribute("type", "text");
  });
});
