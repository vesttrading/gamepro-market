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

export default async function PlayerProfilePage({ params }: PlayerPageProps) {
  // Получаем игрока из базы по его bnet_id
  const { data: player, error } = await supabase
    .from("players")
    .select("*")
    .eq("bnet_id", params.id)
    .single();

  // Если игрока нет или произошла ошибка, показываем 404 страницу
  if (error || !player) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: "#0b132b", minHeight: "100vh", color: "#fff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#1c2541", borderRadius: "16px", padding: "32px", border: "1px solid #3a506b", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#00b4d8", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              GAMEPRO ACHIEVEMENT PASSPORT
            </span>
            <h1 style={{ fontSize: "32px", margin: "8px 0 4px 0", fontWeight: "bold" }}>
              {player.character_name}
            </h1>
            <p style={{ color: "#8d99ae", margin: 0, fontSize: "14px" }}>
              {player.spec} {player.class} · EU · {player.realm}
            </p>
          </div>
          
          {player.is_verified && (
            <div style={{ backgroundColor: "#00b4d8", color: "#fff", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              ✓ VERIFIED ID: {player.bnet_id.slice(0, 6)}...
            </div>
          )}
        </div>

        {/* Сетка с ключевыми показателями (Mythic+, Рейд) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "32px" }}>
          <div style={{ backgroundColor: "#0b132b", padding: "20px", borderRadius: "12px", textAlign: "center", border: "1px solid #1c2541" }}>
            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#00b4d8" }}>{player.mplus_score}</span>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#8d99ae" }}>Mythic+ Rating</p>
          </div>

          <div style={{ backgroundColor: "#0b132b", padding: "20px", borderRadius: "12px", textAlign: "center", border: "1px solid #1c2541" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{player.raid_progress}</span>
            <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#8d99ae" }}>Raid Progress</p>
          </div>
        </div>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#48cae4" }}>Профиль автоматически подтвержден через официальный Blizzard API</p>
        </div>

      </div>
    </div>
  );
}
