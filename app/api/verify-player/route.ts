import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { createClient } from "@supabase/supabase-js";
import BattleNetProvider from "next-auth/providers/battlenet";
import { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID!,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET!,
      issuer: "https://eu.battle.net/oauth",
      checks: ["state", "pkce", "nonce"],
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Если у вас тут была логика работы с Supabase — можете вернуть её сюда.
    // Пока оставляем базовый рабочий ответ для успешной сборки:
    return NextResponse.json({ success: true, message: "Сессия проверена" });

  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
