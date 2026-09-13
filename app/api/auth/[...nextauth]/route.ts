import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

// Принудительно заставляем NextAuth использовать основной домен
process.env.NEXTAUTH_URL = "https://vercel.app";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET,
      issuer: "https://eu.battle.net/oauth",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };
