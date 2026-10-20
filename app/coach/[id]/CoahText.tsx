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
  },
  EN: {
    profile: "Coach Profile",
    verified: "✓ VERIFIED",
    services: "Coaching Services",
    noServices: "No services published yet.",
    noDescription: "No description yet.",
  },
  TR: {
    profile: "Koç Profili",
    verified: "✓ DOĞRULANDI",
    services: "Koçluk Hizmetleri",
    noServices: "Henüz hizmet eklenmedi.",
    noDescription: "Henüz açıklama yok.",
  },
  DE: {
    profile: "Trainerprofil",
    verified: "✓ VERIFIZIERT",
    services: "Coaching-Angebote",
    noServices: "Noch keine Angebote vorhanden.",
    noDescription: "Noch keine Beschreibung vorhanden.",
  },
  ES: {
    profile: "Perfil del entrenador",
    verified: "✓ VERIFICADO",
    services: "Servicios de entrenamiento",
    noServices: "Todavía no hay servicios.",
    noDescription: "Todavía no hay descripción.",
  },
  FR: {
    profile: "Profil du coach",
    verified: "✓ VÉRIFIÉ",
    services: "Services de coaching",
    noServices: "Aucun service pour le moment.",
    noDescription: "Aucune description pour le moment.",
  },
  PL: {
    profile: "Profil trenera",
    verified: "✓ ZWERYFIKOWANO",
    services: "Usługi trenerskie",
    noServices: "Brak dostępnych usług.",
    noDescription: "Brak opisu.",
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
