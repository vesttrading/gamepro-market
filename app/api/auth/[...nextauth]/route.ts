

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
  // Добавляем обработчики (Callbacks) для сохранения данных игрока в сессию
  callbacks: {
    async jwt({ token, account, profile }) {
      // Если пользователь только что залогинился, сохраняем его BattleTag и Access Token
      if (account && profile) {
        token.accessToken = account.access_token;
        token.battleTag = (profile as any).battle_tag;
      }
      return token;
    },
    async session({ session, token }) {
      // Передаем данные из токена в сессию фронтенда
      (session as any).accessToken = token.accessToken;
      (session as any).battleTag = token.battleTag;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "gamepro-secret-key-2026-prod",
});

export { handler as GET, handler as POST };
