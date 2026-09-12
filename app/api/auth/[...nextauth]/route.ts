
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      // 👇 ВОТ ЭТА СТРОКА ОЖИВИТ КНОПКУ НА ОСНОВНОМ ДОМЕНЕ
      checks: ["none"],
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
});

export { handler as GET, handler as POST };
