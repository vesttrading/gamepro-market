import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.battleNetId = account.providerAccountId;
      }

      if (profile) {
        token.battleNetProfile = profile;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).battleNetId = token.battleNetId;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
