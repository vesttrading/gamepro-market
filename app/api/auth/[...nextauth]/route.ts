
import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const authOptions = {
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      authorization: {
        params: { scope: "openid wow.profile" }
      },
      client: {
        openidToken: "id_token"
      },
      profile(profile) {
        return {
          id: profile.sub || profile.id.toString(),
          name: profile.battletag || "User",
          email: null,
          image: null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
