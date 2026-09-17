import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    // 1. Проверяем сессию пользователя в Battle.net
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).accessToken) {
      return Response.json({ error: "Необходима авторизация через Battle.net" }, { status: 401 });
    }

    const body = await request.json();
    const { playerName, realm, region, score, rawData } = body;

    if (!playerName || !realm || !region) {
      return Response.json({ error: "Пропущены обязательные поля" }, { status: 400 });
    }

    // 2. Запрашиваем список реальных персонажей игрока из нашего же API
    // Для безопасности делаем запрос к Blizzard Profile напрямую, используя токен сессии
    const bnetResponse = await fetch(
      "https://blizzard.com",
      {
        headers: {
          "Authorization": "Bearer " + (session as any).accessToken,
        },
      }
    );

    if (!bnetResponse.ok) {
      return Response.json({ error: "Не удалось проверить персонажей в Blizzard API" }, { status: 400 });
    }

    const bnetData = await bnetResponse.json();
    
    // 3. Ищем, принадлежит ли проверяемый персонаж этому аккаунту Blizzard
    const isOwner = bnetData.wow_accounts?.some((account: any) =>
      account.characters?.some((char: any) => 
        char.name.toLowerCase() === playerName.toLowerCase() && 
        char.realm.name.toLowerCase() === realm.toLowerCase()
      )
    );

    if (!isOwner) {
      return Response.json({ error: "Верификация отклонена: вы не являетесь владельцем этого персонажа!" }, { status: 403 });
    }

    // 4. Если проверка прошла успешно, сохраняем в Supabase со статусом source_verified = true
    const { data, error } = await supabase
      .from("player_verifications")
      .insert([
        {
          player_name: playerName,
          realm: realm,
          region: region.toLowerCase(),
          mythic_plus_score: score || 0,
          source_verified: true, // ПЕРСОНАЖ ПОДТВЕРЖДЕН!
          raw_data: rawData || {},
        }
      ])
      .select();

    if (error) throw error;

    return Response.json({ success: true, verified: true, data });

  } catch (error: any) {
    return Response.json({ error: error.message || "Ошибка сервера при верификации" }, { status: 500 });
  }
}
