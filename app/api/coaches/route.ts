import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: coaches, error: coachesError } = await supabase
    .from("coaches")
    .select(
      id,
      battletag,
      avatar,
      game,
      role,
      rating_mplus,
      discord,
      is_verified,
      description,
      is_published
    )
    .eq("is_published", true)
    .order("id", { ascending: false });

  if (coachesError) {
    console.error("Coaches API error:", coachesError.message);

    return NextResponse.json(
      { error: coachesError.message },
      { status: 500 }
    );
  }

  const coachIds = (coaches ?? []).map((coach) => coach.id);

  let services: {
    id: number;
    coach_id: number;
    title: string;
    price: number;
    type: string;
    description: string | null;
  }[] = [];

  if (coachIds.length > 0) {
    const { data, error: servicesError } = await supabase
      .from("services")
      .select("id, coach_id, title, price, type, description")
      .in("coach_id", coachIds);

    if (servicesError) {
      console.error("Services API error:", servicesError.message);

      return NextResponse.json(
        { error: servicesError.message },
        { status: 500 }
      );
    }

    services = data ?? [];
  }

  const result = (coaches ?? []).map((coach) => ({
    ...coach,
    services: services.filter(
      (service) => service.coach_id === coach.id
    ),
  }));

  return NextResponse.json({ coaches: result });
}
