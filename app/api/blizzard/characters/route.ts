import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.accessToken) {
    return Response.json(
      { error: "Необходима авторизация через Battle.net" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      "https://blizzard.com",
      {
        headers: {
          "Authorization": "Bearer " + session.accessToken,
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Не удалось получить данные от Blizzard API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const characters = data.wow_accounts?.flatMap((account: any) => 
      account.characters.map((char: any) => ({
        id: char.id,
        name: char.name,
        realm: char.realm.name,
        realmSlug: char.realm.slug,
        level: char.level,
        playableClass: char.playable_class.name,
        faction: char.faction.type
      }))
    ) || [];

    return Response.json({ characters });

  } catch (error: any) {
    return Response.json(
      { error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
