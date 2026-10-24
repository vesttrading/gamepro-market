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
  },
  EN: {
    profile: "Coach Profile",
    verified: "✓ VERIFIED",
    services: "Coaching Services",
    noServices: "No services published yet.",
    noDescription: "No description yet.",
    reviews: "Coach Reviews",
    noReviews: "No reviews for this coach yet",
  },
  TR: {
    profile: "Koç Profili",
    verified: "✓ DOĞRULANDI",
    services: "Koçluk Hizmetleri",
    noServices: "Henüz hizmet eklenmedi.",
    noDescription: "Henüz açıklama yok.",
    reviews: "Koç Değerlendirmeleri",
    noReviews: "Bu koç için henüz değerlendirme yok",
  },
  DE: {
    profile: "Trainerprofil",
    verified: "✓ VERIFIZIERT",
    services: "Coaching-Angebote",
    noServices: "Noch keine Angebote vorhanden.",
    noDescription: "Noch keine Beschreibung vorhanden.",
    reviews: "Trainerbewertungen",
    noReviews: "Dieser Trainer hat noch keine Bewertungen",
  },
  ES: {
    profile: "Perfil del entrenador",
    verified: "✓ VERIFICADO",
    services: "Servicios de entrenamiento",
    noServices: "Todavía no hay servicios.",
    noDescription: "Todavía no hay descripción.",
    reviews: "Opiniones del entrenador",
    noReviews: "Este entrenador aún no tiene opiniones",
  },
  FR: {
    profile: "Profil du coach",
    verified: "✓ VÉRIFIÉ",
    services: "Services de coaching",
    noServices: "Aucun service pour le moment.",
    noDescription: "Aucune description pour le moment.",
    reviews: "Avis sur le coach",
    noReviews: "Ce coach n’a pas encore d’avis",
  },
  PL: {
    profile: "Profil trenera",
    verified: "✓ ZWERYFIKOWANO",
    services: "Usługi trenerskie",
    noServices: "Brak dostępnych usług.",
    noDescription: "Brak opisu.",
    reviews: "Opinie o trenerze",
    noReviews: "Ten trener nie ma jeszcze opinii",
  },
};

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
