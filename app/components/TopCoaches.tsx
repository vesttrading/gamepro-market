"use client";

import { useEffect, useState } from "react";

type Service = {
  id: number;
  title: string;
  price: number;
  type: string;
};

type Coach = {
  id: number;
  battletag: string | null;
  avatar: string | null;
  game: string;
  role: string | null;
  rating_mplus: number | null;
  is_verified: boolean;
  description: string | null;
  services: Service[];
};

export default function TopCoaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("EN");

useEffect(() => {
    const updateLang = () => {
    const savedLang = localStorage.getItem("gamepro-lang");
    if (savedLang) setLang(savedLang);
  };

  updateLang();

  window.addEventListener("languageChanged", updateLang);
  window.addEventListener("storage", updateLang);

  return () => {
    window.removeEventListener("languageChanged", updateLang);
    window.removeEventListener("storage", updateLang);
  };
}, []);

  useEffect(() => {
    let active = true;

    async function loadCoaches() {
      try {
        const response = await fetch("/api/coaches", {
          cache: "no-store",
        });
        const result = await response.json();
        console.log("Top Coaches API:", result);

        if (active && response.ok) {
          setCoaches(result.coaches || []);
        }
      } catch (error) {
        console.error("Failed to load coaches:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCoaches();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="top-coaches"
      style={{
        maxWidth: 1160,
        width: "92%",
        margin: "0 auto",
        padding: "35px 0",
        color: "white",
      }}
    >
     <h2 style={{ textAlign: "center", fontSize: 32 }}>
  {{
    RU: "Топ тренеров",
    EN: "Top Coaches",
    TR: "En İyi Koçlar",
    DE: "Top-Trainer",
    ES: "Mejores entrenadores",
    FR: "Meilleurs coachs",
    PL: "Najlepsi trenerzy",
  }[lang] || "Top Coaches"}
</h2>

      <p style={{ textAlign: "center", color: "#9da6c0" }}>
{loading ? (
  <p style={{ textAlign: "center" }}>
    {{
      RU: "Загружаем тренеров...",
      EN: "Loading coaches...",
      TR: "Koçlar yükleniyor...",
      DE: "Trainer werden geladen...",
      ES: "Cargando entrenadores...",
      FR: "Chargement des coachs...",
      PL: "Ładowanie trenerów...",
    }[lang] || "Loading coaches..."}
  </p>
) : coaches.length === 0 ? (
  <p style={{ textAlign: "center", color: "#9da6c0" }}>
    {{
      RU: "Скоро здесь появятся тренеры.",
      EN: "Coaches will appear here soon.",
      TR: "Koçlar yakında burada görünecek.",
      DE: "Hier werden bald Trainer angezeigt.",
      ES: "Pronto aparecerán entrenadores aquí.",
      FR: "Les coachs apparaîtront bientôt ici.",
      PL: "Wkrótce pojawią się tutaj trenerzy.",
    }[lang] || "Coaches will appear here soon."}
  </p>
) : (

       <div
          style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 320px))",
          gap: 20,
          justifyContent: "center",
          width: "100%",
          }}
        >
          {coaches.map((coach) => (
            <article
              key={coach.id}
              style={{
                width: "100%",
                maxWidth: 320,
                boxSizing: "border-box",
                background: "linear-gradient(145deg, #10162b, #080d1b)",
                border: "1px solid #20c9bd",
                borderRadius: 18,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #6126e9, #20c9bd)",
                    fontSize: 24,
                    overflow: "hidden",
                  }}
                >
                  {coach.avatar ? (
                    <img
                      src={coach.avatar}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    "🎮"
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, overflowWrap: "anywhere" }}>
                    {coach.battletag || "GamePro Coach"}
                  </h3>
                  <span style={{ color: "#9da6c0", fontSize: 13 }}>
                    {coach.game} · {coach.role || "Coach"}
                  </span>
                </div>
              </div>

              {coach.is_verified && (
               <p style={{ color: "#34d399", fontSize: 13 }}>
             {{
              RU: "✓ ПОДТВЕРЖДЁН",
              EN: "✓ VERIFIED",
              TR: "✓ DOĞRULANDI",
              DE: "✓ VERIFIZIERT",
              ES: "✓ VERIFICADO",
              FR: "✓ VÉRIFIÉ",
              PL: "✓ ZWERYFIKOWANO",
             }[lang] || "✓ VERIFIED"}
           </p>
              )}

              <p style={{ color: "#c5cbe0", lineHeight: 1.5 }}>
                {coach.description || "Game coaching and guidance."}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {coach.services?.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      padding: 12,
                      background: "#090e1d",
                      border: "1px solid #26364b",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{service.title}</div>
                    <div style={{ color: "#20c9bd", marginTop: 5 }}>
                      ${Number(service.price).toFixed(2)} USD
                    </div>
                    <div style={{ color: "#9da6c0", fontSize: 12 }}>
                      {service.type}
                    </div>
                  </div>
                ))}
              </div>

           <a
           href={`/coach/${coach.id}`}
           style={{
           display: "block",
           textAlign: "center",
           marginTop: 16,
           padding: 12,
           borderRadius: 10,
           background: "#20c9bd",
           color: "#06101a",
           fontWeight: 700,
           textDecoration: "none",
         }}
       >
       {{
        RU: "Профиль",
        EN: "Profile",
        TR: "Profil",
        DE: "Profil",
        ES: "Perfil",
        FR: "Profil",
        PL: "Profil",
       }[lang] || "Profile"}
         </a>
         </article>
        ))}
        </div>
      )}
    </section>
  );
}
