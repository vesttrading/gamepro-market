import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
 providers: [
  BattleNetProvider({
    clientId: process.env.BATTLE_NET_CLIENT_ID!,
    clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: "openid wow.profile",
      },
    },
  }),
],

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
