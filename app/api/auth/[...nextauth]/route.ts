import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state", "pkce", "nonce"],
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
      }

      if (
        token.expiresAt &&
        Date.now() > (token.expiresAt as number) * 1000
      ) {
        token.error = "RefreshAccessTokenError";
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        // @ts-ignore
        session.error = token.error;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
