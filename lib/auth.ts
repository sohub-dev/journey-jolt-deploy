import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { env } from "@/lib/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  trustedOrigins: [env.BETTER_AUTH_URL, "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      onboarding_complete: {
        type: "boolean",
        default: false,
      },
    },
  },
});
