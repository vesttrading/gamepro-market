
export { handler as GET, handler as POST };
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
  // Явно указываем библиотеке использовать секрет из Vercel
  secret: process.env.BATTLE_NET_CLIENT_SECRET, 
  
  // Принудительно заставляем доверять прокси-серверам Vercel
  trustHost: true, 
});

export { handler as GET, handler as POST };
