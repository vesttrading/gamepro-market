
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state"],
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  debug: false,
});

export { handler as GET, handler as POST };
