



import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

export const authOptions = {
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
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, account }: any) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  debug: false,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
