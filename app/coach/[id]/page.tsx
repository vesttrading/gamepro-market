import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CoachText, { CoachContent } from "./CoachText";

export const dynamic = "force-dynamic";

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server configuration is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: coach, error } = await supabase
    .from("coaches")
    .select(
      "id, battletag, avatar, game, role, rating_mplus, discord, is_verified, description, is_published"
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !coach) {
    notFound();
  }

  const { data: services } = await supabase
    .from("services")
    .select("id, title, price, type, description")
    .eq("coach_id", coach.id);

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("id, author_name, rating, text, created_at")
    .eq("coach_id", coach.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Failed to load coach reviews:", reviewsError.message);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a", // Новый чистый тёмный фон вместо старой синевы
        color: "#f4f7ff",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "750px", margin: "0 auto", display: "grid", gap: "24px" }}>
        
        {/* Кнопка возврата на главную — сохранили вашу родную ссылку */}
        <a href="/" style={{ color: "#20c9bd", textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← GamePro
        </a>

        {/* БЛОК 1: Карточка профиля тренера с зеленой тонкой рамкой статуса "Подтвержден" */}
        <section 
          style={{ 
            background: "#1e293b", 
            border: coach.is_verified ? "1px solid #22c55e" : "1px solid #334155", 
            borderRadius: "16px", 
            padding: "24px", 
            display: "grid", 
            gap: "16px", 
            boxSizing: "border-box" 
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
            
            {/* Аватарка + Ник */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #22c55e)", display: "grid", placeItems: "center", fontSize: "32px" }}>
                触
              </div>
              <div>
                <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 700 }}>
                  {coach.battletag ?? "Coach"}
                </h1>
                <p style={{ color: "#94a3b8", margin: "4px 0 0 0", fontSize: "14px" }}>
                  {coach.game} · {coach.role}
                </p>
              </div>
            </div>

            {/* Статусные бейджи */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {coach.is_verified && (
                <span style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <CoachText text="verified" />
                </span>
              )}
              <span style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                ● Онлайн
              </span>
              <span style={{ background: "#334155", color: "#cbd5e1", padding: "6px 12px", borderRadius: "20px", fontSize: "12px" }}>
                RU/EN
              </span>
            </div>
          </div>

          {/* Доказательство скилла из вашей базы данных (rating_mplus) */}
          {coach.rating_mplus != null && (
            <div style={{ background: "#0f172a", padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Доказательство скилла: </span>
              <strong style={{ color: "#4ade80", fontSize: "14px" }}>Mythic+ Rating: {coach.rating_mplus}</strong>
            </div>
          )}

          {/* Описание тренера */}
          <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6", margin: 0 }}>
            <CoachContent value={coach.description} text="coachDescription" />
          </p>
          
          {/* Главная кнопка действия по ТЗ v2 — Исправленный роутинг на Discord */}
          <a 
            href={coach.discord ? https://discord.com{coach.discord} : "#"} 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              display: "block", 
              textAlign: "center", 
              background: "#22c55e",
              color: "#0f172a", 
              textDecoration: "none", 
              padding: "14px", 
              borderRadius: "10px", 
              fontWeight: 700, 
              fontSize: "16px", 
              marginTop: "8px" 
            }}
          >
            Написать в Discord
          </a>
        </section>

        {/* БЛОК 2: Список услуг с синей рамкой */}
        <section style={{ display: "grid", gap: "16px" }}>
          <h2 style={{ fontSize: "18px", marginTop: 12, fontWeight: 600, color: "#94a3b8" }}>
            <CoachText text="services" />
          </h2>
          
          {services && services.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {services.map((service) => (
                <div 
                  key={service.id} 
                  style={{ 
                    background: "#1e293b", 
                    border: "1px solid #3b82f6", // Тонкая синяя рамка услуги
                    borderRadius: "12px", 
                    padding: "20px", 
                    display: "flex", 
                    flexWrap: "wrap", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    gap: "16px", 
                    boxSizing: "border-box" 
                  }}
                >
                  <div style={{ flex: "1 1 400px" }}>
                    <span style={{ fontSize: "11px", background: "#3b82f6", color: "#fff", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>
                      <CoachContent value={service.type} text="serviceType" />
                    </span>
                    <h3 style={{ fontSize: "18px", margin: "8px 0", fontWeight: 700 }}>
                      <CoachContent value={service.title} text="serviceTitle" />
                    </h3>
                    {service.description && (
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                        <CoachContent value={service.description} text="serviceDescription" />
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", display: "grid", gap: "8px", justifyItems: "end" }}>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: "#3b82f6" }}>
                      ${Number(service.price).toFixed(2)} USD
                    </span>
                    <button style={{ background: "transparent", border: "1px solid #3b82f6", color: "#3b82f6", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
                      Забронировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8", margin: 0 }}><CoachText text="noServices" /></p>
          )}
        </section>

        {/* БЛОК 3: Отзывы */}
        <section style={{ display: "grid", gap: "16px" }}>
          <h2 style={{ fontSize: "18px", marginTop: 12, fontWeight: 600, color: "#94a3b8" }}>
            <CoachText text="reviews" />
          </h2>

          {reviews && reviews.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {reviews.map((review) => (
                <div key={review.id} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "16px", display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: "#fff" }}>{review.author_name || "GamePro игрок"}</strong>
                    <span style={{ color: "#eab308", letterSpacing: "2px" }}>{"★".repeat(Number(review.rating) || 0)}</span>
                  </div>
                  <p style={{ color: "#cbd5e1", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "24px", textAlign: "center", color: "#94a3b8" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Пока нет отзывов о тренере. Станьте первым, кто оставит отзыв после совместной тренировки!
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
