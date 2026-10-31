"use client";

import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";
type ReviewFilter = "all" | 3 | 4 | 5;

const translations: Record<Lang, any> = {
  RU: {
    how: "Как это работает",
    players: "Игроки",
    reviews: "Отзывы",
    guilds: "Гильдии",
    contact: "Контакты",
    login: "Войти",
    logout: "Выйти",
    title: "Отзывы о GamePro Market",
    subtitle: "Мнения игроков о нашей платформе",
    all: "Все отзывы",
    loginFirst: "Войдите, чтобы оставить отзыв",
    placeholder: "Расскажите о своём опыте...",
    send: "Оставить отзыв",
    sending: "Отправка...",
    sent: "Спасибо! Ваш отзыв отправлен.",
    error: "Не удалось отправить отзыв",
    empty: "Отзыв не может быть пустым",
    noReviews: "Пока нет отзывов. Будьте первым!",
  },
  EN: {
    how: "How it works",
    players: "Players",
    reviews: "Reviews",
    guilds: "Guilds",
    contact: "Contact",
    login: "Login",
    logout: "Logout",
    title: "GamePro Market Reviews",
    subtitle: "What players think about our platform",
    all: "All reviews",
    loginFirst: "Log in to leave a review",
    placeholder: "Tell us about your experience...",
    send: "Leave a review",
    sending: "Sending...",
    sent: "Thank you! Your review has been submitted.",
    error: "Failed to submit review",
    empty: "Review cannot be empty",
    noReviews: "No reviews yet. Be the first!",
  },
  TR: {
    how: "Nasıl çalışır",
    players: "Oyuncular",
    reviews: "Yorumlar",
    guilds: "Loncalar",
    contact: "İletişim",
    login: "Giriş",
    logout: "Çıkış",
    title: "GamePro Market Yorumları",
    subtitle: "Oyuncuların platformumuz hakkındaki görüşleri",
    all: "Tüm yorumlar",
    loginFirst: "Yorum yapmak için giriş yapın",
    placeholder: "Deneyiminizi anlatın...",
    send: "Yorum yap",
    sending: "Gönderiliyor...",
    sent: "Teşekkürler! Yorumunuz gönderildi.",
    error: "Yorum gönderilemedi",
    empty: "Yorum boş olamaz",
    noReviews: "Henüz yorum yok. İlk siz olun!",
  },
  DE: {
    how: "So funktioniert es",
    players: "Spieler",
    reviews: "Bewertungen",
    guilds: "Gilden",
    contact: "Kontakt",
    login: "Anmelden",
    logout: "Abmelden",
    title: "GamePro Market Bewertungen",
    subtitle: "Meinungen der Spieler über unsere Plattform",
    all: "Alle Bewertungen",
    loginFirst: "Melde dich an, um eine Bewertung zu schreiben",
    placeholder: "Erzähle uns von deiner Erfahrung...",
    send: "Bewertung abgeben",
    sending: "Wird gesendet...",
    sent: "Danke! Deine Bewertung wurde gesendet.",
    error: "Bewertung konnte nicht gesendet werden",
    empty: "Die Bewertung darf nicht leer sein",
    noReviews: "Noch keine Bewertungen. Sei der Erste!",
  },
  ES: {
    how: "Cómo funciona",
    players: "Jugadores",
    reviews: "Reseñas",
    guilds: "Gremios",
    contact: "Contacto",
    login: "Entrar",
    logout: "Salir",
    title: "Reseñas de GamePro Market",
    subtitle: "Opiniones de los jugadores sobre nuestra plataforma",
    all: "Todas las reseñas",
    loginFirst: "Inicia sesión para dejar una reseña",
    placeholder: "Cuéntanos tu experiencia...",
    send: "Dejar reseña",
    sending: "Enviando...",
    sent: "¡Gracias! Tu reseña ha sido enviada.",
    error: "No se pudo enviar la reseña",
    empty: "La reseña no puede estar vacía",
    noReviews: "Aún no hay reseñas. ¡Sé el primero!",
  },
  FR: {
    how: "Comment ça marche",
    players: "Joueurs",
    reviews: "Avis",
    guilds: "Guildes",
    contact: "Contact",
    login: "Connexion",
    logout: "Déconnexion",
    title: "Avis GamePro Market",
    subtitle: "Les joueurs parlent de notre plateforme",
    all: "Tous les avis",
    loginFirst: "Connectez-vous pour laisser un avis",
    placeholder: "Racontez votre expérience...",
    send: "Laisser un avis",
    sending: "Envoi...",
    sent: "Merci ! Votre avis a été envoyé.",
    error: "Impossible d'envoyer l'avis",
    empty: "L'avis ne peut pas être vide",
    noReviews: "Pas encore d'avis. Soyez le premier !",
  },
  PL: {
    how: "Jak to działa",
    players: "Gracze",
    reviews: "Opinie",
    guilds: "Gildie",
    contact: "Kontakt",
    login: "Zaloguj",
    logout: "Wyloguj",
    title: "Opinie GamePro Market",
    subtitle: "Co gracze myślą o naszej platformie",
    all: "Wszystkie opinie",
    loginFirst: "Zaloguj się, aby dodać opinię",
    placeholder: "Opowiedz o swoich doświadczeniach...",
    send: "Dodaj opinię",
    sending: "Wysyłanie...",
    sent: "Dziękujemy! Twoja opinia została wysłana.",
    error: "Nie udało się wysłać opinii",
    empty: "Opinia nie może być pusta",
    noReviews: "Brak opinii. Bądź pierwszy!",
  },
};

export default function ReviewsPage() {
  const { status } = useSession();

  const [lang, setLang] = useState<Lang>("EN");
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFilter, setReviewFilter] =
    useState<ReviewFilter>("all");
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewSending, setReviewSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];

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
      setLang(savedLang as Lang);
    }

    const handleLanguageChange = () => {
      const current = localStorage.getItem("gamepro-lang");

      if (
        current === "RU" ||
        current === "EN" ||
        current === "TR" ||
        current === "DE" ||
        current === "ES" ||
        current === "FR" ||
        current === "PL"
      ) {
        setLang(current as Lang);
      }
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );
    };
  }, []);

  const changeLanguage = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("gamepro-lang", newLang);
    window.dispatchEvent(new Event("languageChanged"));
  };

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

 То  const submitReview = async () => {
    if (status !== "authenticated") {
      setReviewStatus(t.loginFirst);
      return;
    }

    if (!reviewText.trim()) {
      setReviewStatus(t.empty);
      return;
    }

    setReviewSending(true);
    setReviewStatus(t.sending);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reviewText.trim(),
          rating: reviewRating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.error);
      }

      setReviewText("");
      setReviewRating(5);
      setReviewStatus(t.sent);
      await loadReviews();
    } catch (error: any) {
      setReviewStatus(
        error instanceof Error ? error.message : t.error
      );
    } finally {
      setReviewSending(false);
    }
  };

  // Вычисления для счетчиков отзывов
  const reviewCounts = {
    all: reviews.length,
    5: reviews.filter((r: any) => Number(r.rating) === 5).length,
    4: reviews.filter((r: any) => Number(r.rating) === 4).length,
    3: reviews.filter((r: any) => Number(r.rating) === 3).length,
  };

  // Фильтрация отзывов для рендера
  const filteredReviews =
    reviewFilter === "all"
      ? reviews
      : reviews.filter(
          (r: any) => Number(r.rating) === Number(reviewFilter)
        );

  // Правильное описание типа объекта в массиве для TypeScript
  interface FilterItem {
    value: ReviewFilter;
    label: string;
    color: string;
  }

  const filters: FilterItem[] = [
    {
      value: "all",
      label: `${t.all} (${reviewCounts.all})`,
      color: "#4789ff",
    },
    {
      value: 5,
      label: `5 ⭐️ (${reviewCounts[5]})`,
      color: "#4789ff",
    },
    {
      value: 4,
      label: `4 ⭐️ (${reviewCounts[4]})`,
      color: "#22c55e",
    },
    {
      value: 3,
      label: `3 ⭐️ (${reviewCounts[3]})`,
      color: "#a855f7",
    },
  ];

  const colors = [
    "#4789ff",
    "#22c55e",
    "#a855f7",
    "#ef476f",
    "#f59e0b",
    "#06b6d4",
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050713",
        color: "#f7f8ff",
        fontFamily: "Arial,sans-serif",
      }}
    >
      <Header
        lang={lang}
        setLang={changeLanguage}
        t={t}
        isLoggedIn={status === "authenticated"}
      />

      <section
        style={{
          maxWidth: 1160,
          width: "92%",
          margin: "auto",
          padding: "45px 0 60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 750,
              color: "#ffffff",
            }}
          >
            {t.title}
          </h1>

          <span
            style={{
              padding: "9px 16px",
              border: "1px solid #4789ff",
              borderRadius: 12,
              color: "#4789ff",
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            {reviews.length}
          </span>
        </div>

        <p style={{ color: "#9da6c0", marginBottom: 28 }}>
          {t.subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {filters.map(item => (
            <button
              key={String(item.value)}
              type="button"
              onClick={() => setReviewFilter(item.value)}
              style={{
                padding: "12px 22px",
                borderRadius: 14,
                border: `1px solid ${item.color}`,
                background:
                  reviewFilter === item.value
                    ? item.color
                    : "#101727",
                color:
                  reviewFilter === item.value
                    ? "#ffffff"
                    : item.color,
                fontSize: 16,
                fontWeight: 650,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          style={{
            background:
              "linear-gradient(145deg,#101727,#080d1b)",
            border: "1px solid #303b52",
            borderRadius: 18,
            padding: 18,
            marginBottom: 24,
            boxSizing: "border-box",
          }}
        >
         {status !== "authenticated" ? (
            <p
              style={{
                color: "#9da6c0",
                textAlign: "center",
                margin: 8,
              }}
            >
              {t.loginFirst}
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    style={{
                      background: "transparent",
                      border: 0,
                      cursor: "pointer",
                      fontSize: 25,
                      padding: 2,
                      opacity: star <= reviewRating ? 1 : 0.3,
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <div className="reviewFormRow">
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder={t.placeholder}
                  maxLength={1000}
                  style={{
                    flex: 1,
                    width: "100%",
                    minWidth: 0,
                    minHeight: 58,
                    boxSizing: "border-box",
                    resize: "vertical",
                    background: "#090e1d",
                    border: "1px solid #303b52",
                    borderRadius: 12,
                    padding: 15,
                    color: "white",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: 15,
                  }}
                />

                <button
                  onClick={submitReview}
                  disabled={reviewSending}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #4789ff",
                    borderRadius: 12,
                    background: "#356bea",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: reviewSending ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✈️ {reviewSending ? t.sending : t.send}
                </button>
              </div>

              {reviewStatus && (
                <p
                  role="status"
                  style={{
                    color: "#52eee3",
                    marginBottom: 0,
                  }}
                >
                  {reviewStatus}
                </p>
              )}
            </>
          )}
        </div>

        {loading ? (
          <p style={{ color: "#9da6c0", textAlign: "center" }}>
            ...
          </p>
        ) : (
          <div className="reviewsGrid">
            {filteredReviews.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 30,
                  textAlign: "center",
                  color: "#9da6c0",
                  background: "#101727",
                  borderRadius: 16,
                }}
              >
                {t.noReviews}
              </div>
            ) : (
            filteredReviews.map((review: any, index: number) => {
            const firstLetter = review.author_name ? review.author_name.charAt(0).toUpperCase() : "U";
            const currentRating = Math.max(0, Math.min(5, Number(review.rating) || 0));
            const cardColor = colors && colors.length > 0 ? colors[index % colors.length] : "#4789ff";

            return (
              <div
                key={review.id || index}
                style={{
                  background: "linear-gradient(145deg, #101727, #080d1b)",
                  border: "1px solid #303b52",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  gap: 16,
                  alignItems: "start",
                  boxSizing: "border-box"
                }}
              >
                {/* Круглая аватарка */}
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    background: linear-gradient(135deg, ${cardColor}, #356bea),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#ffffff",
                    flexShrink: 0
                  }}
                >
                  {firstLetter}
                </div>

                {/* Контент отзыва */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 5px",
                      color: "#ffffff",
                      fontSize: 18,
                      fontWeight: 700,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {review.author_name || "GamePro player"}
                  </h3>

                  {/* Звезды */}
                  <div
                    style={{
                      fontSize: 18,
                      letterSpacing: 2,
                      marginBottom: 7,
                      color: "#ffb800"
                    }}
                  >
                    {"★".repeat(currentRating)}
                    {"☆".repeat(5 - currentRating)}
                  </div>

                  <p
                    style={{
                      color: "#e2e8f0",
                      lineHeight: 1.5,
                      margin: 0,
                      fontSize: 15,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {review.text}
                  </p>
                </div>
              </div>
            );
          })
            )}
          </div>
        )}
      </section>

      <style jsx>{
        .reviewsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .reviewFormRow {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        @media (max-width: 650px) {
          .reviewsGrid {
            grid-template-columns: 1fr;
          }

          .reviewFormRow {
            flex-direction: column;
          }

          .reviewFormRow button {
            width: 100%;
          }
        }
      }</style>
    </main>
  );
}
