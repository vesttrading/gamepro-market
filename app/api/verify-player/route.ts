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
        token.sub = account.providerAccountId;
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
    const { playerName: characterName, realmSlug, region = "eu" } =
      await request.json();

    if (!characterName || !realmSlug) {
      return NextResponse.json(
        { error: "Не указаны имя персонажа или реалм." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken;
    const bnetAccountId = (session as any)?.user?.id;

    if (!session || !accessToken) {
      return NextResponse.json(
        {
          error:
            "Пожалуйста, сначала войдите через Battle.net на сайте.",
        },
        { status: 401 }
      );
    }

    /*
     * 1. Получаем профиль WoW аккаунта через Blizzard API.
     */
    const profileUrl =
      "https://eu.api.blizzard.com/profile/user/wow";

    const blizzardResponse = await fetch(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!blizzardResponse.ok) {
      const errorText = await blizzardResponse.text();

      console.error(
        "Blizzard API error:",
        blizzardResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Blizzard API не вернул список персонажей. Проверьте авторизацию Battle.net.",
        },
        { status: 502 }
      );
    }

    const blizzardData = await blizzardResponse.json();

    /*
     * 2. Собираем персонажей со всех WoW аккаунтов.
     */
    const allCharacters =
      blizzardData.wow_accounts?.flatMap(
        (account: any) =>
          account.characters || []
      ) || [];

    /*
     * 3. Проверяем, есть ли указанный персонаж
     *    среди персонажей авторизованного Battle.net аккаунта.
     */
    const normalizedName = String(characterName)
      .trim()
      .toLowerCase();

    const normalizedRealm = String(realmSlug)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const ownedCharacter = allCharacters.find(
      (character: any) => {
        const name = String(character.name || "")
          .trim()
          .toLowerCase();

        const realm = String(
          character.realm?.slug || ""
        )
          .trim()
          .toLowerCase();

        return (
          name === normalizedName &&
          realm === normalizedRealm
        );
      }
    );

    if (!ownedCharacter) {
      return NextResponse.json(
        {
          error:
            "Верификация отклонена: этот персонаж не найден среди персонажей вашего Battle.net аккаунта.",
        },
        { status: 403 }
      );
    }

    /*
     * 4. Получаем актуальные данные Raider.IO.
     */
   const rioParams = new URLSearchParams({
  region: String(region).toLowerCase(),
  realm: normalizedRealm,
  name: String(characterName).trim(),
  // Объединяем массив в одну строку через запятую:
  fields: ["mythic_plus_scores_by_season:current", "gear", "raid_progression"].join(','),
});
      const raiderIoResponse = await fetch(
      `https://raider.io/api/v1/characters/profile?${rioParams.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!raiderIoResponse.ok) {
      const errorText = await raiderIoResponse.text();

      console.error(
        "Raider.IO error:",
        raiderIoResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Персонаж подтверждён Battle.net, но данные Raider.IO получить не удалось.",
        },
        { status: 502 }
      );
    }

    const rioData = await raiderIoResponse.json();

    const score =
      rioData.mythic_plus_scores_by_season?.[0]?.scores?.all ??
      null;

    const characterClass =
      rioData.class?.name ||
      rioData.class ||
      "Unknown";

    const activeSpec =
      rioData.active_spec_name ||
      "Unknown";

    let raidProgress = "No Data";

    if (rioData.raid_progression) {
      const raidKeys = Object.keys(
        rioData.raid_progression
      );

      const latestRaidKey =
        raidKeys[raidKeys.length - 1];

      if (latestRaidKey) {
        raidProgress =
          rioData.raid_progression[latestRaidKey]
            ?.summary || "No Data";
      }
    }

    /*
     * 5. Сохраняем в СУЩЕСТВУЮЩУЮ таблицу
     *    player_verifications.
     *
     *    Ничего не переносим в новую таблицу players.
     */
    const payload = {
      character_name: rioData.name || characterName,
      realm:
        rioData.realm?.name ||
        realmSlug,
      region: String(
        rioData.region?.name ||
          region
      ).toUpperCase(),
      mythic_plus_score: score,
      source: "raider.io",
      source_verified: true,
      raw_data: {
        ...rioData,
        gamepro_bnet_id: bnetAccountId,
        verified_by: "battle.net",
        character_class: characterClass,
        active_spec: activeSpec,
        raid_progress: raidProgress,
      },
    };

    const { data, error } = await supabase
      .from("player_verifications")
      .upsert(payload, {
        onConflict:
          "character_name,realm",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase Error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Battle.net и Raider.IO проверку прошли, но сохранить данные в Supabase не удалось.",
        },
        { status: 500 }
      );
    }

    /*
     * 6. Возвращаем результат фронтенду.
     */
    return NextResponse.json({
      success: true,
      verified: true,
      message:
        "Персонаж успешно подтверждён через Battle.net.",
      player: data,
      character: {
        name:
          rioData.name ||
          characterName,
        realm:
          rioData.realm?.name ||
          realmSlug,
        region: String(
          rioData.region?.name ||
            region
        ).toUpperCase(),
        class: characterClass,
        spec: activeSpec,
        mythicPlusScore: score,
        raidProgress,
      },
    });
  } catch (error) {
    console.error(
      "Critical verify-player error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Внутренняя ошибка сервера при проверке игрока.",
      },
      { status: 500 }
    );
  }
}
