import * as authSchemas from "./auth.schema.js";

// Ambil skema dengan aman, entah Rollup membungkusnya di .default atau langsung
const schemas = authSchemas.default || authSchemas;

// Export ulang secara Named Exports untuk Frontend
export const loginPayloadSchema = schemas.loginPayloadSchema;
export const registerPayloadSchema = schemas.registerPayloadSchema;
