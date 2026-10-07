 "use client";

import { useEffect, useState } from "react";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";

const T: Record<Lang, any> = {
  RU: {
    title: "Регистрация гильдий и команд",
    subtitle: "Получите бесплатный PRO-доступ к базе проверенных игроков на 3 месяца",
    guildName: "Название гильдии *",
    realm: "Реалм / Сервер (например, Kazzak) *",
    discord: "Контакт Discord (логин) *",
    email: "Контактный email",
    link: "Ссылка (Raider.IO / WCL / Сайт)",
    players: "Кол-во игроков",
    interest: "Что наиболее интересно в платформе?",
    recruiting: "Быстрый поиск проверенных игроков (Рекрутинг)",
    achievements: "Автоматическая проверка достижений кандидатов",
    other: "Всё вместе / Другое",
    submit: "Оставить заявку",
    sending: "Отправка...",
    back: "← Вернуться в GamePro",
    required: "❌ Заполните обязательные поля: Название, Реалм и Discord.",
    success: "🎉 Заявка успешно отправлена! Мы свяжемся с вами в Discord.",
    error: "❌ Не удалось отправить заявку. Попробуйте позже.",
    language: "Язык",
  },

  EN: {
    title: "Guild & Team Registration",
    subtitle: "Get free PRO access to the verified player database for 3 months",
    guildName: "Guild name *",
    realm: "Realm / Server (e.g. Kazzak) *",
    discord: "Discord contact (username) *",
    email: "Contact email",
    link: "Link (Raider.IO / WCL / Website)",
    players: "Number of players",
    interest: "What are you most interested in?",
    recruiting: "Fast search for verified players (Recruiting)",
    achievements: "Automatic verification of candidates' achievements",
    other: "Everything / Other",
    submit: "Submit application",
    sending: "Sending...",
    back: "← Back to GamePro",
    required: "❌ Please fill in the required fields: Name, Realm and Discord.",
    success: "🎉 Application submitted successfully! We will contact you on Discord.",
    error: "❌ Failed to submit the application. Please try again later.",
    language: "Language",
  },

  TR: {
    title: "Guild ve Takım Kaydı",
    subtitle: "3 ay boyunca doğrulanmış oyuncu veritabanına ücretsiz PRO erişimi alın",
    guildName: "Guild adı *",
    realm: "Realm / Sunucu (örn. Kazzak) *",
    discord: "Discord iletişim (kullanıcı adı) *",
    email: "İletişim e-postası",
    link: "Bağlantı (Raider.IO / WCL / Web sitesi)",
    players: "Oyuncu sayısı",
    interest: "Platformda en çok ne ilginizi çekiyor?",
    recruiting: "Doğrulanmış oyuncuları hızlı bulma (Recruiting)",
    achievements: "Aday başarılarının otomatik doğrulanması",
    other: "Hepsi / Diğer",
    submit: "Başvuru gönder",
    sending: "Gönderiliyor...",
    back: "← GamePro'ya dön",
    required: "❌ Lütfen zorunlu alanları doldurun: Ad, Realm ve Discord.",
    success: "🎉 Başvuru başarıyla gönderildi! Sizinle Discord üzerinden iletişime geçeceğiz.",
    error: "❌ Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    language: "Dil",
  },

  DE: {
    title: "Gilden- und Teamregistrierung",
    subtitle: "Erhalte 3 Monate kostenlosen PRO-Zugang zur Datenbank verifizierter Spieler",
    guildName: "Gildenname *",
    realm: "Realm / Server (z. B. Kazzak) *",
    discord: "Discord-Kontakt (Benutzername) *",
    email: "Kontakt-E-Mail",
    link: "Link (Raider.IO / WCL / Website)",
    players: "Anzahl der Spieler",
    interest: "Was interessiert dich an der Plattform am meisten?",
    recruiting: "Schnelle Suche nach verifizierten Spielern (Recruiting)",
    achievements: "Automatische Überprüfung der Erfolge von Bewerbern",
    other: "Alles / Sonstiges",
    submit: "Bewerbung senden",
    sending: "Wird gesendet...",
    back: "← Zurück zu GamePro",
    required: "❌ Bitte fülle die Pflichtfelder aus: Name, Realm und Discord.",
    success: "🎉 Bewerbung erfolgreich gesendet! Wir kontaktieren dich über Discord.",
    error: "❌ Bewerbung konnte nicht gesendet werden. Bitte später erneut versuchen.",
    language: "Sprache",
  },
  ES: {
    title: "Registro de gremios y equipos",
    subtitle: "Obtén acceso PRO gratuito durante 3 meses a la base de datos de jugadores verificados",
    guildName: "Nombre del gremio *",
    realm: "Reino / Servidor (por ejemplo, Kazzak) *",
    discord: "Contacto de Discord (usuario) *",
    email: "Correo de contacto",
    link: "Enlace (Raider.IO / WCL / Sitio web)",
    players: "Número de jugadores",
    interest: "¿Qué te interesa más de la plataforma?",
    recruiting: "Búsqueda rápida de jugadores verificados (Reclutamiento)",
    achievements: "Verificación automática de logros de candidatos",
    other: "Todo / Otro",
    submit: "Enviar solicitud",
    sending: "Enviando...",
    back: "← Volver a GamePro",
    required: "❌ Completa los campos obligatorios: Nombre, Reino y Discord.",
    success: "🎉 ¡Solicitud enviada correctamente! Nos pondremos en contacto contigo por Discord.",
    error: "❌ No se pudo enviar la solicitud. Inténtalo más tarde.",
    language: "Idioma",
  },

  FR: {
    title: "Inscription des guildes et équipes",
    subtitle: "Obtenez gratuitement un accès PRO à la base de joueurs vérifiés pendant 3 mois",
    guildName: "Nom de la guilde *",
    realm: "Royaume / Serveur (par ex. Kazzak) *",
    discord: "Contact Discord (identifiant) *",
    email: "E-mail de contact",
    link: "Lien (Raider.IO / WCL / Site web)",
    players: "Nombre de joueurs",
    interest: "Qu'est-ce qui vous intéresse le plus sur la plateforme ?",
    recruiting: "Recherche rapide de joueurs vérifiés (Recrutement)",
    achievements: "Vérification automatique des accomplissements des candidats",
    other: "Tout / Autre",
    submit: "Envoyer la demande",
    sending: "Envoi...",
    back: "← Retour à GamePro",
    required: "❌ Remplissez les champs obligatoires : Nom, Royaume et Discord.",
    success: "🎉 Demande envoyée avec succès ! Nous vous contacterons sur Discord.",
    error: "❌ Impossible d'envoyer la demande. Réessayez plus tard.",
    language: "Langue",
  },

  PL: {
    title: "Rejestracja gildii i drużyn",
    subtitle: "Otrzymaj bezpłatny dostęp PRO do bazy zweryfikowanych graczy na 3 miesiące",
    guildName: "Nazwa gildii *",
    realm: "Realm / Serwer (np. Kazzak) *",
    discord: "Kontakt Discord (login) *",
    email: "E-mail kontaktowy",
    link: "Link (Raider.IO / WCL / strona)",
    players: "Liczba graczy",
    interest: "Co najbardziej interesuje Cię na platformie?",
    recruiting: "Szybkie wyszukiwanie zweryfikowanych graczy (rekrutacja)",
    achievements: "Automatyczna weryfikacja osiągnięć kandydatów",
    other: "Wszystko / Inne",
    submit: "Wyślij zgłoszenie",
    sending: "Wysyłanie...",
    back: "← Wróć do GamePro",
    required: "❌ Uzupełnij wymagane pola: Nazwa, Realm i Discord.",
    success: "🎉 Zgłoszenie zostało wysłane! Skontaktujemy się z Tobą przez Discord.",
    error: "❌ Nie udało się wysłać zgłoszenia. Spróbuj ponownie później.",
    language: "Język",
  },
}
  export default function GuildApplicationPage() {
  const [lang, setLang] = useState<Lang>("EN");
 useEffect(() => {
  const savedLang = localStorage.getItem("gamepro-lang");

 if (
  savedLang === "RU" ||
  savedLang === "EN" ||
  savedLang === "TR" ||
  savedLang === "DE" ||
  savedLang === "ES" ||
  savedLang === "FR" ||
  savedLang === "PL"
) {
    setLang(savedLang);
  }
}, []);

  const [guildName, setGuildName] = useState("");
  const [guildGame, setGuildGame] = useState("World of Warcraft");
  const [guildRegion, setGuildRegion] = useState("EU");
  const [guildRealm, setGuildRealm] = useState("");
  const [guildDiscord, setGuildDiscord] = useState("");
  const [guildEmail, setGuildEmail] = useState("");
  const [guildLink, setGuildLink] = useState("");
  const [guildPlayers, setGuildPlayers] = useState("");
  const [guildInterest, setGuildInterest] = useState("поиск игроков");
  const [guildLoading, setGuildLoading] = useState(false);
  const [guildStatus, setGuildStatus] = useState("");
  const [guilds, setGuilds] = useState<any[]>([]);
  const [guildSearch, setGuildSearch] = useState("");
  const [guildLoadingList, setGuildLoadingList] = useState(false);

  const t = T[lang];
  const changeLanguage = (value: Lang) => {
    setLang(value);
    localStorage.setItem("gamepro-lang", value);
  };

 useEffect(() => {
  const loadGuilds = async () => {
    setGuildLoadingList(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/guild_applications?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load guilds");
      }
    const data = await response.json();
      setGuilds(data || []);
    } catch (error) {
      console.error("Ошибка загрузки гильдий:", error);
    } finally {
      setGuildLoadingList(false);
    }
  };

  loadGuilds();
}, []);

  const handleGuildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guildName || !guildRealm || !guildDiscord) {
      setGuildStatus(t.required);
      return;
    }

    setGuildLoading(true);
    setGuildStatus("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/guild_applications`,
        {
          method: "POST",
          headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            guild_name: guildName,
            game: guildGame,
            region: guildRegion,
            realm: guildRealm,
            discord_contact: guildDiscord,
            email_contact: guildEmail,
            guild_link: guildLink,
            player_count: guildPlayers,
            interest_reason: guildInterest,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке");
      }

      setGuildStatus(t.success);

      setGuildName("");
      setGuildRealm("");
      setGuildDiscord("");
      setGuildEmail("");
      setGuildLink("");
      setGuildPlayers("");
    } catch (error) {
      setGuildStatus(t.error);
    } finally {
      setGuildLoading(false);
    }
  };

  const btn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    background: "#2bebfa",
    color: "#00173d",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    height: "44px",
  };

  const btnBack: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    background: "#2bebfa",
    color: "#00173d",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "15px",
    textDecoration: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    height: "44px",
  };

  const filteredGuilds = guilds.filter((guild) => {
  const search = guildSearch.toLowerCase().trim();

  if (!search) return true;

  return (
    String(guild.guild_name || "").toLowerCase().includes(search) ||
    String(guild.realm || "").toLowerCase().includes(search) ||
    String(guild.game || "").toLowerCase().includes(search)
  );
});
  return (
<div
  style={{
    height: "auto",             // Убедитесь, что здесь auto (убирает 100vh)
    minHeight: "100vh",         // Оставляем только как минимальную высоту для фона всей страницы
    background: "#050713",
    color: "#f7f8ff",
    fontFamily: "Arial,sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // <-- ЗАМЕНИТЕ "center" НА "flex-start" (прижмет контент к верху)
    padding: "40px 20px",       // Вертикальный отступ всей страницы сверху и снизу
  }}
>
      <div
       style={{
  width: "100%",
  maxWidth: "700px",        // Увеличиваем ширину (было 520/650), чтобы поля растянулись по горизонтали
  height: "auto",           // Убираем фиксированную высоту, карточка сожмется под контент
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(145deg,#10162b,#080d1b)",
  border: "1px solid #17bcb2",
  borderRadius: 20,
  padding: "20px 30px",     // Уменьшаем отступы сверху/снизу (20px) и делаем больше по бокам (30px)
  boxShadow: "0 0 35px #16d8cf12",
  boxSizing: "border-box"
}}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
        
        </div>

        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <div style={{ fontSize: 35 }}>👥</div>
        <h1
            style={{
              fontSize: 28,
              margin: "10px 0 5px",
              fontWeight: "bold",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              color: "#9da6c0",
              margin: 0,
              fontSize: "14px",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleGuildSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <input
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
              placeholder={t.guildName}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />

            <select
              value={guildGame}
              onChange={(e) => setGuildGame(e.target.value)}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            >
              <option value="World of Warcraft">World of Warcraft</option>
              <option value="Dota 2">Dota 2</option>
              <option value="CS2">CS2</option>
              <option value="Path of Exile 2">Path of Exile 2</option>
            </select>
          </div>
        <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 14,
            }}
          >
            <select
              value={guildRegion}
              onChange={(e) => setGuildRegion(e.target.value)}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            >
              <option value="EU">EU</option>
              <option value="US">US</option>
              <option value="RU">RU</option>
            </select>

            <input
              value={guildRealm}
              onChange={(e) => setGuildRealm(e.target.value)}
              placeholder={t.realm}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <input
              value={guildDiscord}
              onChange={(e) => setGuildDiscord(e.target.value)}
              placeholder={t.discord}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />

            <input
              type="email"
              value={guildEmail}
              onChange={(e) => setGuildEmail(e.target.value)}
              placeholder={t.email}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />
          </div>
         <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 14,
            }}
          >
            <input
              value={guildLink}
              onChange={(e) => setGuildLink(e.target.value)}
              placeholder={t.link}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />

            <input
              value={guildPlayers}
              onChange={(e) => setGuildPlayers(e.target.value)}
              placeholder={t.players}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{
                fontSize: 13,
                color: "#9da6c0",
              }}
            >
              {t.interest}
            </label>
         <select
              value={guildInterest}
              onChange={(e) => setGuildInterest(e.target.value)}
              style={{
                background: "#090e1d",
                border: "1px solid #26364b",
                borderRadius: 12,
                padding: 14,
                color: "white",
                outline: "none",
              }}
            >
              <option value="поиск игроков">{t.recruiting}</option>
              <option value="проверка достижений">{t.achievements}</option>
              <option value="другое">{t.other}</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={guildLoading}
              style={btn}
            >
              {guildLoading ? t.sending : t.submit}
            </button>

            <a href="/" style={btnBack}>
              {t.back}
            </a>
          </div>

          {guildStatus && (
            <p
              style={{
                textAlign: "center",
                color: guildStatus.startsWith("🎉")
                  ? "#45e0a1"
                  : "#ff8e9e",
                fontSize: 14,
                margin: "10px 0 0",
                fontWeight: "bold",
              }}
            >
              {guildStatus}
            </p>
          )}
        </form>

      </div> 

   <section
  style={{
    marginTop: "-60px",
    width: "100%",
    maxWidth: 1100,
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
 <h2
  style={{
    fontSize: 32,
    marginTop:  0,
    marginBottom: 10,
    textAlign: "center",
  }}
>
  🛡 Guilds
</h2>

  <p
    style={{
      color: "#9aa3bd",
      textAlign: "center",
      marginBottom: 25,
    }}
  >
   {t.guildsSubtitle}
  </p>

 <input
  type="text"
  value={guildSearch}
  onChange={(e) => setGuildSearch(e.target.value)}
  placeholder={t.guildsSearch}
  style={{
    width: "100%",
    maxWidth: "700px",
    boxSizing: "border-box",
    padding: "14px 16px",
    marginBottom: 25,
    borderRadius: 12,
    border: "1px solid #313858",
    background: "#0c1123",
    color: "white",
    outline: "none",
    fontSize: 16,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  }}
/>

  {guildLoadingList ? (
    <p style={{ textAlign: "center", color: "#9aa3bd" }}>
      Loading guilds...
    </p>
  ) : filteredGuilds.length === 0 ? (
    <p style={{ textAlign: "center", color: "#9aa3bd" }}>
     {t.guildsEmpty}
    </p>
  ) : (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
      }}
    >
      {filteredGuilds.map((guild) => (
        <div
          key={guild.id}
          style={{
            background: "linear-gradient(145deg,#10162b,#080d1b)",
            border: "1px solid #262d49",
            borderRadius: 20,
            padding: 22,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            🛡 {guild.guild_name}
          </div>

          <div style={{ color: "#9aa3bd", lineHeight: 1.8 }}>
            <div>🎮 {guild.game}</div>
            <div>🌍 {guild.region}</div>
            <div>🏰 {guild.realm}</div>

            {guild.player_count && (
              <div>👥 {guild.player_count}{t.guildsPlayers}</div>
            )}
          </div>

          <div
            style={{
              marginTop: 15,
              display: "inline-block",
              padding: "5px 10px",
              borderRadius: 8,
              background: "#102b2b",
              border: "1px solid #1d7770",
              color: "#6fffe9",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
           {t.guildsRegistered}
          </div>
            {guild.guild_link && (
            <a
              href={guild.guild_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: 16,
                color: "#8b7cff",
                textDecoration: "none",
              }}
            >
             {t.guildsOpen}
            </a>
          )}
        </div>
      ))}
    </div>
  )}
</section>
    
    </div>
  );
}
