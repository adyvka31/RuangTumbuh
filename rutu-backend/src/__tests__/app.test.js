const request = require("supertest");
const app = require("../app"); 

describe("Pengujian Konfigurasi App Express", () => {
  it("Harus mengembalikan status 404 jika rute tidak ditemukan", async () => {
    const response = await request(app).get("/api/rute-ngasal-yang-tidak-ada");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "API Endpoint tidak ditemukan.",
    );
  });
});
