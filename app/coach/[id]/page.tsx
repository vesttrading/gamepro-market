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

 <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 24 }}>
  {/* Крупный аватар с тонкой ярко-зеленой рамкой */}
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,             // Увеличили размер, чтобы закрывал обе строки
    height: 80,            // Увеличили размер
    borderRadius: "50%",
    border: "1px solid #00ff00", // Сделали рамку тонкой (1px вместо 3px)
    fontSize: 44,          // Крупный осьминог
    backgroundColor: "transparent",
    flexShrink: 0,
    filter: "grayscale(1) brightness(0.9)", // Делает эмодзи полностью черно-белым/не цветным
    marginTop: 4           // Небольшое выравнивание по верхней линии имени
  }}>
    🐙
  </div>

  {/* Контейнер для всей текстовой информации справа */}
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    
    {/* Имя и статус подтверждения */}
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

    {/* Строка WoW под именем, которая теперь находится в одном уровне с аватаром */}
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
