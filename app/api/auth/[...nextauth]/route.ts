
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
  // Жёстко указываем секрет шифрования
  secret: process.env.AUTH_SECRET,
  
  // Принудительно настраиваем внутренние ссылки возврата для вашего домена vercel.app
  pages: {
    signIn: '/',
    error: '/',
  }
});

export { handler as GET, handler as POST };
