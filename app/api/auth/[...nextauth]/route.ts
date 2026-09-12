
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      // 👇 Этот блок решает проблему с ошибкой OAuthCallback
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.battletag,
          email: null, 
          image: null,
        };
      },
    }),
  ],
  // Жестко указываем секрет шифрования
  secret: process.env.AUTH_SECRET,

  // Принудительно настраиваем внутренние ссылки возврата
  pages: {
    signIn: '/',
    error: '/',
  },

  // 👇 Передаем accessToken в сессию, чтобы потом запрашивать персонажей из Blizzard
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
