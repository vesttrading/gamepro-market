
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state", "pkce", "nonce"],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  // ДОБАВЬТЕ ЭТОТ БЛОК:
  callbacks: {
    async jwt({ token, account }) {
      // Если это первоначальный вход, сохраняем данные аккаунта
      if (account) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at;
      }
      
      // Проверка на просроченность токена (если expires_at есть)
      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000) {
        // Токен просрочен — возвращаем ошибку, чтобы NextAuth сбросил сессию
        return { ...token, error: "RefreshAccessTokenError" };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Если токен вернул ошибку просроченности, сигнализируем фронтенду
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },
});
