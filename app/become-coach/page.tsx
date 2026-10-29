"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import PublishCoachButton from "../components/PublishCoachButton";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";

const translations: Record<Lang, Record<string, string>> = {
  RU: {
    title: "Стать коучем GamePro", intro: "Создай профиль и предлагай игрокам свои услуги.",
    back: "← Вернуться на сайт",
    login: "Войди через Battle.net, чтобы создать профиль коуча.", signIn: "Войти через Battle.net",
    loading: "Загрузка...", game: "Игра", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Роль или специализация", rolePlaceholder: "Например: Mythic+, лекарь, центральная линия",
    discord: "Контакт Discord", discordPlaceholder: "Твой Discord",
    about: "О себе (2–3 предложения)", service: "Первая услуга", serviceTitle: "Название услуги",
    servicePlaceholder: "Например: обучение Mythic+", serviceType: "Тип услуги",
    coaching: "Обучение", guide: "Гайд", ui: "Настройка интерфейса", price: "Цена (USD)",
    saving: "Сохранение...", save: "Сохранить профиль коуча",
    saved: "Профиль сохранён! Пока он не опубликован.", error: "Не удалось сохранить профиль.",
    connection: "Ошибка соединения. Попробуй ещё раз.",
    aboutPlaceholder: "Опишите ваш опыт (минимум 20 символов)...",
  },
  EN: {
    title: "Become a GamePro Coach", intro: "Create your profile and offer coaching services to players.",
    back: "← Back to website",
    login: "Sign in with Battle.net to create your coach profile.", signIn: "Sign in with Battle.net",
    loading: "Loading...", game: "Game", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Role or specialization", rolePlaceholder: "e.g. Mythic+, Healer, Mid lane",
    discord: "Discord username or contact", discordPlaceholder: "Your Discord contact",
    about: "About you (2–3 sentences)", service: "First service", serviceTitle: "Service title",
    servicePlaceholder: "e.g. Mythic+ coaching session", serviceType: "Service type",
    coaching: "Coaching", guide: "Guide", ui: "UI setup", price: "Price (USD)",
    saving: "Saving...", save: "Save coach profile",
    saved: "Profile saved! It is not published yet.", error: "Could not save your profile.",
    connection: "Connection error. Please try again.",
    aboutPlaceholder: "Describe your experience (minimum 20 characters)...",
  },
  TR: {
    title: "GamePro Koçu Ol", intro: "Profilini oluştur ve oyunculara koçluk hizmetleri sun.",
    back: "← Siteye dön",
    login: "Koç profilini oluşturmak için Battle.net ile giriş yap.", signIn: "Battle.net ile giriş yap",
    loading: "Yükleniyor...", game: "Oyun", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Rol veya uzmanlık", rolePlaceholder: "Örn. Mythic+, şifacı, orta koridor",
    discord: "Discord iletişim bilgisi", discordPlaceholder: "Discord iletişim bilgin",
    about: "Hakkında (2–3 cümle)", service: "İlk hizmet", serviceTitle: "Hizmet başlığı",
    servicePlaceholder: "Örn. Mythic+ koçluk seansı", serviceType: "Hizmet türü",
    coaching: "Koçluk", guide: "Rehber", ui: "Arayüz kurulumu", price: "Fiyat (USD)",
    saving: "Kaydediliyor...", save: "Koç profilini kaydet",
    saved: "Profil kaydedildi! Henüz yayımlanmadı.", error: "Profil kaydedilemedi.",
    connection: "Bağlantı hatası. Lütfen tekrar dene.",
    aboutPlaceholder: "Deneyiminizi açıklayın (en az 20 karakter)...",
  },
  DE: {
    title: "GamePro-Coach werden", intro: "Erstelle dein Profil und biete Spielern Coaching an.",
    back: "← Zurück zur Website",
    login: "Melde dich mit Battle.net an, um dein Coach-Profil zu erstellen.", signIn: "Mit Battle.net anmelden",
    loading: "Wird geladen...", game: "Spiel", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Rolle oder Spezialisierung", rolePlaceholder: "z. B. Mythic+, Heiler, Midlane",
    discord: "Discord-Kontakt", discordPlaceholder: "Dein Discord-Kontakt",
    about: "Über dich (2–3 Sätze)", service: "Erste Dienstleistung", serviceTitle: "Name der Dienstleistung",
    servicePlaceholder: "z. B. Mythic+-Coaching", serviceType: "Dienstleistungstyp",
    coaching: "Coaching", guide: "Guide", ui: "UI-Einrichtung", price: "Preis (USD)",
    saving: "Wird gespeichert...", save: "Coach-Profil speichern",
    saved: "Profil gespeichert! Es ist noch nicht veröffentlicht.", error: "Profil konnte nicht gespeichert werden.",
    connection: "Verbindungsfehler. Bitte versuche es erneut.",
    aboutPlaceholder: "Beschreiben Sie Ihre Erfahrung (mindestens 20 Zeichen)...",
  },
  ES: {
    title: "Conviértete en coach de GamePro", intro: "Crea tu perfil y ofrece servicios de coaching a jugadores.",
    back: "← Volver al sitio",
    login: "Inicia sesión con Battle.net para crear tu perfil.", signIn: "Iniciar sesión con Battle.net",
    loading: "Cargando...", game: "Juego", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Rol o especialidad", rolePlaceholder: "Ej.: Mythic+, sanador, línea central",
    discord: "Contacto de Discord", discordPlaceholder: "Tu contacto de Discord",
    about: "Sobre ti (2–3 frases)", service: "Primer servicio", serviceTitle: "Título del servicio",
    servicePlaceholder: "Ej.: sesión de coaching de Mythic+", serviceType: "Tipo de servicio",
    coaching: "Coaching", guide: "Guía", ui: "Configuración de interfaz", price: "Precio (USD)",
    saving: "Guardando...", save: "Guardar perfil de coach",
    saved: "¡Perfil guardado! Todavía no está publicado.", error: "No se pudo guardar el perfil.",
    connection: "Error de conexión. Inténtalo de nuevo.",
    aboutPlaceholder: "Describe tu experiencia (mínimo 20 caracteres)...",
  },
  FR: {
    title: "Devenir coach GamePro", intro: "Crée ton profil et propose des services aux joueurs.",
    back: "← Retour au site",
    login: "Connecte-toi avec Battle.net pour créer ton profil.", signIn: "Se connecter avec Battle.net",
    loading: "Chargement...", game: "Jeu", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Rôle ou spécialisation", rolePlaceholder: "Ex. : Mythic+, soigneur, voie du milieu",
    discord: "Contact Discord", discordPlaceholder: "Ton contact Discord",
    about: "À propos de toi (2–3 phrases)", service: "Premier service", serviceTitle: "Titre du service",
    servicePlaceholder: "Ex. : séance de coaching Mythic+", serviceType: "Type de service",
    coaching: "Coaching", guide: "Guide", ui: "Configuration de l’interface", price: "Prix (USD)",
    saving: "Enregistrement...", save: "Enregistrer le profil coach",
    saved: "Profil enregistré ! Il n’est pas encore publié.", error: "Impossible d’enregistrer le profil.",
    connection: "Erreur de connexion. Réessaie.",
    aboutPlaceholder: "Décrivez votre expérience (20 caractères minimum)...",
  },
  PL: {
    title: "Zostań coachem GamePro", intro: "Utwórz profil i oferuj graczom usługi coachingowe.",
    back: "← Wróć do strony",
    login: "Zaloguj się przez Battle.net, aby utworzyć profil.", signIn: "Zaloguj przez Battle.net",
    loading: "Ładowanie...", game: "Gra", wow: "World of Warcraft", dota: "Dota 2", cs2: "Counter-Strike 2",
    role: "Rola lub specjalizacja", rolePlaceholder: "Np. Mythic+, healer, środkowa linia",
    discord: "Kontakt Discord", discordPlaceholder: "Twój kontakt Discord",
    about: "O sobie (2–3 zdania)", service: "Pierwsza usługa", serviceTitle: "Nazwa usługi",
    servicePlaceholder: "Np. sesja coachingowa Mythic+", serviceType: "Rodzaj usługi",
    coaching: "Coaching", guide: "Poradnik", ui: "Konfiguracja interfejsu", price: "Cena (USD)",
    saving: "Zapisywanie...", save: "Zapisz profil coacha",
    saved: "Profil zapisany! Nie został jeszcze opublikowany.", error: "Nie udało się zapisać profilu.",
    connection: "Błąd połączenia. Spróbuj ponownie.",
    aboutPlaceholder: "Opisz swoje doświadczenie (minimum 20 znaków)..."
  }
};

export default function BecomeCoachPage() {
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<Lang>("EN");
  const [game, setGame] = useState("WoW");
  const [role, setRole] = useState("");
  const [discord, setDiscord] = useState("");
  const [description, setDescription] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceType, setServiceType] = useState("Coaching");
  const [price, setPrice] = useState("25");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    const updateLang = () => {
      const saved = localStorage.getItem("gamepro-lang") as Lang | null;
      setLang(saved && translations[saved] ? saved : "EN");
    };
    updateLang();
    window.addEventListener("languageChanged", updateLang);
    window.addEventListener("storage", updateLang);
    return () => {
      window.removeEventListener("languageChanged", updateLang);
      window.removeEventListener("storage", updateLang);
    };
  }, []);

  const t = translations[lang];

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/coaches/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game, role, discord, description, serviceTitle, serviceType,
          price: Number(price),
        }),
      });
      const result = await response.json();
      if (!response.ok) setMessage(result.error || t.error);
      else setMessage(t.saved);
    } catch {
      setMessage(t.connection);
    } finally {
      setLoading(false);
    }
  }

const fieldStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  padding: "11px 13px",
  background: "#202c44",
  color: "#f1f5f9",
  border: "1px solid #3b4967",
  borderRadius: 10,
  boxSizing: "border-box",
  fontSize: 15,
  outline: "none",
  marginTop: 6,
};

  if (status === "loading") {
    return <main style={{ padding: 40, color: "white" }}>{t.loading}</main>;
  }

  if (!session) {
return (
  <main
    style={{
      maxWidth: 620,
      margin: "24px auto",
      padding: 24,
      color: "white",
      boxSizing: "border-box",
      width: "calc(100% - 24px)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 26,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          minWidth: 0,
          flex: 1,
        }}
      >
        <span
          style={{
            fontSize: 38,
            color: "#4789ff",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          🎮
        </span>

        <div style={{ minWidth: 0 }}>
          <h1
            className="coach-card-title"
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.7px",
            }}
          >
            {t.title}
          </h1>

          <p
            className="coach-card-subtitle"
            style={{
              margin: "8px 0 0",
              color: "#94a3b8",
              lineHeight: 1.5,
            }}
          >
            {t.intro}
          </p>
        </div>
      </div>

      <a
        href="/"
        style={{
          padding: "10px 12px",
          background: "#20c9bd",
          borderRadius: 10,
          color: "#06101a",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 700,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {t.back}
      </a>
    </div>

    <button
      onClick={() =>
        signIn("battlenet", {
          callbackUrl: "/become-coach",
        })
      }
      style={{
        padding: 13,
        borderRadius: 9,
        cursor: "pointer",
      }}
    >
      {t.signIn}
    </button>
  </main>
);
}
 return (
  <main
    style={{
      maxWidth: 600,
      margin: "24px auto",
      padding: "12px 24px 32px 24px",
      color: "#f8fafc",
      background: "#101727",
      border: "1px solid #303b52",
      borderRadius: 24,
      boxSizing: "border-box",
      width: "calc(100% - 24px)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 12,
      }}
    >
<a
  href="/"
  style={{
    color: "#20c9bd",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    float: "right",
    position: "relative",
    top: "52px",
    display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'block'
  }}
>
  ← GamePro
</a>
    </div>
 
    <style>{`
  input::placeholder,
  textarea::placeholder {
    color: #cbd5e1 !important;
    opacity: 1 !important;
  }

  .coach-field label {
    display: block;
    margin-bottom: 13px;
    color: #cbd5e1;
    font-size: 14px;
  }

  .coach-field input,
  .coach-field select,
  .coach-field textarea {
    transition: border-color 0.2s ease;
  }

  .coach-field input:focus,
  .coach-field select:focus,
  .coach-field textarea:focus {
    border-color: #4789ff !important;
  }

  .coach-field input,
  .coach-field textarea {
    color-scheme: dark;
  }

  @media (max-width: 480px) {
    .coach-card-title {
      font-size: 25px !important;
    }

    .coach-card-subtitle {
      font-size: 14px !important;
    }
  }
`}</style>
   
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 26,
      }}
    >
      <span
        style={{
          fontSize: 38,
          color: "#4789ff",
          lineHeight: 1,
        }}
      >
        🎮
      </span>

      <div>
        <h1
          className="coach-card-title"
         style={{
        margin: 0,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "-0.7px",
        textAlign: "center" 
    }}
        >
          {t.title}
        </h1>

        <p
          className="coach-card-subtitle"
          style={{
            margin: "8px 0 0",
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          {t.intro}
        </p>
      </div>
    </div>
   
   <form
  className="coach-field"
  onSubmit={submitForm}
  style={{
    display: "grid",
    gap: 4,
    rowGap: "2px",
    marginBottom: 0,
  }}
>
        <label>
          {t.game}
         <select
  value={game}
  onChange={(e) => setGame(e.target.value)}
  style={{
    ...fieldStyle,
    border: "2px solid #4789ff",
  }}
>
            <option value="WoW">{t.wow}</option>
            <option value="Dota 2">{t.dota}</option>
            <option value="CS2">{t.cs2}</option>
          </select>
        </label>

       <label>
  {t.role}
  <input
    value={role}
    onChange={(e) => setRole(e.target.value)}
    placeholder={t.rolePlaceholder}
    required
    style={{
      ...fieldStyle,
      border: "2px solid #a855f7",
    }}
  />
</label>

       <label>
  {t.discord}
  <input
    value={discord}
    onChange={(e) => setDiscord(e.target.value)}
    placeholder={t.discordPlaceholder}
    required
    style={{
      ...fieldStyle,
      border: "2px solid #22c55e",
    }}
  />
</label>

      <label>
  {t.about}
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder={t.aboutPlaceholder}
    minLength={20}
    maxLength={1000}
    required
    rows={4}
    style={{
      ...fieldStyle,
      border: "2px solid #3b4967",
    }}
  />
</label>

      <label>
  {t.serviceTitle}
  <input
    value={serviceTitle}
    onChange={(e) => setServiceTitle(e.target.value)}
    placeholder={t.servicePlaceholder}
    required
    style={{
      ...fieldStyle,
      border: "2px solid #f59e0b",
    }}
  />
</label>

      <label>
  {t.serviceType}
  <select
    value={serviceType}
    onChange={(e) => setServiceType(e.target.value)}
    style={{
      ...fieldStyle,
      border: "2px solid #a855f7",
    }}
  >
    <option value="Coaching">{t.coaching}</option>
    <option value="Guide">{t.guide}</option>
    <option value="UI">{t.ui}</option>
  </select>
</label>

       <label>
  {t.price}
  <input
    type="number"
    min="1"
    max="10000"
    step="0.01"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
    style={{
      ...fieldStyle,
      border: "2px solid #22c55e",
    }}
  />
</label>
        
<button type="submit" disabled={loading} style={{
    padding: 10, 
    border: "2px solid #00bcff", 
    borderRadius: 10, 
    background: "#1e293b", 
    color: "#00bcff", 
    fontSize: "16px",
    fontWeight: 600, 
    cursor: "pointer",
    marginBottom: 0,
    display: "block",
    marginTop: "16px",
    width: "100%",
    textAlign: "center"
}}>
    {loading ? t.saving : t.save}
</button>
  
     {message && (
    <p role="status" style={{ margin: "4px 0 0" }}>
    {message}
  </p>
)}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 6,
    marginTop: 14,
    paddingTop: 0,
  }}
>
     
        <PublishCoachButton />

      
      </div>

     </form> 
    </main>
  );
}
