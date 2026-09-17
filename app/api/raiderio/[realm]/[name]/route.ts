import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { realm: string; name: string } }
) {
  // Получаем параметры из URL (приводим к нижнему регистру для API)
  const realm = params.realm.toLowerCase();
  const name = params.name.toLowerCase();

  // URL для запроса к публичному API Raider.IO с нужными полями
  const raiderIoUrl = https://raider.io{realm}&name=${name}&fields=mythic_plus_scores_by_season:current,raid_progression,gear;

  try {
    const response = await fetch(raiderIoUrl);

    if (!response.ok) {
      return Response.json({ error: "Персонаж не найден в Raider.IO" }, { status: 404 });
    }

    const data = await response.json();

    // 1. Извлекаем базовые данные
    const characterName = data.name;
    const characterClass = data.class;
    const spec = data.active_spec_name;
    const rioScore = Math.round(data.mythic_plus_scores_by_season[0]?.scores?.all || 0);

    // 2. Логика проверки достижений (VERIFIED блоки с ваших скриншотов)
    const raidProgression = data.raid_progression;
    
    // Проверяем актуальный рейд (например, Nerub-ar Palace или актуальный на текущий момент)
    // Ищем вхождение "H" (Heroic) и "M" (Mythic) для определения ачивок
    const currentRaidKey = Object.keys(raidProgression)[0]; // Берем последний актуальный рейд
    const progress = raidProgression[currentRaidKey];

    const hasAOTC = progress ? progress.heroic_killed > 0 || progress.mythic_killed > 0 : false;
    const hasCE = progress ? progress.mythic_killed === progress.total_bosses : false;
    const hasKSM = rioScore >= 2000; // Порог для Keystone Master обычно 2000 рейтинга

    // 3. Формируем чистый объект для вашего Achievement Passport
    return Response.json({
      name: characterName,
      class: characterClass,
      spec: spec,
      realm: data.realm,
      rioScore: rioScore,
      achievements: {
        ksm: hasKSM,
        aotc: hasAOTC,
        cuttingEdge: hasCE,
        highRio: rioScore >= 2850 // Для плашки "2850 M+" как на скрине
      },
      avatarUrl: data.thumbnail_url
    });

  } catch (error) {
    return Response.json({ error: "Ошибка сервера при запросе к Raider.IO" }, { status: 500 });
  }
}
