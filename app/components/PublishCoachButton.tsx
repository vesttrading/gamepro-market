"use client";

import { useEffect, useState } from "react";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";

const translations: Record<Lang, {
  publish: string;
  publishing: string;
  success: string;
  failed: string;
  connection: string;
}> = {
  RU: {
    publish: "Опубликовать профиль",
    publishing: "Публикация...",
    success: "Профиль успешно опубликован!",
    failed: "Не удалось опубликовать профиль.",
    connection: "Ошибка соединения. Попробуй ещё раз.",
  },
  EN: {
    publish: "Publish Profile",
    publishing: "Publishing...",
    success: "Profile published successfully!",
    failed: "Publication failed.",
    connection: "Connection error. Please try again.",
  },
  TR: {
    publish: "Profili yayımla",
    publishing: "Yayımlanıyor...",
    success: "Profil başarıyla yayımlandı!",
    failed: "Profil yayımlanamadı.",
    connection: "Bağlantı hatası. Lütfen tekrar dene.",
  },
  DE: {
    publish: "Profil veröffentlichen",
    publishing: "Wird veröffentlicht...",
    success: "Profil erfolgreich veröffentlicht!",
    failed: "Profil konnte nicht veröffentlicht werden.",
    connection: "Verbindungsfehler. Bitte versuche es erneut.",
  },
  ES: {
    publish: "Publicar perfil",
    publishing: "Publicando...",
    success: "¡Perfil publicado correctamente!",
    failed: "No se pudo publicar el perfil.",
    connection: "Error de conexión. Inténtalo de nuevo.",
  },
  FR: {
    publish: "Publier le profil",
    publishing: "Publication...",
    success: "Profil publié avec succès !",
    failed: "Impossible de publier le profil.",
    connection: "Erreur de connexion. Réessaie.",
  },
  PL: {
    publish: "Opublikuj profil",
    publishing: "Publikowanie...",
    success: "Profil został opublikowany!",
    failed: "Nie udało się opublikować profilu.",
    connection: "Błąd połączenia. Spróbuj ponownie.",
  },
};

export default function PublishCoachButton() {
  const [lang, setLang] = useState<Lang>("EN");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  async function publishProfile() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/coaches/me", {
        method: "PATCH",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || t.failed);
        return;
      }

      setMessage(t.success);
    } catch {
      setMessage(t.connection);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button
        type="button"
        onClick={publishProfile}
        disabled={loading}
        style={{
          padding: "13px 22px",
          borderRadius: 10,
          border: "none",
          background: "#20c9bd",
          color: "#06101a",
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? t.publishing : t.publish}
      </button>

      {message && (
        <p style={{ color: "#20c9bd", marginTop: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
}
