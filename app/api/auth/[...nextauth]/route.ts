
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

  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.battleTag = profile.battle_tag;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.battleTag) {
        session.user.name = token.battleTag as string;
      }
      return session;
    },
  },

  debug: false,
});

export { handler as GET, handler as POST };
