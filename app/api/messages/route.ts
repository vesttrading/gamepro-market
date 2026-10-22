
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../lib/authOptions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.battlenetId) {
      return NextResponse.json(
        { error: "Please log in with Battle.net" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const coachId = Number(body.coachId);
    const message = String(body.message ?? "").trim();

    if (!Number.isInteger(coachId) || coachId <= 0) {
      return NextResponse.json(
        { error: "Invalid coach ID" },
        { status: 400 }
      );
    }

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must contain 1–2000 characters" },
        { status: 400 }
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

    const { data: user, error: userError } = await supabase
      .from("gamepro_users")
      .select("id")
      .eq("battlenet_id", session.battlenetId)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json(
        { error: "GamePro user account not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("coach_messages")
      .insert({
        coach_id: coachId,
        sender_id: user.id,
        message,
      });

    if (error) {
      console.error("Message save error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
