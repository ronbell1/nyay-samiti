import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { cookies } from "next/headers";
import Google from "@auth/core/providers/google";
import { BetterAuthConfig } from "@better-auth/server";
 
export const auth = betterAuth({
      socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    emailAndPassword: {
    enabled: true, 
  }, 
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
       plugins: [nextCookies()] 
});
export function isAuthenticated(): boolean {
  const token = cookies().get("auth_token")?.value;
  return !!token;
}
