import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ realm: string; name: string }> }
) {
  const resolvedParams = await props.params;
  const realm = resolvedParams.realm.toLowerCase();
  const name = resolvedParams.name.toLowerCase();

  const raiderIoUrl = https://raider.io{realm}&name=${name}&fields=mythic_plus_scores_by_season:current,raid_progression;

  try {
    const response = await fetch(raiderIoUrl);

    if (!response.ok) {
      return Response.json({ error: "Персонаж не найден" }, { status: 404 });
    }

    const data = await response.json();
    const rioScore = Math.round(data.mythic_plus_scores_by_season?.scores?.all || 0);

    const raidProgression = data.raid_progression || {};
    const raidKeys = Object.keys(raidProgression);
    const currentRaidKey = raidKeys.length > 0 ? raidKeys[raidKeys.length - 1] : "";
    const progress = currentRaidKey ? raidProgression[currentRaidKey] : null;

    const hasAOTC = progress ? progress.heroic_bosses_killed > 0 || progress.mythic_bosses_killed > 0 : false;
    const hasCE = progress ? progress.mythic_bosses_killed === progress.total_bosses && progress.total_bosses > 0 : false;

    return Response.json({
      name: data.name,
      class: data.class,
      spec: data.active_spec_name,
      realm: data.realm,
      rioScore: rioScore,
      achievements: {
        ksm: rioScore >= 2000,
        aotc: hasAOTC,
        cuttingEdge: hasCE,
        highRio: rioScore >= 2850
      },
      avatarUrl: data.thumbnail_url
    });
  } catch (error) {
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
