import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
    }),
  ],
  secret: process.env.BATTLE_NET_CLIENT_SECRET, 
  trustHost: true, 
});

// Строка экспорта должна быть строго в самом конце файла!
export { handler as GET, handler as POST };
