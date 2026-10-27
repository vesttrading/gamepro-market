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
  const [searchName, setSearchName] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");

  const filteredCoaches = coaches.filter((coach) => {
    const name = (coach.battletag ?? "").toLowerCase();
    const query = searchName.trim().toLowerCase();

    const matchesName = name.includes(query);

    const game = (coach.game ?? "").toLowerCase();

    const matchesGame =
      !selectedGame ||
      (selectedGame === "WoW"
        ? game.includes("wow") || game.includes("world of warcraft")
        : game.includes(selectedGame.toLowerCase()));

    const matchesService =
      !selectedServiceType ||
      coach.services?.some(
        (service) =>
          (service.type ?? "").toLowerCase() ===
          selectedServiceType.toLowerCase()
      );

    return matchesName && matchesGame && matchesService;
  });

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
        console.log("COACH VERIFICATION:", result.coaches);
        setCoaches(result.coaches ?? []);
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
<div
 style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
  gap: 12,
  margin: "24px auto",
  padding: 16,
  background: "#10162b",
  border: "1px solid #26364b",
  borderRadius: 16,
  maxWidth: "750px",
  width: "100%",
  boxSizing: "border-box" // Гарантирует, что отступы не будут распирать ширину на смартфонах
}}
      >
        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder={{
            RU: "Поиск по нику тренера",
            EN: "Search coach nickname",
            TR: "Koç adına göre ara",
            DE: "Trainer nach Namen suchen",
            ES: "Buscar entrenador por nombre",
            FR: "Rechercher un coach par nom",
            PL: "Szukaj trenera po nicku",
          }[lang] || "Search coach nickname"}
          style={{
            minWidth: 0,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #34415c",
            background: "#080d1b",
            color: "white",
            width: "100%",
            boxSizing: "border-box",
          }}
        />

        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          style={{
            minWidth: 0,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #34415c",
            background: "#080d1b",
            color: "white",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="">
            {{
              RU: "Все игры",
              EN: "All games",
              TR: "Tüm oyunlar",
              DE: "Alle Spiele",
              ES: "Todos los juegos",
              FR: "Tous les jeux",
              PL: "Wszystkie gry",
            }[lang] || "All games"}
          </option>
          <option value="WoW">World of Warcraft</option>
          <option value="Dota 2">Dota 2</option>
          <option value="CS2">Counter-Strike 2</option>
        </select>

        <select
          value={selectedServiceType}
          onChange={(e) => setSelectedServiceType(e.target.value)}
          style={{
            minWidth: 0,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #34415c",
            background: "#080d1b",
            color: "white",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <option value="">
            {{
              RU: "Все услуги",
              EN: "All services",
              TR: "Tüm hizmetler",
              DE: "Alle Dienstleistungen",
              ES: "Todos los servicios",
              FR: "Tous les services",
              PL: "Wszystkie usługi",
            }[lang] || "All services"}
          </option>
         <option value="Coaching">
  {{
    RU: "Обучение с тренером",
    EN: "Coaching",
    TR: "Koçluk",
    DE: "Coaching",
    ES: "Entrenamiento",
    FR: "Coaching",
    PL: "Trening z trenerem",
  }[lang] || "Coaching"}
</option>

<option value="Guide">
  {{
    RU: "Руководство",
    EN: "Guide",
    TR: "Rehber",
    DE: "Anleitung",
    ES: "Guía",
    FR: "Guide",
    PL: "Poradnik",
  }[lang] || "Guide"}
</option>

<option value="UI">
  {{
    RU: "Настройка интерфейса",
    EN: "UI Setup",
    TR: "Arayüz Ayarları",
    DE: "Interface-Einstellungen",
    ES: "Configuración de interfaz",
    FR: "Configuration de l’interface",
    PL: "Konfiguracja interfejsu",
  }[lang] || "UI Setup"}
</option>
          </select>
      </div>
      
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
  ) : filteredCoaches.length === 0 ? (  
  <p style={{ textAlign: "center", color: "#9da6c0", padding: "24px 12px" }}>
    {{
      RU: "Тренеры не найдены. Попробуйте изменить фильтры.",
      EN: "No coaches found. Try changing your filters.",
      TR: "Koç bulunamadı. Filtreleri değiştirmeyi deneyin.",
      DE: "Keine Trainer gefunden. Ändere deine Filter.",
      ES: "No se encontraron entrenadores. Prueba a cambiar los filtros.",
      FR: "Aucun coach trouvé. Essayez de modifier les filtres.",
      PL: "Nie znaleziono trenerów. Spróbuj zmienić filtry.",
    }[lang] || "No coaches found. Try changing your filters."}
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
    {filteredCoaches.map((coach) => (
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
                   {coach.battletag ? coach.battletag.split(" ")[0] : "GamePro Coach"}
                   
                  </h3>
                  <span style={{ color: "#9da6c0", fontSize: 13 }}>
                    {coach.game} · {coach.role || "Coach"}
                  </span>
                </div>
              </div>

              {coach.is_verified && (
              <p
              style={{
              color: "#20c9bd",
              fontSize: 13,
              fontWeight: 700,
              textShadow: "0 0 8px rgba(32, 201, 189, 0.7)",
            }}
          >
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
        {coach.description ===
       "Experienced WoW player offering Mythic+ coaching for beginners and advanced players."
    ? ({
        RU: "Опытный игрок WoW. Обучаю Mythic+ новичков и опытных игроков.",
        EN: "Experienced WoW player offering Mythic+ coaching for beginners and advanced players.",
        TR: "Yeni başlayanlara ve deneyimli oyunculara Mythic+ koçluğu sunan deneyimli bir WoW oyuncusu.",
        DE: "Erfahrener WoW-Spieler und Mythic+-Coach für Anfänger und erfahrene Spieler.",
        ES: "Jugador experimentado de WoW que ofrece entrenamiento de Mythic+ para principiantes y jugadores avanzados.",
        FR: "Joueur expérimenté de WoW proposant du coaching Mythic+ aux débutants et aux joueurs avancés.",
        PL: "Doświadczony gracz WoW oferujący coaching Mythic+ dla początkujących i zaawansowanych graczy.",
      } as Record<string, string>)[lang] ||
      "Experienced WoW player offering Mythic+ coaching for beginners and advanced players."
    : coach.description ||
      ({
        RU: "Обучение игре и помощь тренера.",
        EN: "Game coaching and guidance.",
        TR: "Oyun eğitimi ve koçluk desteği.",
        DE: "Spieltraining und Coaching-Unterstützung.",
        ES: "Entrenamiento y orientación en el juego.",
        FR: "Entraînement et accompagnement en jeu.",
        PL: "Trening i wskazówki dotyczące gry.",
      } as Record<string, string>)[lang] ||
      "Game coaching and guidance."}
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
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    }}
  >
    <div style={{ fontWeight: 600 }}>
      {service.title === "Mythic+ Coaching Session"
        ? ({
            RU: "Тренировка Mythic+",
            EN: "Mythic+ Coaching Session",
            TR: "Mythic+ Koçluk Seansı",
            DE: "Mythic+-Coaching-Sitzung",
            ES: "Sesión de coaching Mythic+",
            FR: "Séance de coaching Mythic+",
            PL: "Sesja coachingowa Mythic+",
          } as Record<string, string>)[lang] || service.title
        : service.title}
    </div>

    <div
      style={{
        color: "#20c9bd",
        fontWeight: 800,
        fontSize: 18,
        whiteSpace: "nowrap",
        textShadow: "0 0 8px rgba(32, 201, 189, 0.7)",
      }}
    >
      ${Number(service.price).toFixed(0)}
    </div>
  </div>

  <div style={{ color: "#9da6c0", fontSize: 12, marginTop: 5 }}>
    {service.type === "Coaching"
      ? ({
          RU: "Обучение",
          EN: "Coaching",
          TR: "Koçluk",
          DE: "Coaching",
          ES: "Entrenamiento",
          FR: "Coaching",
          PL: "Coaching",
        } as Record<string, string>)[lang] || service.type
      : service.type}
    </div>
  </div>
         ))}
    </div>

            <button
            onClick={async () => {
            const message = window.prompt(
            lang === "RU"
            ? `Напишите сообщение тренеру ${coach.battletag}`
            : `Write a message to coach ${coach.battletag}`
           );

            if (!message?.trim()) return;

            try {
            const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify({
            coachId: coach.id,
            message: message.trim(),
          }),
        });

           const result = await response.json();

           if (!response.ok) {
           alert(
           result.error ||
           (lang === "RU"
           ? "Не удалось отправить сообщение"
           : "Failed to send message")
        );
           return;
        }

           alert(
           lang === "RU"
           ? "Сообщение отправлено!"
           : "Message sent!"
       );
      } catch (error) {
         console.error("Message sending error:", error);
         alert(
         lang === "RU"
         ? "Ошибка отправки сообщения"
         : "Message sending error"
       );
     }
   }}
        style={{
        marginTop: 16,
        padding: 12,
        borderRadius: 10,
        border: "none",
        background: "#20c9bd",
        color: "#06111b",
        fontWeight: 700,
        cursor: "pointer",
        display: "block",
        width: "100%",
     }}
   >
       {lang === "RU" ? "Связаться с тренером" : "Contact Coach"}
       </button>
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
