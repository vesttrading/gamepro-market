[19.10.2026 16:25] Vladimir: import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../../lib/authOptions";

export const dynamic = "force-dynamic";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const battlenetId = session?.battlenetId;

  if (!battlenetId) {
    return jsonError("Please sign in with Battle.net", 401);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return jsonError("Server configuration error", 500);
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("coaches")
    .select("id, battletag, avatar, game, role, rating_mplus, discord, is_verified, description, is_published")
    .eq("owner_id", String(battlenetId))
    .maybeSingle();

  if (error) {
    console.error("Coach lookup failed:", error.message);
    return jsonError("Could not load coach profile", 500);
  }

  return NextResponse.json({ coach: data });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const battlenetId = session?.battlenetId;

  if (!battlenetId) {
    return jsonError("Please sign in with Battle.net", 401);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return jsonError("Server configuration error", 500);
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const game = body.game;
  const role = body.role;
  const discord = body.discord;
  const description = body.description;
  const serviceTitle = body.serviceTitle;
  const serviceType = body.serviceType;
  const price = body.price;

  if (
    !["WoW", "Dota 2", "CS2"].includes(String(game)) ||
    typeof role !== "string" ||
    !role.trim() ||
    role.length > 100 ||
    typeof discord !== "string" ||
    !discord.trim() ||
    discord.length > 100 ||
    typeof description !== "string" ||
    description.trim().length < 20 ||
    description.length > 1000 ||
    typeof serviceTitle !== "string" ||
    !serviceTitle.trim() ||
    serviceTitle.length > 120 ||
    !["Coaching", "Guide", "UI"].includes(String(serviceType)) ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 1 ||
    price > 10000
  ) {
    return jsonError("Please check all form fields and try again", 400);
  }

  const supabase = createClient(url, key);

  const { data: existing, error: lookupError } = await supabase
    .from("coaches")
    .select("id")
    .eq("owner_id", String(battlenetId))
    .maybeSingle();

  if (lookupError) {
    console.error("Coach lookup failed:", lookupError.message);
    return jsonError("Could not check existing profile", 500);
  }

  let coachId: number;

  if (existing) {
    const { data, error } = await supabase
      .from("coaches")
      .update({
        game,
        role: role.trim(),
        discord: discord.trim(),
        description: description.trim(),
      })
      .eq("id", existing.id)
      .eq("owner_id", String(battlenetId))
      .select("id")
      .single();

    if (error || !data) {
      console.error("Coach update failed:", error?.message);
      return jsonError("Could not save coach profile", 500);
    }

    coachId = data.id;
  } else {
    const { data, error } = await supabase
      .from("coaches")
      .insert({
        owner_id: String(battlenetId),
        battletag: session.user?.name ?? null,
        game,
        role: role.trim(),
        discord: discord.trim(),
        description: description.trim(),
        is_published: false,
        is_verified: false,
      })
      .select("id")
      .single();
[19.10.2026 16:25] Vladimir: if (error || !data) {
      console.error("Coach creation failed:", error?.message);
      return jsonError("Could not create coach profile", 500);
    }

    coachId = data.id;
  }

  const { error: serviceError } = await supabase
    .from("services")
    .insert({
      coach_id: coachId,
      title: serviceTitle.trim(),
      price,
      type: serviceType,
      description: description.trim(),
    });

  if (serviceError) {
    console.error("Service creation failed:", serviceError.message);
    return NextResponse.json(
      {
        error: "Coach profile saved, but the service could not be saved. Please contact support before submitting again.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Coach profile saved. It is not published yet.",
  });
}
