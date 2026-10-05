"use client";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { signIn,signOut,useSession } from "next-auth/react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const L = {
  RU: {
    games:"Игры", players:"Игроки", guilds:"Гильдии", how:"Как это работает", contact:"Контакты",
    allRoles:"Все роли",
    roleTank:"Танк",
    roleHealer:"Хилер",
    roleDPS:"ДД (DPS)",
    allClasses:"Все классы",
    classMage:"Маг",
    classPaladin:"Паладин",
    classDruid:"Друид",
    classWarrior:"Воин",
    classPriest:"Жрец",
    classRogue:"Разбойник",
    minRating:"Мин. рейтинг",
    verifyViaRaiderIO:"Проверить игрока через Raider.IO",
    characterName:"Имя персонажа",
    realmPlaceholder:"Реалм, например Kazzak",
    liveSourceText:"Первый живой источник GamePro для Mythic+ данных",
    verifying: "Проверяется",
    verify:"Проверить",
    verifyPlayer:"Проверить игрока",
    reviewSent:"Отзыв отправлен.",
    reviewError:"Не удалось отправить отзыв.",
    saveError:"Не удалось сохранить данные.",
    rioNameRealm:"Укажи имя персонажа и реалм.",
    rioNotFound:"Персонаж не найден в Raider.IO.",
    rioError:"Не удалось получить данные Raider.IO.",
    supabaseNotConfigured:"Supabase не настроен в переменных Vercel.",
    recordNotFound:"Не удалось найти сохранённую запись.",
    saveFirst:"Сначала нажми «Сохранить в GamePro».",
    verifiedGamePro:"✓ VERIFIED подтверждён GamePro.",
    loginFirst:"Сначала войди через Battle.net.",
    dataSaved:"✓ Данные сохранены в Supabase. Пока это DATA FOUND, не VERIFIED.",
    supabaseError:"Supabase не принял данные.",
    verifiedError:"Не удалось подтвердить VERIFIED.",
    noName:"Без имени",
    reviewIntro:"GamePro — отзывы игроков.",
    leaveReview:"Оставить отзыв",
    loginToReview:"Войди через Battle.net, чтобы оставить отзыв.",
    reviewPlaceholder:"Напиши свой отзыв о GamePro...",
    sending:"Отправляем…",
    submitReview:"✍️ Оставить отзыв",
    noReviews:"Пока нет отзывов. Будь первым игроком!",
    gameproPlayer:"GamePro игрок",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Сохранить в GamePro",
    confirmVerified:"Подтвердить VERIFIED",
    h1:"Докажи свой скилл.", h2:"Покажи свои достижения.",
    intro:"Игровой профиль с подтверждёнными достижениями. Собери свой Achievement Passport и покажи гильдиям и командам, на что ты способен.",
    create:"Создать игровой паспорт", find:"Найти игрока", passport:"Achievement Passport",
    sub:"Не слова — подтверждённые результаты.", verified:"Профиль подтверждён", verifiedShort:"VERIFIED",
    searchTitle:"Найти игрока", searchSub:"Ищи по роли, рейтингу и подтверждённым достижениям.",
    placeholder:"Например: Holy Paladin 2700+", search:"Поиск",
    howTitle:"Как работает проверка", howSub:"От игровых данных до зелёного VERIFIED-бейджа.",
    guild:"Гильдии и команды", guildText:"Находите игроков по роли, рейтингу и подтверждённому прогрессу — без ручной проверки каждого скриншота.",
    open:"Открыть поиск игроков", share:"Поделиться паспортом", copied:"Ссылка скопирована!",
    current:"Сейчас доступно", future:"Скоро", wow:"World of Warcraft", wowText:"Mythic+, рейды и PvP — первая игра GamePro.",
    futureText:"Dota 2, CS2 и Path of Exile 2 уже в плане развития.", source:"Источник", sourceText:"GamePro сверяет игровые данные с поддерживаемыми источниками.",
    check:"Проверка", checkText:"Данные проходят проверку перед получением статуса VERIFIED.",
    badge:"VERIFIED", badgeText:"Только подтверждённые достижения получают зелёный бейдж.",
    passportLink:"Паспорт игрока", shareTitle:"Твой игровой профиль — одной ссылкой", login:"Войти через Battle.net", reviews:"Отзывы", gameproRating:"Оценка GamePro", playerReviews:"Отзывы игроков", verifiedReviews:"Отзывы о системе VERIFIED",
    logout:"Выйти",
  },
  EN: {
    games:"Games", players:"Players", guilds:"Guilds", how:"How it works", contact:"Contact",
    allRoles:"All roles",
    roleTank:"Tank",
    roleHealer:"Healer",
    roleDPS:"DPS",
    allClasses:"All classes",
    classMage:"Mage",
    classPaladin:"Paladin",
    classDruid:"Druid",
    classWarrior:"Warrior",
    classPriest:"Priest",
    classRogue:"Rogue",
    minRating:"Min. rating",
    verifyViaRaiderIO:"Check player via Raider.IO",
    characterName:"Character name",
    realmPlaceholder:"Realm, e.g. Kazzak",
    liveSourceText:"The first live GamePro source for Mythic+ data",
    verifying: "Проверяется",
    verify:"Check",
    verifyPlayer:"Check player",
    reviewSent:"Review submitted.",
    reviewError:"Failed to submit review.",
    saveError:"Failed to save data.",
    rioNameRealm:"Enter character name and realm.",
    rioNotFound:"Character not found on Raider.IO.",
    rioError:"Failed to get Raider.IO data.",
    supabaseNotConfigured:"Supabase is not configured in Vercel environment variables.",
    recordNotFound:"Could not find the saved record.",
    saveFirst:"Click “Save to GamePro” first.",
    verifiedGamePro:"✓ VERIFIED confirmed by GamePro.",
    loginFirst:"Login with Battle.net first.",
    dataSaved:"✓ Data saved to Supabase. Currently DATA FOUND, not VERIFIED.",
    supabaseError:"Supabase did not accept the data.",
    verifiedError:"Could not confirm VERIFIED.",
    noName:"No name",
    reviewIntro:"GamePro — player reviews.",
    leaveReview:"Leave a review",
    loginToReview:"Login with Battle.net to leave a review.",
    reviewPlaceholder:"Write your review of GamePro...",
    sending:"Sending…",
    submitReview:"✍️ Leave a review",
    noReviews:"No reviews yet. Be the first player!",
    gameproPlayer:"GamePro player",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Save to GamePro",
    confirmVerified:"Confirm VERIFIED",
    h1:"Prove your skill.", h2:"Show your achievements.",
    intro:"A gaming profile with verified achievements. Build your Achievement Passport and show guilds and teams what you can do.",
    create:"Create gaming passport", find:"Find a player", passport:"Achievement Passport",
    sub:"Not words — verified results.", verified:"Profile verified", verifiedShort:"VERIFIED",
    searchTitle:"Find a player", searchSub:"Search by role, rating and verified achievements.",
    placeholder:"For example: Holy Paladin 2700+", search:"Search",
    howTitle:"How verification works", howSub:"From game data to a green VERIFIED badge.",
    guild:"Guilds & teams", guildText:"Find players by role, rating and verified progress — without manually checking every screenshot.",
    open:"Open player search", share:"Share passport", copied:"Link copied!",
    current:"Available now", future:"Coming soon", wow:"World of Warcraft", wowText:"Mythic+, raids and PvP — the first GamePro game.",
    futureText:"Dota 2, CS2 and Path of Exile 2 are already on the roadmap.", source:"Source", sourceText:"GamePro checks game data against supported sources.",
    check:"Verification", checkText:"Data is checked before an achievement receives VERIFIED status.",
    badge:"VERIFIED", badgeText:"Only verified achievements receive the green badge.",
    passportLink:"Player passport", shareTitle:"Your gaming profile — one link", login:"Login with Battle.net", reviews:"Reviews", gameproRating:"GamePro rating", playerReviews:"Player reviews", verifiedReviews:"VERIFIED system reviews",
    logout:"Log out",
  },
  TR: {
    games:"Oyunlar", players:"Oyuncular", guilds:"Loncalar", how:"Nasıl çalışır", contact:"İletişim",
    allRoles:"Tüm roller",
    roleTank:"Tank",
    roleHealer:"Şifacı",
    roleDPS:"DPS",
    allClasses:"Tüm sınıflar",
    classMage:"Büyücü",
    classPaladin:"Paladin",
    classDruid:"Druid",
    classWarrior:"Savaşçı",
    classPriest:"Rahip",
    classRogue:"Haydut",
    minRating:"Min. puan",
    verifyViaRaiderIO:"Raider.IO üzerinden oyuncuyu kontrol et",
    characterName:"Karakter adı",
    realmPlaceholder:"Realmi, örn. Kazzak",
    liveSourceText:"Mythic+ verileri için ilk canlı GamePro kaynağı",
    verifying: "Doğrulanıyor",
    verify:"Kontrol et",
    verifyPlayer:"Oyuncuyu kontrol et",
    reviewSent:"Yorum gönderildi.",
    reviewError:"Yorum gönderilemedi.",
    saveError:"Veriler kaydedilemedi.",
    rioNameRealm:"Karakter adını ve realmini gir.",
    rioNotFound:"Karakter Raider.IO'da bulunamadı.",
    rioError:"Raider.IO verileri alınamadı.",
    supabaseNotConfigured:"Supabase, Vercel ortam değişkenlerinde yapılandırılmamış.",
    recordNotFound:"Kayıt bulunamadı.",
    saveFirst:"Önce “GamePro'ya Kaydet” düğmesine bas.",
    verifiedGamePro:"✓ VERIFIED GamePro tarafından onaylandı.",
    loginFirst:"Önce Battle.net ile giriş yap.",
    dataSaved:"✓ Veriler Supabase'e kaydedildi. Şu anda DATA FOUND, VERIFIED değil.",
    supabaseError:"Supabase verileri kabul etmedi.",
    verifiedError:"VERIFIED doğrulanamadı.",
    noName:"İsimsiz",
    reviewIntro:"GamePro — oyuncu yorumları.",
    leaveReview:"Yorum bırak",
    loginToReview:"Yorum bırakmak için Battle.net ile giriş yap.",
    reviewPlaceholder:"GamePro hakkında yorumunu yaz...",
    sending:"Gönderiliyor…",
    submitReview:"✍️ Yorum bırak",
    noReviews:"Henüz yorum yok. İlk oyuncu sen ol!",
    gameproPlayer:"GamePro oyuncusu",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"GamePro'ya kaydet",
    confirmVerified:"VERIFIED'ı doğrula",
    h1:"Yeteneğini kanıtla.", h2:"Başarılarını göster.",
    intro:"Doğrulanmış başarılarla oyun profili. Achievement Passport'unu oluştur ve yeteneğini loncalara ve takımlara göster.",
    create:"Oyuncu pasaportu oluştur", find:"Oyuncu bul", passport:"Achievement Passport",
    sub:"Söz değil — doğrulanmış sonuçlar.", verified:"Profil doğrulandı", verifiedShort:"VERIFIED",
    searchTitle:"Oyuncu bul", searchSub:"Rol, puan ve doğrulanmış başarılara göre ara.",
    placeholder:"Örneğin: Holy Paladin 2700+", search:"Ara",
    howTitle:"Doğrulama nasıl çalışır", howSub:"Oyun verilerinden yeşil VERIFIED rozetine.",
    guild:"Loncalar ve takımlar", guildText:"Oyuncuları rol, puan ve doğrulanmış ilerlemeye göre bulun.",
    open:"Oyuncu aramayı aç", share:"Pasaportu paylaş", copied:"Bağlantı kopyalandı!",
    current:"Şimdi mevcut", future:"Yakında", wow:"World of Warcraft", wowText:"Mythic+, raid ve PvP — GamePro'nun ilk oyunu.",
    futureText:"Dota 2, CS2 ve Path of Exile 2 yol haritasında.", source:"Kaynak", sourceText:"GamePro oyun verilerini desteklenen kaynaklarla karşılaştırır.",
    check:"Doğrulama", checkText:"Başarı VERIFIED olmadan önce veriler kontrol edilir.",
    badge:"VERIFIED", badgeText:"Sadece doğrulanmış başarılar yeşil rozet alır.",
    passportLink:"Oyuncu pasaportu", shareTitle:"Oyun profilin — tek bağlantı", login:"Battle.net ile giriş", reviews:"Yorumlar", gameproRating:"GamePro puanı", playerReviews:"Oyuncu yorumları", verifiedReviews:"VERIFIED sistemi yorumları",
    logout:"Çıkış yap",
  },
  DE: {
    games:"Spiele", players:"Spieler", guilds:"Gilden", how:"So funktioniert es", contact:"Kontakt",
    allRoles:"Alle Rollen",
    roleTank:"Tank",
    roleHealer:"Heiler",
    roleDPS:"DPS",
    allClasses:"Alle Klassen",
    classMage:"Magier",
    classPaladin:"Paladin",
    classDruid:"Druide",
    classWarrior:"Krieger",
    classPriest:"Priester",
    classRogue:"Schurke",
    minRating:"Min. Wertung",
    verifyViaRaiderIO:"Spieler über Raider.IO prüfen",
    characterName:"Charaktername",
    realmPlaceholder:"Realm, z. B. Kazzak",
    liveSourceText:"Die erste Live-Quelle von GamePro für Mythic+-Daten",
    verifying: "Wird geprüft",
    verify:"Prüfen",
    verifyPlayer:"Spieler prüfen",
    reviewSent:"Bewertung wurde gesendet.",
    reviewError:"Bewertung konnte nicht gesendet werden.",
    saveError:"Daten konnten nicht gespeichert werden.",
    rioNameRealm:"Charakternamen und Realm eingeben.",
    rioNotFound:"Charakter auf Raider.IO nicht gefunden.",
    rioError:"Raider.IO-Daten konnten nicht abgerufen werden.",
    supabaseNotConfigured:"Supabase ist in den Vercel-Umgebungsvariablen nicht konfiguriert.",
    recordNotFound:"Gespeicherter Eintrag nicht gefunden.",
    saveFirst:"Klicke zuerst auf „In GamePro speichern“.",
    verifiedGamePro:"✓ VERIFIED von GamePro bestätigt.",
    loginFirst:"Melde dich zuerst mit Battle.net an.",
    dataSaved:"✓ Daten in Supabase gespeichert. Aktuell DATA FOUND, nicht VERIFIED.",
    supabaseError:"Supabase hat die Daten nicht akzeptiert.",
    verifiedError:"VERIFIED konnte nicht bestätigt werden.",
    noName:"Kein Name",
    reviewIntro:"GamePro — Spielerbewertungen.",
    leaveReview:"Bewertung abgeben",
    loginToReview:"Melde dich mit Battle.net an, um eine Bewertung abzugeben.",
    reviewPlaceholder:"Schreibe deine Bewertung über GamePro...",
    sending:"Wird gesendet…",
    submitReview:"✍️ Bewertung abgeben",
    noReviews:"Noch keine Bewertungen. Sei der erste Spieler!",
    gameproPlayer:"GamePro-Spieler",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"In GamePro speichern",
    confirmVerified:"VERIFIED bestätigen",
    h1:"Beweise dein Können.", h2:"Zeige deine Erfolge.",
    intro:"Gaming-Profil mit verifizierten Erfolgen. Erstelle deinen Achievement Passport und zeige Gilden und Teams, was du kannst.",
    create:"Spielerpass erstellen", find:"Spieler finden", passport:"Achievement Passport",
    sub:"Keine Worte — verifizierte Ergebnisse.", verified:"Profil verifiziert", verifiedShort:"VERIFIED",
    searchTitle:"Spieler finden", searchSub:"Suche nach Rolle, Wertung und verifizierten Erfolgen.",
    placeholder:"Zum Beispiel: Holy Paladin 2700+", search:"Suchen",
    howTitle:"So funktioniert die Verifizierung", howSub:"Von Spieldaten zum grünen VERIFIED-Badge.",
    guild:"Gilden & Teams", guildText:"Finde Spieler nach Rolle, Wertung und verifiziertem Fortschritt.",
    open:"Spielersuche öffnen", share:"Spielerpass teilen", copied:"Link kopiert!",
    current:"Jetzt verfügbar", future:"Demnächst", wow:"World of Warcraft", wowText:"Mythic+, Raids und PvP — das erste GamePro-Spiel.",
    futureText:"Dota 2, CS2 und Path of Exile 2 stehen bereits auf der Roadmap.", source:"Quelle", sourceText:"GamePro gleicht Spieldaten mit unterstützten Quellen ab.",
    check:"Prüfung", checkText:"Die Daten werden geprüft, bevor ein Erfolg VERIFIED erhält.",
    badge:"VERIFIED", badgeText:"Nur verifizierte Erfolge erhalten das grüne Badge.",
    passportLink:"Spielerpass", shareTitle:"Dein Gaming-Profil — ein Link", login:"Mit Battle.net einloggen", reviews:"Bewertungen", gameproRating:"GamePro-Bewertung", playerReviews:"Spielerbewertungen", verifiedReviews:"Bewertungen zum VERIFIED-System",
    logout:"Abmelden",
  },
  ES: {
    games:"Juegos", players:"Jugadores", guilds:"Gremios", how:"Cómo funciona", contact:"Contacto",
    allRoles:"Todos los roles",
    roleTank:"Tanque",
    roleHealer:"Sanador",
    roleDPS:"DPS",
    allClasses:"Todas las clases",
    classMage:"Mago",
    classPaladin:"Paladín",
    classDruid:"Druida",
    classWarrior:"Guerrero",
    classPriest:"Sacerdote",
    classRogue:"Pícaro",
    minRating:"Rating mín.",
    verifyViaRaiderIO:"Comprobar jugador mediante Raider.IO",
    characterName:"Nombre del personaje",
    realmPlaceholder:"Reino, por ejemplo Kazzak",
    liveSourceText:"La primera fuente en vivo de GamePro para datos de Mythic+",
    verifying: "Verificando",
    verify:"Comprobar",
    verifyPlayer:"Comprobar jugador",
    reviewSent:"Opinión enviada.",
    reviewError:"No se pudo enviar la opinión.",
    saveError:"No se pudieron guardar los datos.",
    rioNameRealm:"Introduce el nombre del personaje y el reino.",
    rioNotFound:"Personaje no encontrado en Raider.IO.",
    rioError:"No se pudieron obtener los datos de Raider.IO.",
    supabaseNotConfigured:"Supabase no está configurado en las variables de entorno de Vercel.",
    recordNotFound:"No se encontró el registro guardado.",
    saveFirst:"Primero pulsa «Guardar en GamePro».",
    verifiedGamePro:"✓ VERIFIED confirmado por GamePro.",
    loginFirst:"Primero inicia sesión con Battle.net.",
    dataSaved:"✓ Datos guardados en Supabase. Actualmente DATA FOUND, no VERIFIED.",
    supabaseError:"Supabase no aceptó los datos.",
    verifiedError:"No se pudo confirmar VERIFIED.",
    noName:"Sin nombre",
    reviewIntro:"GamePro — opiniones de jugadores.",
    leaveReview:"Dejar una opinión",
    loginToReview:"Inicia sesión con Battle.net para dejar una opinión.",
    reviewPlaceholder:"Escribe tu opinión sobre GamePro...",
    sending:"Enviando…",
    submitReview:"✍️ Dejar una opinión",
    noReviews:"Aún no hay opiniones. ¡Sé el primer jugador!",
    gameproPlayer:"Jugador de GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Guardar en GamePro",
    confirmVerified:"Confirmar VERIFIED",
    h1:"Demuestra tu habilidad.", h2:"Muestra tus logros.",
    intro:"Perfil gaming con logros verificados. Crea tu Achievement Passport y demuestra a gremios y equipos lo que puedes hacer.",
    create:"Crear pasaporte gamer", find:"Buscar jugador", passport:"Achievement Passport", sub:"No palabras — resultados verificados.", verified:"Perfil verificado", verifiedShort:"VERIFIED",
    searchTitle:"Buscar jugador", searchSub:"Busca por rol, rating y logros verificados.", placeholder:"Por ejemplo: Holy Paladin 2700+", search:"Buscar",
    howTitle:"Cómo funciona la verificación", howSub:"De los datos del juego a la insignia VERIFIED.", guild:"Gremios y equipos", guildText:"Encuentra jugadores por rol, rating y progreso verificado.", open:"Abrir búsqueda de jugadores", share:"Compartir pasaporte", copied:"¡Enlace copiado!",
    current:"Disponible ahora", future:"Próximamente", wow:"World of Warcraft", wowText:"Mythic+, raids y PvP — el primer juego de GamePro.", futureText:"Dota 2, CS2 y Path of Exile 2 están en la hoja de ruta.", source:"Fuente", sourceText:"GamePro compara los datos del juego con fuentes compatibles.", check:"Verificación", checkText:"Los datos se comprueban antes de recibir el estado VERIFIED.", badge:"VERIFIED", badgeText:"Solo los logros verificados reciben la insignia verde.", passportLink:"Pasaporte del jugador", shareTitle:"Tu perfil gaming — un solo enlace", login:"Entrar con Battle.net", reviews:"Opiniones", gameproRating:"Valoración de GamePro", playerReviews:"Opiniones de jugadores", verifiedReviews:"Opiniones sobre el sistema VERIFIED",
    logout:"Cerrar sesión",
  },
  FR: {
    games:"Jeux", players:"Joueurs", guilds:"Guildes", how:"Comment ça marche", contact:"Contact",
    allRoles:"Tous les rôles",
    roleTank:"Tank",
    roleHealer:"Soigneur",
    roleDPS:"DPS",
    allClasses:"Toutes les classes",
    classMage:"Mage",
     classPaladin:"Paladin",
    classDruid:"Druide",
    classWarrior:"Guerrier",
    classPriest:"Prêtre",
    classRogue:"Voleur",
    minRating:"Rating min.",
    verifyViaRaiderIO:"Vérifier le joueur via Raider.IO",
    characterName:"Nom du personnage",
    realmPlaceholder:"Royaume, par ex. Kazzak",
    liveSourceText:"La première source live de GamePro pour les données Mythic+",
    verifying: "Vérification",
    verify:"Vérifier",
    verifyPlayer:"Vérifier le joueur",
    reviewSent:"Avis envoyé.",
    reviewError:"Impossible d'envoyer l'avis.",
    saveError:"Impossible d'enregistrer les données.",
    rioNameRealm:"Entre le nom du personnage et le royaume.",
    rioNotFound:"Personnage introuvable sur Raider.IO.",
    rioError:"Impossible de récupérer les données Raider.IO.",
    supabaseNotConfigured:"Supabase n'est pas configuré dans les variables d'environnement Vercel.",
    recordNotFound:"Enregistrement sauvegardé introuvable.",
    saveFirst:"Clique d'abord sur « Enregistrer dans GamePro ».",
    verifiedGamePro:"✓ VERIFIED confirmé par GamePro.",
    loginFirst:"Connecte-toi d'abord avec Battle.net.",
    dataSaved:"✓ Données enregistrées dans Supabase. Actuellement DATA FOUND, pas VERIFIED.",
    supabaseError:"Supabase n'a pas accepté les données.",
    verifiedError:"Impossible de confirmer VERIFIED.",
    noName:"Sans nom",
    reviewIntro:"GamePro — avis des joueurs.",
    leaveReview:"Laisser un avis",
    loginToReview:"Connecte-toi avec Battle.net pour laisser un avis.",
    reviewPlaceholder:"Écris ton avis sur GamePro...",
    sending:"Envoi…",
    submitReview:"✍️ Laisser un avis",
    noReviews:"Aucun avis pour le moment. Sois le premier joueur !",
    gameproPlayer:"Joueur GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Enregistrer dans GamePro",
    confirmVerified:"Confirmer VERIFIED",
    h1:"Prouve ton niveau.", h2:"Montre tes accomplissements.",
    intro:"Profil gaming avec accomplissements vérifiés. Crée ton Achievement Passport et montre aux guildes et équipes ce que tu sais faire.",
    create:"Créer mon passeport", find:"Trouver un joueur", passport:"Achievement Passport", sub:"Pas de paroles — des résultats vérifiés.", verified:"Profil vérifié", verifiedShort:"VERIFIED",
    searchTitle:"Trouver un joueur", searchSub:"Recherche par rôle, rating et accomplissements vérifiés.", placeholder:"Par exemple : Holy Paladin 2700+", search:"Rechercher",
    howTitle:"Comment fonctionne la vérification", howSub:"Des données du jeu au badge VERIFIED.", guild:"Guildes et équipes", guildText:"Trouve des joueurs par rôle, rating et progression vérifiée.", open:"Ouvrir la recherche", share:"Partager le passeport", copied:"Lien copié !",
    current:"Disponible maintenant", future:"Bientôt", wow:"World of Warcraft", wowText:"Mythic+, raids et PvP — le premier jeu de GamePro.", futureText:"Dota 2, CS2 et Path of Exile 2 sont sur la feuille de route.", source:"Source", sourceText:"GamePro vérifie les données du jeu avec les sources prises en charge.", check:"Vérification", checkText:"Les données sont vérifiées avant l'attribution du statut VERIFIED.", badge:"VERIFIED", badgeText:"Seuls les accomplissements vérifiés obtiennent le badge vert.", passportLink:"Passeport joueur", shareTitle:"Ton profil gaming — un seul lien", login:"Se connecter avec Battle.net", reviews:"Avis", gameproRating:"Note GamePro", playerReviews:"Avis des joueurs", verifiedReviews:"Avis sur le système VERIFIED",
    logout:"Se déconnecter",
  },
  PL: {
    games:"Gry", players:"Gracze", guilds:"Gildie", how:"Jak to działa", contact:"Kontakt",
    allRoles:"Wszystkie role",
    roleTank:"Tank",
    roleHealer:"Healer",
    roleDPS:"DPS",
    allClasses:"Wszystkie klasy",
    classMage:"Mag",
    classPaladin:"Paladyn",
    classDruid:"Druid",
    classWarrior:"Wojownik",
    classPriest:"Kapłan",
    classRogue:"Łotrzyk",
    minRating:"Min. rating",
    verifyViaRaiderIO:"Sprawdź gracza przez Raider.IO",
    characterName:"Nazwa postaci",
    realmPlaceholder:"Realm, np. Kazzak",
    liveSourceText:"Pierwsze aktywne źródło GamePro dla danych Mythic+",
    verifying: "Weryfikacja",
    verify:"Sprawdź",
    verifyPlayer:"Sprawdź gracza",
    reviewSent:"Opinia została wysłana.",
    reviewError:"Nie udało się wysłać opinii.",
    saveError:"Nie udało się zapisać danych.",
    rioNameRealm:"Podaj nazwę postaci i realm.",
    rioNotFound:"Nie znaleziono postaci na Raider.IO.",
    rioError:"Nie udało się pobrać danych z Raider.IO.",
    supabaseNotConfigured:"Supabase nie jest skonfigurowany w zmiennych środowiskowych Vercel.",
    recordNotFound:"Nie znaleziono zapisanego rekordu.",
    saveFirst:"Najpierw kliknij „Zapisz w GamePro”.",
    verifiedGamePro:"✓ VERIFIED potwierdzone przez GamePro.",
    loginFirst:"Najpierw zaloguj się przez Battle.net.",
    dataSaved:"✓ Dane zapisane w Supabase. Obecnie DATA FOUND, nie VERIFIED.",
    supabaseError:"Supabase nie zaakceptował danych.",
    verifiedError:"Nie udało się potwierdzić VERIFIED.",
    noName:"Brak nazwy",
    reviewIntro:"GamePro — opinie graczy.",
    leaveReview:"Dodaj opinię",
    loginToReview:"Zaloguj się przez Battle.net, aby dodać opinię.",
    reviewPlaceholder:"Napisz swoją opinię o GamePro...",
    sending:"Wysyłanie…",
    submitReview:"✍️ Dodaj opinię",
    noReviews:"Brak opinii. Bądź pierwszym graczem!",
    gameproPlayer:"Gracz GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Zapisz w GamePro",
    confirmVerified:"Potwierdź VERIFIED",
    h1:"Udowodnij swój skill.", h2:"Pokaż swoje osiągnięcia.",
    intro:"Profil gracza ze zweryfikowanymi osiągnięciami. Stwórz Achievement Passport i pokaż gildiom oraz drużynom, co potrafisz.",
    create:"Utwórz paszport gracza", find:"Znajdź gracza", passport:"Achievement Passport", sub:"Nie słowa — zweryfikowane wyniki.", verified:"Profil zweryfikowany", verifiedShort:"VERIFIED",
    searchTitle:"Znajdź gracza", searchSub:"Szukaj po roli, ratingu i zweryfikowanych osiągnięciach.", placeholder:"Na przykład: Holy Paladin 2700+", search:"Szukaj",
    howTitle:"Jak działa weryfikacja", howSub:"Od danych z gry do odznaki VERIFIED.", guild:"Gildie i drużyny", guildText:"Znajduj graczy według roli, ratingu i zweryfikowanego progresu.", open:"Otwórz wyszukiwanie graczy", share:"Udostępnij paszport", copied:"Link skopiowany!",
    current:"Dostępne teraz", future:"Wkrótce", wow:"World of Warcraft", wowText:"Mythic+, rajdy i PvP — pierwsza gra GamePro.", futureText:"Dota 2, CS2 i Path of Exile 2 są już na roadmapie.", source:"Źródło", sourceText:"GamePro porównuje dane z gry z obsługiwanymi źródłami.", check:"Weryfikacja", checkText:"Dane są sprawdzane przed nadaniem statusu VERIFIED.", badge:"VERIFIED", badgeText:"Tylko zweryfikowane osiągnięcia otrzymują zieloną odznakę.", passportLink:"Paszport gracza", shareTitle:"Twój profil gamingowy — jeden link", login:"Zaloguj przez Battle.net", reviews:"Opinie", gameproRating:"Ocena GamePro", playerReviews:"Opinie graczy", verifiedReviews:"Opinie o systemie VERIFIED",
    logout:"Wyloguj się",
  }
} as const;

type Lang = keyof typeof L;

export default function HomePage() {
  const { data: session, status } = useSession();
 if (status === "authenticated") {
  console.log("ПОЛЬЗОВАТЕЛЬ ВОШЁЛ:", session?.user?.name);
}
  const [lang,setLang] = useState<Lang>("EN");
  const [q,setQ] = useState("");
  const [minRating,setMinRating] = useState("");
  const [copied,setCopied] = useState(false);
  const [rioName,setRioName] = useState("");
  const [rioRealm,setRioRealm] = useState("");
  const [rioRegion,setRioRegion] = useState("eu");
  const [rioData,setRioData] = useState<any>(null);
  const [rioLoading,setRioLoading] = useState(false);
  const [rioError,setRioError] = useState("");
  const [supabaseSaving,setSupabaseSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [dbPlayers, setDbPlayers] = useState<any[]>([]); // Для хранения данных из бэкенда
  const [supabaseStatus,setSupabaseStatus] = useState("");
  const [verified,setVerified] = useState(false);
  const [verifiedId,setVerifiedId] = useState<string>("");
  const [verifying,setVerifying] = useState(false);
  const [reviewText,setReviewText] = useState("");
  const [reviewRating,setReviewRating] = useState(5);
  const [reviewStatus,setReviewStatus] = useState("");
  const [reviewSending,setReviewSending] = useState(false);
  const [reviews,setReviews] = useState<any[]>([]);
  const t=L[lang];
  const headerT = {
  how: t.how,
  players: t.players,
  reviews: t.reviews,
  guilds: t.guilds,
  contact: t.contact,
};
useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedRole) params.append('role', selectedRole);
        if (selectedClass) params.append('class', selectedClass);
        if (minRating) params.append('minRating', minRating);

        const response = await fetch(`/api/players?${params.toString()}`);
        const resData = await response.json();

        if (resData.success) {
          setDbPlayers(resData.data || []);
        }
      } catch (err) {
        console.error("Ошибка при запросе к API игроков:", err);
      }
    };

    fetchPlayers();
  }, [selectedRole, selectedClass, minRating]);
  
   useEffect(() => {
  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews", {
        cache: "no-store"
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Ошибка при загрузке отзывов:", err);
    }
  };

  fetchReviews();
}, []);

 const players = dbPlayers.map(p => {
  // 1. Подбираем иконку под класс персонажа
  let icon = "⚔️"; 
  if (p.class?.toLowerCase() === "mage") icon = "🧙‍♂️";
  if (p.class?.toLowerCase() === "paladin") icon = "🛡️";
  if (p.class?.toLowerCase() === "druid") icon = "🧝‍♀️";

  // 2. Возвращаем массив из 5 элементов, который ожидает ваша верстка
  return [
    icon,                                              // x[0] - Иконка
    p.player_name || "Без имени",                    // x[1] - Никнейм
    `${p.role || ""} ${p.class || ""} - ${p.realm || "EU"}`, // x[2] - Роль, Класс и Сервер
    String(p.rating || 0),                             // x[3] - Рейтинг (переводим число в строку)
    p.source?.toUpperCase() || "VERIFIED", p.id, p.source_verified === true              // x[4] - Источник верификации (например, RAIDER.IO)
  ];
}).filter(x => !q || x.join(" ").toLowerCase().includes(q.toLowerCase()));
  const sharePassport = async () => {
    const url = typeof window !== "undefined" ? window.location.href + "#passport" : "";
    try {
      if (navigator.share) await navigator.share({ title:"GamePro Achievement Passport", url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2200); }
    } catch {}
  };

  const searchRaiderIO = async () => {
    if (!rioName.trim() || !rioRealm.trim()) { setRioError(t.rioNameRealm); setRioData(null); return; }
    setRioLoading(true); setRioError(""); setRioData(null); setSupabaseStatus("");
    try {
      const params = new URLSearchParams({region:rioRegion,realm:rioRealm.trim().toLowerCase().replace(/\s+/g,"-"),name:rioName.trim(),fields:"mythic_plus_scores_by_season:current,gear"});
      const response = await fetch("https://raider.io/api/v1/characters/profile?"+params.toString());
      if (!response.ok) throw new Error(t.rioNotFound);
      setRioData(await response.json());
    } catch (error) { setRioError(error instanceof Error ? error.message : t.rioError); }
    finally { setRioLoading(false); }
  };

  const verifyRaiderIO = async () => {
    if (!rioData) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setSupabaseStatus(t.supabaseNotConfigured);
      return;
    }
    setVerifying(true);
    setSupabaseStatus("");
    try {
      const name = encodeURIComponent(rioData.name);
      const realm = encodeURIComponent(rioData.realm?.name || rioRealm);
      const findResponse = await fetch(`${SUPABASE_URL}/rest/v1/player_verifications?player_name=eq.${name}&realm=eq.${realm}&select=id`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      if (!findResponse.ok) throw new Error(t.recordNotFound);
      const rows = await findResponse.json();
      if (!rows.length) throw new Error(t.saveFirst);
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/player_verifications?id=eq.${rows[0].id}`, {
        method: "PATCH",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ source_verified: true })
      });
      if (!updateResponse.ok) throw new Error(await updateResponse.text() || t.verifiedError);
      setVerified(true);
      setVerifiedId(String(rows[0].id || ""));
      setSupabaseStatus(t.verifiedGamePro);
    } catch (error) {
      setSupabaseStatus(error instanceof Error ? error.message : t.verifiedError);
    } finally {
      setVerifying(false);
    }
  };

  const saveRaiderIOToSupabase = async () => {
    if (!rioData) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setSupabaseStatus(t.supabaseNotConfigured);
      return;
    }
    setSupabaseSaving(true); setSupabaseStatus("");
    try {
      const score = rioData.mythic_plus_scores_by_season?.[0]?.scores?.all ?? null;
      const battlenetId = (session as any)?.battlenetId;

if (!battlenetId) {
  setSupabaseStatus(t.loginFirst);
  return;
}
   const payload = {
  battlenet_id: battlenetId,
  player_name: rioData.name,
  realm: rioRealm,
  region: String(rioData.region?.name || rioRegion).toUpperCase(),
  role: rioData.active_spec_role || null,
  class: typeof rioData.class === "string" ? rioData.class: rioData.class?.name || "UNKNOWN",
  rating: score !== null ? Math.round(score) : null,
  mythic_plus_score: score !== null ? Math.round(score) : null,
  source: "raider.io",
  source_verified: false,
  raw_data: rioData
};
      const response = await fetch(`${SUPABASE_URL}/rest/v1/player_verifications`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || t.supabaseError);
      }
      setSupabaseStatus(t.dataSaved);
    } catch (error) {
      setSupabaseStatus(error instanceof Error ? `Supabase: ${error.message}`: t.saveError);
    } finally {
      setSupabaseSaving(false);
    }
  };

  const submitReview = async () => {
  if (status !== "authenticated") {
    setReviewStatus(t.loginFirst);
    return;
  }

  if (!reviewText.trim()) {
    setReviewStatus(t.reviewPlaceholder);
    return;
  }

  setReviewStatus(t.sending);

  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: reviewText.trim(),
        rating: reviewRating
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || t.reviewError);
    }

    setReviewText("");
    setReviewRating(5);
    setReviewStatus(t.reviewSent);
  } catch (error) {
    setReviewStatus(
      error instanceof Error
        ? error.message
        : t.reviewError
    );
  }
};

  const btn:React.CSSProperties={
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 20px",borderRadius:12,
    background:"linear-gradient(135deg,#18e0d1,#12bfb6)",color:"#021312",fontWeight:900,border:0,cursor:"pointer",
    textDecoration:"none",boxShadow:"0 0 30px #16d8cf38",transition:"transform .2s,box-shadow .2s"
  };
 
  const outline={...btn,background:"transparent",color:"#4de8dd",boxShadow:"none",border:"1px solid #19cfc5"};
  const card:React.CSSProperties={
    background:"linear-gradient(145deg,#10162b,#080d1b)",border:"1px solid #262d49",borderRadius:20,padding:25
  };

  return <div style={{minHeight:"100vh",background:"radial-gradient(circle at 80% 0,#28105b 0,transparent 34%),radial-gradient(circle at 15% 35%,#073c42 0,transparent 25%),#050713",color:"#f7f8ff",fontFamily:"Arial,sans-serif"}}>
   <Header lang={lang} setLang={setLang} t={headerT} />
    <main>
      <section style={{maxWidth:1000,width:"92%",margin:"auto",textAlign:"center",padding:"62px 0 50px"}}>
        <span style={{color:"#72fff4",border:"1px solid #168f88",background:"#0b292b",padding:"8px 13px",borderRadius:99,fontSize:12,fontWeight:800}}>🏆 ACHIEVEMENT PASSPORT</span>
        <h1 style={{fontSize:"clamp(30px,5vw,55px)",lineHeight:.98,margin:"22px 0 18px"}}>{t.h1}<br/><span style={{background:"linear-gradient(90deg,#fff,#e832ff,#16ddff)",WebkitBackgroundClip:"text",color:"transparent"}}>{t.h2}</span></h1>
        <p style={{maxWidth:690,margin:"auto",color:"#9da6c0",fontSize:18,lineHeight:1.65}}>{t.intro}</p>
        <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}><button style={btn} onClick={()=>signIn("battlenet",{callbackUrl:"/"}, { prompt: "login" })}><span>🎮</span> {t.login}</button><button style={btn} onClick={() => signOut({ callbackUrl: "/" })}>{t.logout}</button></div><div className="achievementRow" style={{marginTop:22,display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>{["KSM","AOTC","CE","2400+ PvP"].map(x=><span key={x} className="achievementBadge">✓ {x} <b>VERIFIED</b></span>)}</div>
       
        
        <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
  {/* Выбор роли */}
  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value)}
    style={{ padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", cursor: "pointer" }}
  >
    <option value="">{t.allRoles}</option>
    <option value="Tank">{t.roleTank}</option>
    <option value="Healer">{t.roleHealer}</option>
    <option value="DPS">{t.roleDPS}</option>
  </select>

  {/* Выбор класса */}
  <select
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
    style={{ padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", cursor: "pointer" }}
  >
    <option value="">{t.allClasses}</option>
    <option value="Mage">{t.classMage}</option>
    <option value="Paladin">{t.classPaladin}</option>
    <option value="Druid">{t.classDruid}</option>
    <option value="Warrior">{t.classWarrior}</option>
    <option value="Priest">{t.classPriest}</option>
    <option value="Rogue">{t.classRogue}</option>
  </select>

  {/* Ввод минимального рейтинга */}
  <input
    type="number"
    placeholder={t.minRating}
    value={minRating}
    onChange={(e) => setMinRating(e.target.value)}
    style={{ padding: "8px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", width: 130 }}
  />
</div>
</section>
     
      <section id="passport" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"80px 0 0px"}}>
        <div className="sectionHead"><div><h2 style={{fontSize:36,marginBottom:8}}>{t.passport}</h2><p style={{color:"#9da6c0",marginTop:0}}>{t.sub}</p></div></div>
        <div className="grid2" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:20}}>
          <div style={{...card,border:"1px solid #19cfc5"}}><div style={{display:"flex",alignItems:"center",gap:15}}><div style={{width:72,height:72,borderRadius:18,display:"grid",placeItems:"center",fontSize:32,background:"linear-gradient(135deg,#7e2cff,#ec2ad4)"}}>⚡</div><div><div style={{fontSize:11,fontWeight:900,letterSpacing:1.5,color:"#52eee3",marginBottom:5}}>GAMEPRO ACHIEVEMENT PASSPORT</div><h3 style={{fontSize:24,margin:"0 0 5px"}}>{rioData?.name || "Vladimir"}</h3><div style={{color:"#9da6c0"}}>{rioData?.class?.name || "Restoration Shaman"} · {rioData?.realm?.name || rioRealm || "EU"} · {String(rioData?.region?.name || rioRegion).toUpperCase()} · World of Warcraft</div><div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,flexWrap:"wrap"}}><span className="verifiedPill">✓ VERIFIED</span><span style={{color:"#71809e",fontSize:11}}>VERIFIED ID: {verifiedId || "—"}</span></div></div></div>
            <div className="stats" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:25}}>{[[rioData?.mythic_plus_scores_by_season?.[0]?.scores?.all ?? "2850","Mythic+ Rating"],["CE","Raid Progress"],["2.4k+","M+ Runs"]].map(x=><div key={x[0]} style={{padding:15,background:"#080d1b",border:"1px solid #19cfc5",borderRadius:12}}><b style={{fontSize:21}}>{x[0]}</b><small style={{display:"block",color:"#9da6c0",marginTop:4}}>{x[1]}</small></div>)}</div>
         
          </div>
          <div style={{...card,border:"1px solid #19cfc5"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><h3 style={{marginTop:0}}>🏆 {t.verifiedShort}</h3><span className="verifiedPill">✓ VERIFIED</span></div><div className="badges" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>{["KSM","2850 M+","Cutting Edge","AOTC"].map(x=><div key={x} style={{padding:17,borderRadius:14,background:"#0a1021",border:"1px solid #1c8f82"}}><b>🏆 {x}</b><small style={{display:"block",color:"#45e0a1",marginTop:6}}>✓ {t.verifiedShort}</small></div>)}</div></div>
        </div>
      </section>

      <section id="players" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"0px 0 30px",marginTop:-150}}>
        <h2 style={{textAlign:"center",fontSize:32}}>{t.searchTitle}</h2><p style={{textAlign:"center",color:"#9da6c0"}}>{t.searchSub}</p>
        <div className="searchbar" style={{display:"flex",gap:10,maxWidth:460,margin:"25px auto"}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.placeholder} style={{flex:1,minWidth:0,background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:15,color:"white",outline:"none"}}/><button style={btn}>🔎 {t.search}</button></div>
        <div className="cards" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>{players.map(x=><div key={x[1]} style={{...card,cursor:"pointer"}}onClick={()=>window.location.href=`/player/${x[5]}`}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:48,height:48,borderRadius:12,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#6126e9,#e92ad4)",fontSize:22}}>{x[0]}</div><div><h3 style={{margin:"0 0 4px"}}>{x[1]}</h3><small style={{color:"#9da6c0"}}>{x[2]}</small></div></div><div style={{display:"flex",gap:7,marginTop:15,flexWrap:"wrap"}}><span className="greenTag">{x[6] ? `✓ ${x[3]} VERIFIED` : `${x[3]} : NOT VERIFIED`}</span><span className="greenTag">✓ {x[4]}</span></div></div>)}</div>
      </section>

      <section id="raiderio" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"0 0 60px"}}>
        <div style={{...card,borderColor:"#17bcb2"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div><h2 style={{fontSize:28,margin:"0 0 7px"}}>🔎{t.verifyViaRaiderIO}</h2><p style={{color:"#9da6c0",margin:0}}>{t.liveSourceText}</p></div>
            <span className="verifiedPill">RAIDER.IO</span>
          </div>
          <div className="rioForm" style={{display:"grid",gridTemplateColumns:"1fr 1fr 90px auto",gap:10,marginTop:18}}>
            <input value={rioName} onChange={e=>setRioName(e.target.value)} placeholder={t.characterName} style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white",outline:"none"}} />
            <input value={rioRealm} onChange={e=>setRioRealm(e.target.value)} placeholder={t.realmPlaceholder} style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white",outline:"none"}} />
            <select value={rioRegion} onChange={e=>setRioRegion(e.target.value)} style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white"}}><option value="eu">EU</option><option value="us">US</option><option value="kr">KR</option><option value="tw">TW</option></select>
            <button style={btn} onClick={searchRaiderIO} disabled={rioLoading}>{rioLoading ? t.verifying : t.verify}</button>
          </div>
          {rioError && <p style={{color:"#ff8e9e",marginBottom:0}}>{rioError}</p>}
          {rioData && <div style={{marginTop:18,padding:18,borderRadius:16,background:"#080d1b",border:"1px solid #1c8f82"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div><h3 style={{margin:"0 0 5px"}}>{rioData.name}</h3><div style={{color:"#9da6c0"}}>{rioData.class?.name || ""} · {rioData.realm?.name || rioRealm} · {String(rioData.region?.name || rioRegion).toUpperCase()}</div></div>
              <span className="verifiedPill">DATA FOUND · NOT VERIFIED</span>
            </div>
            <div style={{marginTop:14,padding:15,borderRadius:12,background:"#0a1021"}}><b style={{fontSize:22}}>{rioData.mythic_plus_scores_by_season?.[0]?.scores?.all ?? "—"}</b><small style={{display:"block",color:"#9da6c0",marginTop:4}}>Mythic+ Score</small></div>
            <button onClick={saveRaiderIOToSupabase} disabled={supabaseSaving} style={{...btn,marginTop:14}}>💾 {supabaseSaving ? "Сохраняем…" : "Сохранить в GamePro"}</button>
            <button onClick={verifyRaiderIO} disabled={verifying || verified} style={{...btn,marginTop:10,opacity:verified?0.75:1}}>{verified ? "✓ VERIFIED" : (verifying ? "Проверяем…" : "✓ Подтвердить VERIFIED")}</button>
            {supabaseStatus && <p style={{color:supabaseStatus.startsWith("✓") ? "#45e0a1" : "#ffb3bf",fontSize:12,marginBottom:0}}>{supabaseStatus}</p>}
          </div>}
          <p style={{color:"#65708d",fontSize:11,margin:"14px 0 0"}}>Источник: <a href="https://raider.io" target="_blank" rel="noreferrer" style={{color:"#52eee3"}}>Raider.IO</a>. Данные из источника ещё не являются VERIFIED GamePro.</p>
        </div>
      </section>

      <section id="how" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"60px 0"}}>
        <h2 style={{textAlign:"center",fontSize:36}}>{t.howTitle}</h2><p style={{textAlign:"center",color:"#9da6c0"}}>{t.howSub}</p>
        <div className="steps" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:25}}>
          {[["01","📡",t.source,t.sourceText],["02","🔍",t.check,t.checkText],["03","🟢",t.badge,t.badgeText]].map(x=><div key={x[0]} style={card}><b style={{color:"#3de1d5"}}>{x[0]}</b><div style={{fontSize:28,marginTop:15}}>{x[1]}</div><h3>{x[2]}</h3><p style={{color:"#9da6c0",lineHeight:1.6}}>{x[3]}</p></div>)}
        </div>
      </section>

      <section id="games" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"60px 0"}}>
        <div className="gameHeader"><div><h2 style={{fontSize:36,marginBottom:8}}>{t.games}</h2><p style={{color:"#9da6c0",marginTop:0}}>{t.futureText}</p></div></div>
        <div className="gameGrid" style={{display:"grid",gridTemplateColumns:"1.2fr repeat(3,1fr)",gap:14}}>
          <div style={{...card,borderColor:"#17bcb2",boxShadow:"0 0 35px #16d8cf12"}}><span className="status">● {t.current}</span><h3 style={{fontSize:25}}>⚔️ {t.wow}</h3><p style={{color:"#9da6c0",lineHeight:1.6}}>{t.wowText}</p><b style={{color:"#54eee4"}}>M+ · Raids · PvP</b></div>
          {["Dota 2","CS2","Path of Exile 2"].map(g=><div key={g} style={{...card,opacity:.88}}><span className="futureStatus">{t.future}</span><h3 style={{fontSize:20,marginTop:20}}>🎮 {g}</h3><p style={{color:"#7f89a5",lineHeight:1.5}}>{t.futureText}</p></div>)}
        </div>
      </section>

<section
  id="reviews"
  style={{
    maxWidth:1160,
    width:"92%",
    margin:"auto",
    padding:"60px 0"
  }}
>
  <h2 style={{textAlign:"center",fontSize:36}}>
    {t.reviews}
  </h2>

  <p style={{
    textAlign:"center",
    color:"#9da6c0",
    marginBottom:30
  }}>
    GamePro — отзывы игроков.
  </p>

  {/* Форма отзыва */}
  <div
    style={{
      ...card,
      maxWidth:650,
      margin:"0 auto 35px",
    }}
  >
    <h3 style={{
      marginTop:0,
      textAlign:"center",
      fontSize:24
    }}>
      Оставить отзыв
    </h3>

    {status !== "authenticated" ? (
      <p style={{
        color:"#9da6c0",
        textAlign:"center",
        marginBottom:0
      }}>
        Войди через Battle.net, чтобы оставить отзыв.
      </p>
    ) : (
      <>
        <div style={{
          display:"flex",
          justifyContent:"center",
          gap:8,
          marginBottom:15
        }}>
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewRating(star)}
              style={{
                background:"transparent",
                border:0,
                cursor:"pointer",
                fontSize:28,
                opacity:star <= reviewRating ? 1 : 0.35,
                padding:4
              }}
            >
              ⭐
            </button>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Напиши свой отзыв о GamePro..."
          maxLength={1000}
          style={{
            width:"100%",
            minHeight:120,
            boxSizing:"border-box",
            resize:"vertical",
            background:"#090e1d",
            border:"1px solid #26364b",
            borderRadius:12,
            padding:15,
            color:"white",
            outline:"none",
            fontFamily:"inherit"
          }}
        />

        <button
          onClick={submitReview}
          style={{
            ...btn,
            width:"100%",
            marginTop:12
          }}
        >
          {reviewSending ? "Отправляем…" : "✍️ Оставить отзыв"}
        </button>

        {reviewStatus && (
          <p style={{
            textAlign:"center",
            color:"#52eee3",
            marginBottom:0
          }}>
            {reviewStatus}
          </p>
        )}
      </>
    )}
  </div>

  {/* Отзывы игроков */}
  <div
    className="reviewGrid"
    style={{
      display:"grid",
      gridTemplateColumns:"repeat(3,1fr)",
      gap:16,
      marginTop:25
    }}
  >
    {reviews.length === 0 ? (
      <div
        style={{
          ...card,
          gridColumn:"1 / -1",
          textAlign:"center",
          color:"#9da6c0"
        }}
      >
        Пока нет отзывов. Будь первым игроком!
      </div>
    ) : (
      reviews.map(review => (
        <div
          key={review.id}
          style={card}
        >
          <div style={{
            fontSize:20,
            marginBottom:10
          }}>
            {"⭐".repeat(Number(review.rating) || 0)}
          </div>

          <h3 style={{
            margin:"0 0 8px"
          }}>
            {review.author_name || "GamePro игрок"}
          </h3>

          <p style={{
            color:"#9da6c0",
            lineHeight:1.6,
            margin:0
          }}>
            {review.text}
          </p>
        </div>
      ))
    )}
  </div>
</section>
    
      <section style={{maxWidth:550,width:"92%",margin:"0 auto 80px",padding: 25,textAlign:"center",border: "1px solid #19cfc5",borderRadius:20,background:"#080d1b"}}><h2 style={{fontSize:32}}>{t.shareTitle}</h2><p style={{color:"#9da6c0"}}>{t.passportLink}: Vladimir · 2850 M+ · CE · VERIFIED</p><button onClick={sharePassport} style={btn}>🔗 {copied ? t.copied : t.share}</button></section>
    </main>

    <section id="contact" style={{maxWidth:400,width:"90%",margin:"0 auto 50px"}}>
  <div style={{
    background:"linear-gradient(145deg,#10162b,#080d1b)",
    border:"1px solid #19cfc5",
    borderRadius:20,
    padding:25,
    textAlign:"center"
  }}>
    <h2 style={{margin:"0 0 18px",fontSize:32}}>Контакты</h2>

    <p style={{color:"#9aa3bd",margin:"18px 0 18px"}}>
      По вопросам GamePro и сотрудничества
    </p>

    <a
      href="mailto:gamepro.market@gmail.com"
      style={{
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"11px 22px",
        borderRadius:12,
        background:"linear-gradient(135deg,#18e0d1,#12bfb6)",
        color:"#021312",
        fontWeight:900,
        textDecoration:"none"
      }}
    >
      ✉️ gamepro.market@gmail.com
    </a>
  </div>
</section>

    <footer style={{borderTop:"1px solid #171c31",padding:28,color:"#737c98"}}><div className="footer" style={{maxWidth:1160,width:"92%",margin:"auto",display:"flex",justifyContent:"space-between",gap:15}}><span>© 2026 GamePro Market</span><span>Achievement Passport · WoW MVP · Dota 2 · CS2 · PoE2</span></div></footer>

    <style jsx>{`a,button{font-family:inherit}      .navlinks a:hover{color:#58eee5!important}.navlinks a:active,.navlinks a:focus-visible{color:#58eee5!important;text-shadow:0 0 14px #19e0d5}.achievementBadge{display:inline-flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid #1c8f82;border-radius:999px;background:#0a1d24;color:#52eee3;font-size:12px;font-weight:900;box-shadow:0 0 16px #16d8cf18}.achievementBadge b{font-size:9px;color:#8afff7}.achievementBadge:active{box-shadow:0 0 24px #16d8cfaa,0 0 50px #16d8cf55;transform:translateY(1px)}button:active,a:active{box-shadow:0 0 28px #16d8cfaa,0 0 60px #16d8cf44!important;transform:translateY(1px)}button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #19e0d5;outline-offset:3px;box-shadow:0 0 24px #16d8cf88}.reviewGrid{}
.navlinks a{text-decoration:none;transition:color .2s}.navlinks a:hover{color:#58eee5!important}.sectionHead,.gameHeader{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:25px}.verifiedPill,.status{display:inline-flex;padding:7px 10px;border-radius:999px;background:#0c302f;color:#52eee3;border:1px solid #168f88;font-size:11px;font-weight:900}.futureStatus{display:inline-flex;padding:6px 9px;border-radius:999px;background:#171d31;color:#8994af;font-size:10px;font-weight:800}.greenTag{background:#0d2929;padding:7px;border-radius:7px;color:#45e0a1;font-size:11px;border:1px solid #174f49}\n      @media(max-width:900px){.navlinks{display:none!important}.grid2,.cards,.steps,.gameGrid,.reviewGrid{grid-template-columns:1fr!important}.gameGrid>div{min-height:0}.sectionHead,.gameHeader{align-items:flex-start;flex-direction:column}.sectionHead button{width:100%}}\n      @media(max-width:700px){.rioForm{grid-template-columns:1fr!important}.rioForm button{width:100%}}
      @media(max-width:560px){.nav{min-height:68px}.nav select{margin-left:auto}.stats{grid-template-columns:1fr!important}.badges{grid-template-columns:1fr!important}.searchbar{flex-direction:column}.searchbar button{width:100%}.footer{display:block!important;text-align:center}.footer span{display:block;margin:7px 0}.hero{} }`}</style> </div>;
}

