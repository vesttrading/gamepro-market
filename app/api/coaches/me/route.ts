import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  const battlenetId = session?.battlenetId;

  if (!battlenetId) {
    return NextResponse.json(
      { error: "Please sign in with Battle.net" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("coaches")
    .select("id, battletag, avatar, game, role, rating_mplus, discord, is_verified, description, is_published")
    .eq("owner_id", String(battlenetId))
    .maybeSingle();

  if (error) {
    console.error("Coach profile lookup failed:", error.message);
    return NextResponse.json(
      { error: "Could not load coach profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ coach: data });
}
