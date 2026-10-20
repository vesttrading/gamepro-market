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

const { data, error } = await supabase
  .from("coaches")
  .select("id, battletag, is_published")
  .eq("is_published", true)
  .order("id", { ascending: false });

 if (error) {
  console.error("Coaches API error:", error.message);

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}

return NextResponse.json({
  coaches: data,
  debug: {
    count: data?.length ?? 0,
    projectConfigured: Boolean(supabaseUrl),
  },
 });
}
