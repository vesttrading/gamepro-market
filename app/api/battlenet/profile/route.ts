import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth"; // Наш успешно созданный конфиг

export async function GET() {
  const session = await getServerSession(authOptions);

  // 1. Проверяем, авторизован ли пользователь
  if (!session || !(session as any).accessToken) {
    return Response.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    // 2. Запрашиваем у Blizzard список WoW-персонажей игрока
    const response = await fetch(
      "https://blizzard.com",
      {
        headers: {
          Authorization: Bearer ${(session as any).accessToken},
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Ошибка при запросе к Blizzard API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 3. Возвращаем аккаунты и персонажей на фронтенд
    return Response.json({
      wowAccounts: data.wow_accounts || [],
    });

  } catch (error) {
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
