 import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { createClient } from "@supabase/supabase-js";
import BattleNetProvider from "next-auth/providers/battlenet";
import { AuthOptions } from "next-auth";

// 1. Конфигурация NextAuth остается внутри файла для гарантированной сборки на Vercel
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
        token.sub = account.providerAccountId; // Уникальный ID аккаунта Blizzard (Bnet ID)
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // Получаем переданные из формы имя персонажа и реалм
    const { characterName, realmSlug } = await request.json();

    if (!characterName || !realmSlug) {
      return NextResponse.json({ error: "Не указаны имя персонажа или сервер" }, { status: 400 });
    }

    // ШАГ 1: Извлекаем сессию и accessToken авторизованного пользователя
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;
    const bnetAccountId = (session as any)?.user?.id;

    if (!session || !accessToken) {
      return NextResponse.json(
        { error: "Пожалуйста, сначала войдите через Battle.net на сайте!" },
        { status: 401 }
      );
    }

    // ШАГ 2: Подключаем Blizzard API для проверки владения персонажем
    // Запрашиваем у Blizzard список всех персонажей, привязанных к этому токену в регионе EU
    const blizzardProfileRes = await fetch(
      `https://blizzard.com`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!blizzardProfileRes.ok) {
      return NextResponse.json(
        { error: "Не удалось получить список персонажей от Blizzard. Проверьте права приложения." },
        { status: 502 }
      );
    }

    const blizzardData = await blizzardProfileRes.json();
    
    // Собираем всех персонажей со всех WoW-аккаунтов этой учетной записи
    const allCharacters = blizzardData.wow_accounts?.flatMap((acc: any) => acc.characters) || [];

    // ШАГ 3: Сверяем данные формы с реальными данными от Blizzard
    const isRealOwner = allCharacters.some(
      (char: any) =>
        char.name.toLowerCase() === characterName.toLowerCase() &&
        char.realm.slug === realmSlug.toLowerCase()
    );

    // Если персонаж не найден в списке от Blizzard — запрещаем верификацию
    if (!isRealOwner) {
      return NextResponse.json(
        { error: "Верификация отклонена: персонаж не принадлежит вашему аккаунту" },
        { status: 403 }
      );
    }

    // ШАГ 4: Если проверка пройдена, запрашиваем актуальный прогресс с Raider.IO
    const raiderIoRes = await fetch(
      `https://raider.io{realmSlug.toLowerCase()}&name=${encodeURIComponent(characterName)}&fields=mythic_plus_scores_by_season:current,raid_progression`
    );

    let rioScore = 0;
    let characterClass = "Unknown";
    let activeSpec = "Unknown";
    let raidProgress = "No Data";

    if (raiderIoRes.ok) {
      const rioData = await raiderIoRes.json();
      characterClass = rioData.class || "Unknown";
      activeSpec = rioData.active_spec_name || "Unknown";
      
      const currentSeasonScores = rioData.mythic_plus_scores_by_season?.scores;
      rioScore = currentSeasonScores?.all ? Math.round(currentSeasonScores.all) : 0;
        if (rioData.raid_progression) {
        const latestRaidKey = Object.keys(rioData.raid_progression)[0];
        if (latestRaidKey) {
          raidProgress = rioData.raid_progression[latestRaidKey].summary || "No Data";
        }
      }
    }

    // ШАГ 5: Сохраняем проверенного игрока в Supabase с флагом is_verified = true
    const { data: profile, error: supabaseError } = await supabase
      .from("players")
      .upsert({
        bnet_id: bnetAccountId,
        character_name: characterName,
        realm: realmSlug,
        class: characterClass,
        spec: activeSpec,
        mplus_score: rioScore,
        raid_progress: raidProgress,
        is_verified: true, // Устанавливаем статус VERIFIED железобетонно
        updated_at: new Date().toISOString(),
      }, { onConflict: "bnet_id" }) 
      .select()
      .single();

    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      return NextResponse.json({ error: "Ошибка сохранения в базу данных" }, { status: 500 });
    }

    // Возвращаем фронтенду подтвержденный профиль
    return NextResponse.json({
      success: true,
      message: "Персонаж успешно верифицирован через Battle.net!",
      player: profile
    });

  } catch (error) {
    console.error("Critical Route Error:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
