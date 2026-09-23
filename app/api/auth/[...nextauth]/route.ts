import NextAuth from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";

const handler = NextAuth({
providers: [
    BattleNetProvider({
      clientId: process.env.BATTLE_NET_CLIENT_ID!,
      clientSecret: process.env.BATTLE_NET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state", "pkce", "nonce"],
      authorization: { params: { prompt: "login", scope: "wow.profile openid" } }
    }),
  ],
  // ДОБАВЬТЕ ЭТОТ БЛОК КОДА:
  callbacks: {
    async jwt({ token, account }) {
      // Сохраняем токен от Blizzard внутрь JWT-сессии сайта
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Прокидываем токен на фронтенд, чтобы его видел клиентский код
      session.accessToken = token.accessToken;
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (supabaseUrl && supabaseKey && account.providerAccountId) {
            await fetch(
              `${supabaseUrl}/rest/v1/gamepro_users?on_conflict=battlenet_id`,
              {
                method: "POST",
                headers: {
                  "apikey": supabaseKey,
                  "Authorization": `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                  "Prefer": "resolution=merge-duplicates,return=minimal",
                },
                body: JSON.stringify({
                  battlenet_id: account.providerAccountId,
                  battletag: token.name || null,
                  last_login_at: new Date().toISOString(),
                }),
              }
            );
          }
        } catch (error) {
          console.error("GamePro registration error:", error);
        }
      }

      return token;
    },

   async session({ session, token }) {
  // @ts-ignore
  session.accessToken = token.accessToken;

  // @ts-ignore
  session.battlenetId = token.battlenetId;

  return session;
   },
  },
});

export { handler as GET, handler as POST };
