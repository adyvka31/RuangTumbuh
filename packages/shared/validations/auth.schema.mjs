// Import seluruh objek dari file CommonJS
import authSchemas from "./auth.schema.js";

// Export ulang secara spesifik (Named Exports) untuk melayani Vite/Rollup di Frontend
export const loginPayloadSchema = authSchemas.loginPayloadSchema;
export const registerPayloadSchema = authSchemas.registerPayloadSchema;
