
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

// Переопределяем переменную окружения для NextAuth на лету до инициализации
if (process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRE!,
      issuer: "https://eu.battle.net/oauth",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
