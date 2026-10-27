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
        background: "#0f172a", 
        color: "#f4f7ff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: 28,
          border: coach.is_verified ? "1px solid #22c55e" : "1px solid #334155",
          borderRadius: 18,
          background: "#1e293b", 
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", 
          boxSizing: "border-box",
        }}
      >
        <a
          href="/"
          style={{ color: "#20c9bd", textDecoration: "none" }}
        >
          ← GamePro
        </a>

<div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
  {/* Крупный аватар с неоновой ярко-зеленой рамкой и графичным осьминогом */}
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: "50%",
    border: "1.5px solid #00ff00", // Чистый, сочный ярко-зеленый цвет
    boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)", // Легкое неоновое свечение рамки
    backgroundColor: "transparent",
    flexShrink: 0
  }}>
    {/* Красивый минималистичный SVG-осьминог (монохромный/белый) */}
  <svg 
  viewBox="0 0 24 24" 
  width="46" 
  height="46" 
  fill="none" 
  stroke="#ffffff" // Белый цвет осьминога
  strokeWidth="1.2" // Изящные тонкие линии
  strokeLinecap="round" 
  strokeLinejoin="round"
>
  {/* Голова осьминога */}
  <path d="M12 2c3.5 0 6.5 2.5 6.5 6.5s-1.5 4.5-3.5 5.5c-.5.3-.5.7-.5 1v1h-5v-1c0-.3 0-.7-.5-1-2-1-3.5-1.5-3.5-5.5S8.5 2 12 2z" />
  
  {/* Глаза */}
  <circle cx="9.5" cy="8.5" r="1" fill="#ffffff" />
  <circle cx="14.5" cy="8.5" r="1" fill="#ffffff" />
  
  {/* Левые щупальца */}
  <path d="M9 16c-1 1-3 .5-3-1.5s1.5-2.5 2.5-1.5" />
  <path d="M7 16c-1.5 1-3.5-.5-3-2.5s2.5-2 3-.5" />
  <path d="M10 16c-1 2-4.5 1.5-5-1s2.5-3.5 4-1.5" />
  
  {/* Правые щупальца */}
  <path d="M15 16c1 1 3 .5 3-1.5s-1.5-2.5-2.5-1.5" />
  <path d="M17 16c1.5 1 3.5-.5 3-2.5s-2.5-2-3-.5" />
  <path d="M14 16c1 2 4.5 1.5 5-1s-2.5-3.5-4-1.5" />
</svg>
  </div>

  {/* Контейнер для текстовой информации */}
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    
    {/* Имя и статус подтверждения на одной строке */}
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: "#fff", margin: 0 }}>
        {coach.battletag ?? "Coach"}
      </h1>

      {coach.is_verified && (
        <div style={{ display: "inline-block", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "4px 8px", borderRadius: 4 }}>
          ✓ Подтвержден
        </div>
      )}
    </div>

    {/* Единственная строка WoW (вторую дублирующуюся мы удалили ниже) */}
    <p style={{ color: "#94a3b8", fontSize: 16, margin: 0 }}>
      {coach.game} • {coach.role}
    </p>

  </div>
</div>
        <p style={{ color: "#94a3b8", fontSize: 16, marginTop: 12, marginBottom: 16 }}>
          {coach.game} · {coach.role}
        </p>

        {coach.rating_mplus != null && (
          <p>Mythic+ Rating: {coach.rating_mplus}</p>
        )}

       <p style={{ color: "#b5bfd6", lineHeight: 1.7 }}>
          <CoachContent
          value={coach.description}
          text="coachDescription"
        />
     </p>

        <h2 style={{ marginTop: 32 }}><CoachText text="services" /></h2>

        {services && services.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  padding: 16,
                  background: "#090e1d",
                  border: "1px solid #26364b",
                  borderRadius: 10,
                }}
              >
               <strong>
               <CoachContent
               value={service.title}
               text="serviceTitle"
            />
          </strong>
                <p style={{ color: "#20c9bd" }}>
                  ${Number(service.price).toFixed(2)} USD
                </p>
               <p style={{ color: "#9da6c0", fontSize: 13 }}>
                  <CoachContent
                  value={service.type}
                  text="serviceType"
               />
            </p>
               {service.description && (
         <p>
              <CoachContent
              value={service.description}
              text="serviceDescription"
            />
         </p>
        )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#9da6c0" }}>
          <CoachText text="noServices" />
          </p>
        )}
       <h2 style={{ marginTop: 32 }}>
          <CoachText text="reviews" />
       </h2>

        {reviews && reviews.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: 16,
                  background: "#090e1d",
                  border: "1px solid #26364b",
                  borderRadius: 10,
                }}
              >
                <strong>
                  {review.author_name || "GamePro игрок"}
                </strong>

                <p style={{ margin: "8px 0" }}>
                  {"⭐".repeat(Number(review.rating) || 0)}
                </p>

                <p style={{ color: "#b5bfd6", lineHeight: 1.6 }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#9da6c0" }}>
            <CoachText text="noReviews" />
          </p>
        )}
      </div>
    </main>
  );
}
