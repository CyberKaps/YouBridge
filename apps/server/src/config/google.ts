

import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: "http://localhost:4000/api/auth/google/callback",
});
