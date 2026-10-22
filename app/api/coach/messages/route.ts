import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../../lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.battlenetId) {
      return NextResponse.json(
        { error: "Please log in with Battle.net" },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const { data: coaches, error: coachError } = await supabase
      .from("coaches")
      .select("id, battletag")
      .eq("owner_id", String(session.battlenetId));

    if (coachError) {
      console.error("Coach lookup error:", coachError);
      return NextResponse.json(
        { error: "Failed to load coach profile" },
        { status: 500 }
      );
    }

    if (!coaches || coaches.length === 0) {
      return NextResponse.json(
        { error: "No coach profile linked to this Battle.net account" },
        { status: 404 }
      );
    }

    const coachIds = coaches.map((coach) => coach.id);

    const { data: messages, error: messageError } = await supabase
      .from("coach_messages")
      .select("id, coach_id, sender_id, message, created_at, is_read")
      .in("coach_id", coachIds)
      .order("created_at", { ascending: false });

    if (messageError) {
      console.error("Messages lookup error:", messageError);
      return NextResponse.json(
        { error: "Failed to load messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      coaches,
      messages: messages ?? [],
    });
  } catch (error) {
    console.error("Coach messages API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
