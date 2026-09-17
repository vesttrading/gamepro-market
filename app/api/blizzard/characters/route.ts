import { NextRequest } from "next/server";
import { auth } from "@/lib/auth"; // Импортируем функцию проверки сессии из вашего lib/auth.ts

export async function GET(request: NextRequest) {
  // 1. Проверяем, авторизован ли пользователь в нашем приложении
  const session = await auth();
  
  if (!session || !session.accessToken) {
    return Response.json(
      { error: "Необходима авторизация через Battle.net" },
      { status: 401 }
    );
  }

  try {
    // 2. Делаем запрос к Blizzard Profile API (регион EU, локаль ru_RU)
    // Передаем токен пользователя в заголовке Authorization
    const response = await fetch(
      "https://blizzard.com",
      {
        headers: {
          Authorization: Bearer ${session.accessToken},
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

    // 3. Форматируем массив персонажей, оставляя только нужные поля
    // Фильтруем пустые аккаунты, если у игрока несколько WoW-лицензий
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

    // Возвращаем чистый список персонажей на фронтенд
    return Response.json({ characters });

  } catch (error: any) {
    return Response.json(
      { error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
