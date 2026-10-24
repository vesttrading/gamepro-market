"use client";

import { useEffect, useState } from "react";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";

const translations: Record<Lang, Record<string, string>> = {
  RU: {
    profile: "Профиль тренера",
    verified: "✓ ПОДТВЕРЖДЁН",
    services: "Услуги тренера",
    noServices: "Услуги пока не добавлены.",
    noDescription: "Описание пока не добавлено.",
    reviews: "Отзывы тренера",
    noReviews: "Пока нет отзывов о тренере",
    coachDescription: "Опытный игрок WoW. Обучаю Mythic+ новичков и опытных игроков.",
    serviceTitle: "Тренировка Mythic+",
    serviceType: "Обучение",
    serviceDescription: "Индивидуальная тренировка Mythic+.",
  },
  EN: {
    profile: "Coach Profile",
    verified: "✓ VERIFIED",
    services: "Coaching Services",
    noServices: "No services published yet.",
    noDescription: "No description yet.",
    reviews: "Coach Reviews",
    noReviews: "No reviews for this coach yet",
    coachDescription: "Experienced WoW player offering Mythic+ coaching for beginners and advanced players.",
    serviceTitle: "Mythic+ Coaching Session",
    serviceType: "Coaching",
    serviceDescription: "Personalized Mythic+ coaching session.",
  },
  TR: {
    profile: "Koç Profili",
    verified: "✓ DOĞRULANDI",
    services: "Koçluk Hizmetleri",
    noServices: "Henüz hizmet eklenmedi.",
    noDescription: "Henüz açıklama yok.",
    reviews: "Koç Değerlendirmeleri",
    noReviews: "Bu koç için henüz değerlendirme yok",
    coachDescription: "Yeni başlayan ve deneyimli oyunculara Mythic+ eğitimi veren deneyimli WoW oyuncusu.",
    serviceTitle: "Mythic+ Eğitimi",
    serviceType: "Eğitim",
    serviceDescription: "Kişiye özel Mythic+ eğitim seansı.",
  },
  DE: {
    profile: "Trainerprofil",
    verified: "✓ VERIFIZIERT",
    services: "Coaching-Angebote",
    noServices: "Noch keine Angebote vorhanden.",
    noDescription: "Noch keine Beschreibung vorhanden.",
    reviews: "Trainerbewertungen",
    noReviews: "Dieser Trainer hat noch keine Bewertungen",
    coachDescription: "Erfahrener WoW-Spieler, der Mythic+ für Anfänger und erfahrene Spieler trainiert.",
    serviceTitle: "Mythic+-Trainingseinheit",
    serviceType: "Coaching",
    serviceDescription: "Individuelle Mythic+-Trainingseinheit.",
  },
  ES: {
    profile: "Perfil del entrenador",
    verified: "✓ VERIFICADO",
    services: "Servicios de entrenamiento",
    noServices: "Todavía no hay servicios.",
    noDescription: "Todavía no hay descripción.",
    reviews: "Opiniones del entrenador",
    noReviews: "Este entrenador aún no tiene opiniones",
    coachDescription: "Jugador experimentado de WoW que ofrece entrenamiento de Mythic+ para principiantes y jugadores avanzados.",
    serviceTitle: "Sesión de entrenamiento Mythic+",
    serviceType: "Entrenamiento",
    serviceDescription: "Sesión personalizada de entrenamiento Mythic+.",
  },
  FR: {
    profile: "Profil du coach",
    verified: "✓ VÉRIFIÉ",
    services: "Services de coaching",
    noServices: "Aucun service pour le moment.",
    noDescription: "Aucune description pour le moment.",
    reviews: "Avis sur le coach",
    noReviews: "Ce coach n’a pas encore d’avis",
    coachDescription: "Joueur expérimenté de WoW proposant du coaching Mythic+ aux débutants et aux joueurs avancés.",
    serviceTitle: "Séance de coaching Mythic+",
    serviceType: "Coaching",
    serviceDescription: "Séance personnalisée de coaching Mythic+.",
  },
  PL: {
    profile: "Profil trenera",
    verified: "✓ ZWERYFIKOWANO",
    services: "Usługi trenerskie",
    noServices: "Brak dostępnych usług.",
    noDescription: "Brak opisu.",
    reviews: "Opinie o trenerze",
    noReviews: "Ten trener nie ma jeszcze opinii",
    coachDescription: "Doświadczony gracz WoW oferujący trening Mythic+ dla początkujących i zaawansowanych graczy.",
    serviceTitle: "Sesja treningowa Mythic+",
    serviceType: "Trening",
    serviceDescription: "Indywidualna sesja treningowa Mythic+.",
  },
};

export function translateCoachContent(
  value: string | null | undefined,
  key: "coachDescription" | "serviceTitle" | "serviceType" | "serviceDescription",
  lang: Lang
) {
  if (!value) return "";

  const originalDescription =
    "Experienced WoW player offering Mythic+ coaching for beginners and advanced players.";

  const originalValues: Record<string, string> = {
    coachDescription: originalDescription,
    serviceTitle: "Mythic+ Coaching Session",
    serviceType: "Coaching",
    serviceDescription: "Personalized Mythic+ coaching session.",
  };

  // Описание услуги совпадает с описанием тренера
  if (key === "serviceDescription" && value === originalDescription) {
    return translations[lang].coachDescription;
  }

  if (value !== originalValues[key]) return value;

  return translations[lang][key];
}

type ContentKey =
  | "coachDescription"
  | "serviceTitle"
  | "serviceType"
  | "serviceDescription";

export function CoachContent({
  value,
  text,
}: {
  value: string | null | undefined;
  text: ContentKey;
}) {
  const [lang, setLang] = useState<Lang>("EN");

  useEffect(() => {
    const updateLang = () => {
      const saved = localStorage.getItem("gamepro-lang") as Lang | null;
      const supported: Lang[] = ["RU", "EN", "TR", "DE", "ES", "FR", "PL"];

      setLang(saved && supported.includes(saved) ? saved : "EN");
    };

    updateLang();
    window.addEventListener("languageChanged", updateLang);
    window.addEventListener("storage", updateLang);

    return () => {
      window.removeEventListener("languageChanged", updateLang);
      window.removeEventListener("storage", updateLang);
    };
  }, []);

  return (
    <>
      {translateCoachContent(value, text, lang) ||
        translations[lang].noDescription}
    </>
  );
}

export default function CoachText({
  text,
}: {
  text: keyof (typeof translations)["EN"];
}) {
  const [lang, setLang] = useState<Lang>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("gamepro-lang") as Lang | null;
    const supported: Lang[] = ["RU", "EN", "TR", "DE", "ES", "FR", "PL"];

    if (saved && supported.includes(saved)) {
      setLang(saved);
    }
  }, []);

  return <>{translations[lang][text]}</>;
}
