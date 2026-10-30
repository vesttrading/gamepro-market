 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const translations = {
  RU: {
    title: "Инбокс Тренера",
    subtitle: "Сообщения, отправленные в ваш профиль тренера GamePro.",
    greeting: "Здравствуй!",
    read: "Прочитано",
    unread: "Новое",
    playerId: "ID игрока",
    noMessages: "У вас пока нет сообщений.",
    loading: "Загрузка сообщений...",
    loadError: "Ошибка загрузки данных",
    connectionError: "Ошибка соединения. Попробуйте ещё раз.",
  },
  EN: {
    title: "Coach Inbox",
    subtitle: "Messages sent to your GamePro coach profile.",
    greeting: "Hello!",
    read: "Read",
    unread: "Unread",
    playerId: "Player ID",
    noMessages: "No messages yet.",
    loading: "Loading messages...",
    loadError: "Error loading data",
    connectionError: "Connection error. Please try again.",
  },
  TR: {
    title: "Antrenör Gelen Kutusu",
    subtitle: "GamePro antrenör profilinize gönderilen mesajlar.",
    greeting: "Merhaba!",
    read: "Okundu",
    unread: "Yeni",
    playerId: "Oyuncu ID",
    noMessages: "Henüz mesajınız yok.",
    loading: "Mesajlar yükleniyor...",
    loadError: "Veriler yüklenirken hata oluştu",
    connectionError: "Bağlantı hatası. Lütfen tekrar deneyin.",
  },
  DE: {
    title: "Trainer-Posteingang",
    subtitle: "Nachrichten an dein GamePro-Trainerprofil.",
    greeting: "Hallo!",
    read: "Gelesen",
    unread: "Ungelesen",
    playerId: "Spieler-ID",
    noMessages: "Noch keine Nachrichten.",
    loading: "Nachrichten werden geladen...",
    loadError: "Fehler beim Laden der Daten",
    connectionError: "Verbindungsfehler. Bitte erneut versuchen.",
  },
  ES: {
    title: "Bandeja del Entrenador",
    subtitle: "Mensajes enviados a tu perfil de entrenador de GamePro.",
    greeting: "¡Hola!",
    read: "Leído",
    unread: "Nuevo",
    playerId: "ID del jugador",
    noMessages: "Todavía no tienes mensajes.",
    loading: "Cargando mensajes...",
    loadError: "Error al cargar los datos",
    connectionError: "Error de conexión. Inténtalo de nuevo.",
  },
  FR: {
    title: "Boîte de réception du coach",
    subtitle: "Messages envoyés à votre profil de coach GamePro.",
    greeting: "Bonjour !",
    read: "Lu",
    unread: "Nouveau",
    playerId: "ID du joueur",
    noMessages: "Vous n'avez pas encore de messages.",
    loading: "Chargement des messages...",
    loadError: "Erreur lors du chargement des données",
    connectionError: "Erreur de connexion. Veuillez réessayer.",
  },
  PL: {
    title: "Skrzynka trenera",
    subtitle: "Wiadomości wysłane na Twój profil trenera GamePro.",
    greeting: "Cześć!",
    read: "Przeczytano",
    unread: "Nowa",
    playerId: "ID gracza",
    noMessages: "Nie masz jeszcze żadnych wiadomości.",
    loading: "Ładowanie wiadomości...",
    loadError: "Błąd ładowania danych",
    connectionError: "Błąd połączenia. Spróbuj ponownie.",
  },
};

  type LangKey = keyof typeof translations;

  export default function CoachMessagesPage() {
  const [lang, setLang] = useState<LangKey>("RU");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const updateLanguage = () => {
      const savedLang = localStorage.getItem("gamepro-lang");

      if (savedLang && savedLang in translations) {
        setLang(savedLang as LangKey);
      }
    };

    updateLanguage();

    window.addEventListener("languageChanged", updateLanguage);

    return () => {
      window.removeEventListener("languageChanged", updateLanguage);
    };
  }, []);
  
    useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch("/api/coach/messages");
        const data = await res.json();
        
        if (!res.ok) {
          setError(t.loadError);
          return;
        }

        setMessages(data.messages ?? []);
      } catch {
        setError(t.connectionError);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  // Текущий набор текстов в зависимости от языка
  const t = translations[lang];

  return (
  <main
      style={{
        minHeight: "100vh",
        background: "#080d1b",
        color: "#f4f7ff",
        padding: "0px 20px 40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* КРАСИВЫЙ ОБЩИЙ КОНТЕЙНЕР КАРТОЧКИ */}
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          background: "rgba(13, 20, 38, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "30px 35px 35px 35px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          marginTop: "-70px",
        }}
      >
        {/* ВЕРХНЯЯ НАВИГАЦИЯ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <Link
            href="/"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            &lt;- GamePro
          </Link>
          
         </div>

        {/* ДИНАМИЧЕСКИЙ ЗАГОЛОВОК СТРАНИЦЫ */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            margin: "0 0 8px 0",
          }}
        >
          {t.title}
        </h1>
        {/* ДИНАМИЧЕСКИЙ ПОДЗАГОЛОВОК */}
        <p
          style={{
            color: "#94a3b8",
            fontSize: "16px",
            margin: "0 0 20px 0",
          }}
        >
          {t.subtitle}
        </p>

        {/* ТЕГ ПРОФИЛЯ ТРЕНЕРА */}
        <div style={{ marginBottom: "10px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              borderRadius: "20px",
              padding: "6px 16px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            🟢 BlueSquid#214180 🟢
          </span>
        </div>

        {/* СПИСОК СООБЩЕНИЙ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {loading && <p>{t.loading}</p>}
          {!loading && !error && messages.length === 0 && (
            <p style={{ color: "#64748b" }}>{t.noMessages}</p>
          )}

          {!loading &&
            !error &&
            messages.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "30px 26px",
                  background: "#17233d",
                  border: "2px solid #477fe0",
                  borderRadius: "28px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}
              >
                {/* ДАТА ОТПРАВКИ */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#aab5d0",
                      fontSize: "15px",
                    }}
                  >
                    {new Date(item.created_at).toLocaleString("ru-RU")}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* КРУГЛАЯ АВАТАРКА */}
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      minWidth: "100px",
                      borderRadius: "50%",
                      background: "#202d48",
                      border: "2px solid #34425d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aab5d0",
                      fontSize: "25px",
                      fontWeight: 700,
                    }}
                  >
                    P{item.sender_id}
                  </div>

                  {/* КОНТЕНТ */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                     {/* ДИНАМИЧЕСКИЙ ТЕКСТ СООБЩЕНИЯ */}
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 700,
                        color: "#ffffff",
                        overflowWrap: "anywhere",
                        lineHeight: 1.3,
                        marginBottom: "16px",
                      }}
                    >
                      {/* Если в базе лежит "Здравствуй!", подменяем переводным значением */}
                      {item.message === "Здравствуй!" ? t.greeting : item.message}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: "#aab5d0",
                          fontSize: "16px",
                        }}
                      >
                       Player ID: {t.playerId}: {item.sender_id}
                      </span>

                      <span
                        style={{
                          padding: "6px 16px",
                          border: `2px solid ${item.is_read ? "#20c978" : "#f5a623"}`,
                          borderRadius: "30px",
                          color: item.is_read ? "#20c978" : "#f5a623",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                       {item.is_read ? t.read : t.unread}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </main>
  );
}
