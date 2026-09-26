 import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface PlayerPageProps {
  params: {
    id: string;
  };
}

export default async function PlayerProfilePage({
  params,
}: PlayerPageProps) {
  const { data: player, error } = await supabase
    .from("player_verifications")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !player) {
    notFound();
  }

  const verified = player.source_verified === true;
 
  return (
     <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 0,#28105b 0,transparent 34%),radial-gradient(circle at 15% 35%,#073c42 0,transparent 25%),#050713",
        color: "#f7f8ff",
        fontFamily: "Arial,sans-serif",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "linear-gradient(145deg,#10162b,#080d1b)",
          border: "1px solid #19cfc5",
          borderRadius: 20,
          padding: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.5,
                color: "#52eee3",
                marginBottom: 8,
              }}
            >
              GAMEPRO ACHIEVEMENT PASSPORT
            </div>

            <h1
              style={{
                fontSize: 34,
                margin: "0 0 8px",
              }}
            >
              {player.player_name || "Без имени"}
            </h1>

            <div
              style={{
                color: "#9da6c0",
                fontSize: 15,
              }}
            >
              {player.role  ""} {player.class  ""} ·{" "}
              {player.realm || "Unknown"} ·{" "}
              {player.region || "EU"}
            </div>
          </div>

          <div
            style={{
              background: verified ? "#0b5f58" : "#1e293b",
              border: "1px solid #19cfc5",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {verified ? "✓ VERIFIED" : "DATA FOUND"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 12,
            marginTop: 30,
          }}
        >
          <div
            style={{
              padding: 20,
              background: "#080d1b",
              border: "1px solid #19cfc5",
              borderRadius: 14,
              textAlign: "center",
            }}
          >
            <b style={{ fontSize: 28 }}>
              {player.rating ?? player.mythic_plus_score ?? "—"}
            </b>

            <small
              style={{
                display: "block",
                color: "#9da6c0",
                marginTop: 6,
              }}
            >
              Mythic+ Rating
            </small>
          </div>

          <div
            style={{
              padding: 20,
              background: "#080d1b",
              border: "1px solid #19cfc5",
              borderRadius: 14,
              textAlign: "center",
            }}
          >
            <b style={{ fontSize: 24 }}>
              {player.source?.toUpperCase() || "RAIDER.IO"}
            </b>
            <small
              style={{
                display: "block",
                color: "#9da6c0",
                marginTop: 6,
              }}
            >
              Source
            </small>
          </div>
        </div>

        <div
          style={{
            marginTop: 25,
            padding: 18,
            background: "#0a1021",
            borderRadius: 14,
            border: "1px solid #1c8f82",
          }}
        >
          <div
            style={{
              color: "#9da6c0",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            GamePro Verification
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {verified
              ? "✓ Профиль подтверждён GamePro"
              : "DATA FOUND · NOT VERIFIED"}
          </div>

          <div
            style={{
              color: "#65708d",
              fontSize: 11,
              marginTop: 8,
            }}
          >
            Verification ID: {player.id}
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            textAlign: "center",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px 22px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#18e0d1,#12bfb6)",
              color: "#021312",
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            ← Вернуться в GamePro
          </a>
        </div>
      </div>
    </div>
  );
}
