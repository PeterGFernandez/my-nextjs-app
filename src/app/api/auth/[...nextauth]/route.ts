import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: 'openid profile email schedule::read schedule::create',
          audience: 'org.my-nextjs-app.schedule',
        },
      },
      // Optionally, add more Keycloak-specific config here
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account && account.id_token) {
        token.id_token = account.id_token;
      }
      if (account && account.access_token) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id_token) {
        // @ts-expect-error: Add id_token to session object
        session.id_token = token.id_token;
      }
      if (token.access_token) {
        // @ts-expect-error: Add access_token to session object
        session.access_token = token.access_token;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
