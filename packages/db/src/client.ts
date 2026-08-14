import postgres from "postgres";

const databaseUrl = process.env.SUPABASE_CONNECTION_STRING;

if (!databaseUrl) {
  throw new Error("SUPABASE_CONNECTION_STRING is not configured");
}

export const sql = postgres(databaseUrl, {
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});
