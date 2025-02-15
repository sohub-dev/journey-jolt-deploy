import { type Config } from "drizzle-kit";
import { env } from "./lib/env";

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  out: "./db/migrations",
  tablesFilter: ["journeyjolt_*"],
} satisfies Config;
