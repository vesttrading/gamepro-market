import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const customUrl = process.env.VERCEL_URL
  ?`https://${process.env.VERCEL_URL}`
  : process.env.NEXTAUTH_URL;

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  env: {
    NEXTAUTH_URL: customUrl,
  },
});

export { handler as GET, handler as POST };
