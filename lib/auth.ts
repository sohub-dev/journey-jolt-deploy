import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
  ],
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
