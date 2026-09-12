import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      region: "eu", // Указываем европейский регион для СНГ и Европы напрямую
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "gamepro-secret-key-2026-prod",
});

export { handler as GET, handler as POST };
