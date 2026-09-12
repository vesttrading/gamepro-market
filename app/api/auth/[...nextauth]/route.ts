
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state"],
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
  secret: process.env.NEXTAUTH_SECRET,
  
  cookies: {
    callbackUrl: {
      // 👇 Обернули в кавычки "" — теперь TypeScript не будет ругаться
      name: "__Secure-next-auth.callback-url",
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    state: {
      // 👇 Обернули в кавычки ""
      name: "__Secure-next-auth.state",
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
});

export { handler as GET, handler as POST };
