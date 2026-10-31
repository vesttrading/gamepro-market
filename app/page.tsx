"use client";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { signIn,signOut,useSession } from "next-auth/react";
import TopCoaches from "./components/TopCoaches";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const L = {
  RU: {
    games:"Игры", players:"Игроки", guilds:"Гильдии", how:"Как это работает", contact:"Контакты",
    saving:"Сохраняем",saveGamePro: "Сохранить в GamePro",
    verifying:"Проверяем…",verify:"✓ Подтвердить VERIFIED",
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
    sourceNotVerified:"Источник: Raider.IO. Данные из источника ещё не являются VERIFIED GamePro.",
    characterName:"Имя персонажа",
    realmPlaceholder:"Реалм, например Kazzak",
    liveSourceText:"Первый живой источник GamePro для Mythic+ данных",
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
    yourRating: "Ваша оценка:",
    reviewsSubtitle: "Отзывы о тренере.",
    reviewPlaceholder: "Напиши свой отзыв о тренере...",
    leaveReview:"Оставить отзыв",
    loginToReview:"Войди через Battle.net, чтобы оставить отзыв.",
    sending:"Отправляем…",
    submitReview:"✍️ Оставить отзыв",
    noReviews:"Пока нет отзывов. Будь первым игроком!",
    gameproPlayer:"GamePro игрок",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Сохранить в GamePro",
    confirmVerified:"Подтвердить VERIFIED",
    h1:"Играй лучше.", h2:"Достигай большего.",
    intro:"Коучинг от проверенных игроков. Без буста и голды - только легальный скилл, за который не банят.",
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
    contactText:"По вопросам GamePro и сотрудничества",
    contactResponse: "Мы отвечаем в течение 24 часов • Ответим на почту",
  },
  EN: {
    games:"Games", players:"Players", guilds:"Guilds", how:"How it works", contact:"Contact",
    saving:"Saving",saveGamePro:"Save to GamePro",
    verifying:"Checking…",verify:"✓ Verify VERIFIED",
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
    sourceNotVerified:"Source: Raider.IO. Data from the source is not yet VERIFIED by GamePro.",
    characterName:"Character name",
    realmPlaceholder:"Realm, e.g. Kazzak",
    liveSourceText:"The first live GamePro source for Mythic+ data",
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
    yourRating: "Your rating:",
    reviewsSubtitle: "Reviews of the coach.",
    reviewPlaceholder: "Write your review about the coach...",
    leaveReview:"Leave a review",
    loginToReview:"Login with Battle.net to leave a review.",
    sending:"Sending…",
    submitReview:"✍️ Leave a review",
    noReviews:"No reviews yet. Be the first player!",
    gameproPlayer:"GamePro player",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Save to GamePro",
    confirmVerified:"Confirm VERIFIED",
    h1:"Play Better.", h2:"Achieve More.",
    intro:"Coaching from verified players. No boosting, no gold selling—just legitimate skills that won't get you banned.",
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
    contactText:"For GamePro inquiries and partnerships",
    contactResponse: "We respond within 24 hours • Reply by email",
  },
  TR: {
    games:"Oyunlar", players:"Oyuncular", guilds:"Loncalar", how:"Nasıl çalışır", contact:"İletişim",
    saving:"Kaydediliyor",saveGamePro:"GamePro'ya Kaydet",
    verifying:"Kontrol ediliyor…",verify:"✓ VERIFIED Doğrula",
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
    sourceNotVerified:"Kaynak: Raider.IO. Kaynaktan alınan veriler henüz GamePro tarafından VERIFIED değil.",
    characterName:"Karakter adı",
    realmPlaceholder:"Realmi, örn. Kazzak",
    liveSourceText:"Mythic+ verileri için ilk canlı GamePro kaynağı",
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
    yourRating: "Puanınız:",
    reviewsSubtitle: "Koç hakkındaki yorumlar.",
    reviewPlaceholder: "Koç hakkındaki yorumunu yaz...",
    leaveReview:"Yorum bırak",
    loginToReview:"Yorum bırakmak için Battle.net ile giriş yap.",
    sending:"Gönderiliyor…",
    submitReview:"✍️ Yorum bırak",
    noReviews:"Henüz yorum yok. İlk oyuncu sen ol!",
    gameproPlayer:"GamePro oyuncusu",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"GamePro'ya kaydet",
    confirmVerified:"VERIFIED'ı doğrula",
    h1:"Daha İyi Oyna.", h2:"Daha Fazlasını Başar.",
    intro:"Doğrulanmış oyunculardan koçluk. Boost veya gold satışı yok — sadece ban sebebi olmayan yasal yetenekler.",
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
    contactText:"GamePro hakkında sorular ve iş birlikleri için",
    contactResponse: "24 saat içinde yanıt veriyoruz • E-posta ile dönüş yapıyoruz",
  },
  DE: {
    games:"Spiele", players:"Spieler", guilds:"Gilden", how:"So funktioniert es", contact:"Kontakt",
    saving:"Speichern",saveGamePro:"In GamePro speichern",
    verifying:"Wird überprüft…",verify:"✓ VERIFIED bestätigen",
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
    sourceNotVerified:"Quelle: Raider.IO. Die Daten aus der Quelle sind noch nicht von GamePro VERIFIED.",
    characterName:"Charaktername",
    realmPlaceholder:"Realm, z. B. Kazzak",
    liveSourceText:"Die erste Live-Quelle von GamePro für Mythic+-Daten",
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
    yourRating: "Deine Bewertung:",
    reviewsSubtitle: "Bewertungen des Trainers.",
    reviewPlaceholder: "Schreibe deine Bewertung über den Trainer...",
    leaveReview:"Bewertung abgeben",
    loginToReview:"Melde dich mit Battle.net an, um eine Bewertung abzugeben.",
    sending:"Wird gesendet…",
    submitReview:"✍️ Bewertung abgeben",
    noReviews:"Noch keine Bewertungen. Sei der erste Spieler!",
    gameproPlayer:"GamePro-Spieler",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"In GamePro speichern",
    confirmVerified:"VERIFIED bestätigen",
    h1:"Spiele besser.", h2:"Erreiche mehr.",
    intro:"Coaching von verifizierten Spielern. Kein Boosting, kein Goldverkauf – nur legale Skills, für die man nicht gebannt wird.",
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
    contactText:"Für Fragen zu GamePro und Kooperationen",
    contactResponse: "Wir antworten innerhalb von 24 Stunden • Antwort per E-Mail",
  },
  ES: {
    games:"Juegos", players:"Jugadores", guilds:"Gremios", how:"Cómo funciona", contact:"Contacto",
    saving:"Guardando",saveGamePro:"Guardar en GamePro",
    verifying:"Comprobando…",verify:"✓ Verificar VERIFIED",
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
    sourceNotVerified:"Fuente: Raider.IO. Los datos de la fuente aún no están VERIFIED por GamePro.",
    characterName:"Nombre del personaje",
    realmPlaceholder:"Reino, por ejemplo Kazzak",
    liveSourceText:"La primera fuente en vivo de GamePro para datos de Mythic+",
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
    yourRating: "Tu valoración:",
    reviewsSubtitle: "Opiniones sobre el entrenador.",
    reviewPlaceholder: "Escribe tu reseña sobre el entrenador...",
    leaveReview:"Dejar una opinión",
    loginToReview:"Inicia sesión con Battle.net para dejar una opinión.",
    sending:"Enviando…",
    submitReview:"✍️ Dejar una opinión",
    noReviews:"Aún no hay opiniones. ¡Sé el primer jugador!",
    gameproPlayer:"Jugador de GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Guardar en GamePro",
    confirmVerified:"Confirmar VERIFIED",
    h1:"Juega mejor.", h2:"Logra más.",
    intro:"Entrenamiento de jugadores verificados. Sin boosting ni venta de oro: solo habilidades legales por las que no te banearán.",
    create:"Crear pasaporte gamer", find:"Buscar jugador", passport:"Achievement Passport", sub:"No palabras — resultados verificados.", verified:"Perfil verificado", verifiedShort:"VERIFIED",
    searchTitle:"Buscar jugador", searchSub:"Busca por rol, rating y logros verificados.", placeholder:"Por ejemplo: Holy Paladin 2700+", search:"Buscar",
    howTitle:"Cómo funciona la verificación", howSub:"De los datos del juego a la insignia VERIFIED.", guild:"Gremios y equipos", guildText:"Encuentra jugadores por rol, rating y progreso verificado.", open:"Abrir búsqueda de jugadores", share:"Compartir pasaporte", copied:"¡Enlace copiado!",
    current:"Disponible ahora", future:"Próximamente", wow:"World of Warcraft", wowText:"Mythic+, raids y PvP — el primer juego de GamePro.", futureText:"Dota 2, CS2 y Path of Exile 2 están en la hoja de ruta.", source:"Fuente", sourceText:"GamePro compara los datos del juego con fuentes compatibles.", check:"Verificación", checkText:"Los datos se comprueban antes de recibir el estado VERIFIED.", badge:"VERIFIED", badgeText:"Solo los logros verificados reciben la insignia verde.", passportLink:"Pasaporte del jugador", shareTitle:"Tu perfil gaming — un solo enlace", login:"Entrar con Battle.net", reviews:"Opiniones", gameproRating:"Valoración de GamePro", playerReviews:"Opiniones de jugadores", verifiedReviews:"Opiniones sobre el sistema VERIFIED",
    logout:"Cerrar sesión",
    contactText:"Para consultas sobre GamePro y colaboraciones",
    contactResponse: "Respondemos en 24 horas • Respuesta por correo",
  },
  FR: {
    games:"Jeux", players:"Joueurs", guilds:"Guildes", how:"Comment ça marche", contact:"Contact",
    saving:"Enregistrement",saveGamePro:"Enregistrer dans GamePro",
    verifying:"Vérification…",verify:"✓ Vérifier VERIFIED",
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
    sourceNotVerified:"Source : Raider.IO. Les données de la source ne sont pas encore VERIFIED par GamePro.",
    characterName:"Nom du personnage",
    realmPlaceholder:"Royaume, par ex. Kazzak",
    liveSourceText:"La première source live de GamePro pour les données Mythic+",
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
    yourRating: "Votre note :",
    reviewsSubtitle: "Avis sur le coach.",
    reviewPlaceholder: "Écris ton avis sur le coach...",
    leaveReview:"Laisser un avis",
    loginToReview:"Connecte-toi avec Battle.net pour laisser un avis.",
    sending:"Envoi…",
    submitReview:"✍️ Laisser un avis",
    noReviews:"Aucun avis pour le moment. Sois le premier joueur !",
    gameproPlayer:"Joueur GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Enregistrer dans GamePro",
    confirmVerified:"Confirmer VERIFIED",
    h1:"Jouez mieux.", h2:"Accomplissez plus.",
    intro:"Coaching par des joueurs vérifiés. Pas de boosting ni de vente de po — uniquement du skill légal qui ne risque pas de vous faire bannir.",
    create:"Créer mon passeport", find:"Trouver un joueur", passport:"Achievement Passport", sub:"Pas de paroles — des résultats vérifiés.", verified:"Profil vérifié", verifiedShort:"VERIFIED",
    searchTitle:"Trouver un joueur", searchSub:"Recherche par rôle, rating et accomplissements vérifiés.", placeholder:"Par exemple : Holy Paladin 2700+", search:"Rechercher",
    howTitle:"Comment fonctionne la vérification", howSub:"Des données du jeu au badge VERIFIED.", guild:"Guildes et équipes", guildText:"Trouve des joueurs par rôle, rating et progression vérifiée.", open:"Ouvrir la recherche", share:"Partager le passeport", copied:"Lien copié !",
    current:"Disponible maintenant", future:"Bientôt", wow:"World of Warcraft", wowText:"Mythic+, raids et PvP — le premier jeu de GamePro.", futureText:"Dota 2, CS2 et Path of Exile 2 sont sur la feuille de route.", source:"Source", sourceText:"GamePro vérifie les données du jeu avec les sources prises en charge.", check:"Vérification", checkText:"Les données sont vérifiées avant l'attribution du statut VERIFIED.", badge:"VERIFIED", badgeText:"Seuls les accomplissements vérifiés obtiennent le badge vert.", passportLink:"Passeport joueur", shareTitle:"Ton profil gaming — un seul lien", login:"Se connecter avec Battle.net", reviews:"Avis", gameproRating:"Note GamePro", playerReviews:"Avis des joueurs", verifiedReviews:"Avis sur le système VERIFIED",
    logout:"Se déconnecter",
    contactText:"Pour toute question concernant GamePro et les collaborations",
    contactResponse: "Nous répondons sous 24 heures • Réponse par e-mail",
  },
  PL: {
    games:"Gry", players:"Gracze", guilds:"Gildie", how:"Jak to działa", contact:"Kontakt",
    saving:"Zapisywanie",saveGamePro:"Zapisz w GamePro",
    verifying:"Sprawdzanie…",verify:"✓ Zweryfikuj VERIFIED",
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
    sourceNotVerified:"Źródło: Raider.IO. Dane ze źródła nie są jeszcze VERIFIED przez GamePro.",
    characterName:"Nazwa postaci",
    realmPlaceholder:"Realm, np. Kazzak",
    liveSourceText:"Pierwsze aktywne źródło GamePro dla danych Mythic+",
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
    yourRating: "Twoja ocena:",
    reviewsSubtitle: "Opinie o trenerze.",
    reviewPlaceholder: "Napisz swoją opinię o trenerze...",
    leaveReview:"Dodaj opinię",
    loginToReview:"Zaloguj się przez Battle.net, aby dodać opinię.",
    sending:"Wysyłanie…",
    submitReview:"✍️ Dodaj opinię",
    noReviews:"Brak opinii. Bądź pierwszym graczem!",
    gameproPlayer:"Gracz GamePro",
    dataFound:"DATA FOUND",
    notVerified:"NOT VERIFIED",
    saveToGamePro:"Zapisz w GamePro",
    confirmVerified:"Potwierdź VERIFIED",
    h1:"Graj lepiej.", h2:"Osiągaj więcej.",
    intro:"Coaching od zweryfikowanych graczy. Bez boostowania i kupowania złota – tylko legalny skill, za który nie dostaniesz bana,",
    create:"Utwórz paszport gracza", find:"Znajdź gracza", passport:"Achievement Passport", sub:"Nie słowa — zweryfikowane wyniki.", verified:"Profil zweryfikowany", verifiedShort:"VERIFIED",
    searchTitle:"Znajdź gracza", searchSub:"Szukaj po roli, ratingu i zweryfikowanych osiągnięciach.", placeholder:"Na przykład: Holy Paladin 2700+", search:"Szukaj",
    howTitle:"Jak działa weryfikacja", howSub:"Od danych z gry do odznaki VERIFIED.", guild:"Gildie i drużyny", guildText:"Znajduj graczy według roli, ratingu i zweryfikowanego progresu.", open:"Otwórz wyszukiwanie graczy", share:"Udostępnij paszport", copied:"Link skopiowany!",
    current:"Dostępne teraz", future:"Wkrótce", wow:"World of Warcraft", wowText:"Mythic+, rajdy i PvP — pierwsza gra GamePro.", futureText:"Dota 2, CS2 i Path of Exile 2 są już na roadmapie.", source:"Źródło", sourceText:"GamePro porównuje dane z gry z obsługiwanymi źródłami.", check:"Weryfikacja", checkText:"Dane są sprawdzane przed nadaniem statusu VERIFIED.", badge:"VERIFIED", badgeText:"Tylko zweryfikowane osiągnięcia otrzymują zieloną odznakę.", passportLink:"Paszport gracza", shareTitle:"Twój profil gamingowy — jeden link", login:"Zaloguj przez Battle.net", reviews:"Opinie", gameproRating:"Ocena GamePro", playerReviews:"Opinie graczy", verifiedReviews:"Opinie o systemie VERIFIED",
    logout:"Wyloguj się",
    contactText:"W sprawie GamePro i współpracy",
    contactResponse: "Odpowiadamy w ciągu 24 godzin • Odpowiedź e-mailem",
  }
} as const;

type Lang = keyof typeof L;

export default function HomePage() {
  const { data: session, status } = useSession();
 if (status === "authenticated") {
  console.log("USER LOGGED IN:", session?.user?.name);
}
  const [lang,setLang] = useState<Lang>("EN");
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
  const [q,setQ] = useState("");
  const [minRating,setMinRating] = useState("");
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
  logout: t.logout,
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
  }, [selectedRole, selectedClass]);
  
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
    if (p.class?.toLowerCase() === "paladin") icon = "🛡";
    if (p.class?.toLowerCase() === "druid") icon = "🧝‍♀️";

    // 2. Возвращаем массив из 6 элементов
    return [
      icon,                                      // x[0] - Иконка
      p.player_name || t.noName,                // x[1] - Никнейм
     `${p.role || ""} ${p.class || ""} - ${p.realm || "EU"}`, // x[2]
      String(p.rating || 0),                    // x[3] - Рейтинг
      p.source?.toUpperCase() || "VERIFIED",    // x[4] - Источник
      p.id,                                      // x[5] - ID
      p.source_verified === true                // x[6] - VERIFIED
    ];
  })
  .filter(x => {
    // Поиск по имени/роли/классу/серверу
    if (q && !x.join(" ").toLowerCase().includes(q.toLowerCase())) {
      return false;
    }

    // Min. rating работает локально, без нового запроса к API
    if (minRating && Number(x[3]) < Number(minRating)) {
      return false;
    }

    return true;
  });

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

// Обновляем карточки сразу после подтверждения
try {
  const params = new URLSearchParams();

  if (selectedRole) params.append("role", selectedRole);
  if (selectedClass) params.append("class", selectedClass);
  if (minRating) params.append("minRating", minRating);

  const playersResponse = await fetch(
    `/api/players?${params.toString()}`,
    { cache: "no-store" }
  );

  const playersData = await playersResponse.json();

  if (playersResponse.ok && playersData.success) {
    setDbPlayers(playersData.data || []);
  }
} catch (refreshError) {
  console.error("Ошибка обновления карточек:", refreshError);
}

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
  <Header
  lang={lang}
  setLang={setLang}
  t={headerT}
  isLoggedIn={status === "authenticated"}
/>
    <main>
      <section style={{maxWidth:1000,width:"92%",margin:"auto",textAlign:"center",padding:"62px 0 50px"}}>
       <h1 style={{fontSize:"clamp(30px,5vw,55px)",lineHeight:.98,margin:"22px 0 18px"}}>{t.h1}<br/><span style={{background:"linear-gradient(90deg,#fff,#e832ff,#16ddff)",WebkitBackgroundClip:"text",color:"transparent"}}>{t.h2}</span></h1>
        <p style={{maxWidth:690,margin:"auto",color:"#9da6c0",fontSize:18,lineHeight:1.65}}>{t.intro}</p>
        <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}><button style={btn} onClick={()=>signIn("battlenet",{callbackUrl:"/"}, { prompt: "login",locale: ({ RU:"ru_RU", EN:"en_GB", TR:"tr_TR", DE:"de_DE", ES:"es_ES", FR:"fr_FR", PL:"pl_PL" } as Record<string,string>)[lang] || "en_GB" })}><span>🎮</span> {t.login}</button></div>
      </section>

      <TopCoaches />

     <section
        id="how"
        style={{
          maxWidth: 1160,
          width: "92%",
          margin: "auto",
          padding: "55px 0",
        }}
      >
        <h2 style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>
          {lang === "RU" ? "Как работают Топ тренеров" :
           lang === "TR" ? "En İyi Koçlar nasıl çalışır?" :
           lang === "DE" ? "So funktionieren die Top-Coaches" :
           lang === "ES" ? "Cómo funciona Top Coaches" :
           lang === "FR" ? "Comment fonctionne Top Coaches" :
           lang === "PL" ? "Jak działa Top Trenerów" :
           "How Top Coaches Works"}
        </h2>

        <p style={{ color: "#9da6c0", textAlign: "center", lineHeight: 1.6 }}>
          {lang === "RU" ? "Найди подходящего тренера, изучи его услуги и начни улучшать свою игру." :
           lang === "TR" ? "Sana uygun koçu bul, hizmetlerini incele ve oyununu geliştirmeye başla." :
           lang === "DE" ? "Finde den passenden Coach, entdecke seine Angebote und verbessere dein Spiel." :
           lang === "ES" ? "Encuentra al entrenador adecuado, consulta sus servicios y mejora tu juego." :
           lang === "FR" ? "Trouve le coach idéal, découvre ses services et améliore ton jeu." :
           lang === "PL" ? "Znajdź odpowiedniego trenera, poznaj jego usługi i rozwijaj swoje umiejętności." :
           "Find the right coach, explore their services, and start improving your game."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 18,
            marginTop: 28,
          }}
        >
          <div style={{ ...card, border: "1px solid #19cfc5" }}>
            <h3 style={{ color: "#f7f8ff" }}>
              🔎 {lang === "RU" ? "Выбери тренера" :
                   lang === "TR" ? "Koçunu seç" :
                   lang === "DE" ? "Wähle einen Coach" :
                   lang === "ES" ? "Elige un entrenador" :
                   lang === "FR" ? "Choisis un coach" :
                   lang === "PL" ? "Wybierz trenera" :
                   "Choose a coach"}
            </h3>
            <p style={{ color: "#9da6c0", lineHeight: 1.7 }}>
              {lang === "RU" ? "Сравни профили тренеров по игре, специализации и рейтингу." :
               lang === "TR" ? "Koç profillerini oyuna, uzmanlığa ve puanlamaya göre karşılaştır." :
               lang === "DE" ? "Vergleiche Coach-Profile nach Spiel, Spezialisierung und Bewertung." :
               lang === "ES" ? "Compara perfiles según el juego, la especialidad y la valoración." :
               lang === "FR" ? "Compare les profils selon le jeu, la spécialité et les évaluations." :
               lang === "PL" ? "Porównuj profile według gry, specjalizacji i ocen." :
               "Compare coach profiles by game, specialization, and rating."}
            </p>
          </div>

          <div style={{ ...card, border: "1px solid #19cfc5" }}>
            <h3 style={{ color: "#f7f8ff" }}>
              📋 {lang === "RU" ? "Изучи услуги" :
                   lang === "TR" ? "Hizmetleri incele" :
                   lang === "DE" ? "Entdecke die Angebote" :
                   lang === "ES" ? "Consulta los servicios" :
                   lang === "FR" ? "Découvre les services" :
                   lang === "PL" ? "Sprawdź usługi" :
                   "Explore services"}
            </h3>
            <p style={{ color: "#9da6c0", lineHeight: 1.7 }}>
              {lang === "RU" ? "Открой профиль, посмотри описание, стоимость услуг и отзывы." :
               lang === "TR" ? "Profili aç, açıklamayı, hizmet fiyatlarını ve yorumları incele." :
               lang === "DE" ? "Öffne das Profil und sieh dir Beschreibung, Preise und Bewertungen an." :
               lang === "ES" ? "Abre el perfil y consulta la descripción, los precios y las reseñas." :
               lang === "FR" ? "Ouvre le profil pour consulter la description, les prix et les avis." :
               lang === "PL" ? "Otwórz profil i sprawdź opis, ceny usług oraz opinie." :
               "Open the profile to view the description, service prices, and reviews."}
            </p>
          </div>

          <div style={{ ...card, border: "1px solid #19cfc5" }}>
            <h3 style={{ color: "#f7f8ff" }}>
              💬 {lang === "RU" ? "Свяжись с тренером" :
                   lang === "TR" ? "Koçla iletişime geç" :
                   lang === "DE" ? "Kontaktiere den Coach" :
                   lang === "ES" ? "Contacta con el entrenador" :
                   lang === "FR" ? "Contacte le coach" :
                   lang === "PL" ? "Skontaktuj się z trenerem" :
                   "Contact the coach"}
            </h3>
            <p style={{ color: "#9da6c0", lineHeight: 1.7 }}>
              {lang === "RU" ? "Обсуди тренировку, согласуй время и оплату напрямую с тренером." :
               lang === "TR" ? "Antrenmanı konuş, zamanı ve ödemeyi doğrudan koçla kararlaştır." :
               lang === "DE" ? "Besprich das Training sowie Termin und Bezahlung direkt mit dem Coach." :
               lang === "ES" ? "Acuerda el entrenamiento, el horario y el pago directamente con el entrenador." :
               lang === "FR" ? "Convenez de la séance, de l’horaire et du paiement directement avec le coach." :
               lang === "PL" ? "Ustal trening, termin i płatność bezpośrednio z trenerem." :
               "Discuss the session, schedule, and payment directly with the coach."}
            </p>
          </div>
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
    {t.reviewsSubtitle}
  </p>

  {/* Форма отзыва */}
  <div
    style={{
      ...card,
      maxWidth:650,
      margin:"0 auto 35px",
    }}
  >
  
    {status !== "authenticated" ? (
      <p style={{
        color:"#9da6c0",
        textAlign:"center",
        marginBottom:0
      }}>
        {t.loginToReview}
      </p>
    ) : (
      <>
      <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 8,
  marginBottom: 15
}}>
  <span style={{
    color: "#9da6c0",
    fontSize: 16,
    fontWeight: 600
  }}>
    {t.yourRating}
  </span>

  {[1,2,3,4,5].map(star => (
    <button
      key={star}
      type="button"
      onClick={() => setReviewRating(star)}
      style={{
        background: "transparent",
        border: 0,
        cursor: "pointer",
        fontSize: 20,
        opacity: star <= reviewRating ? 1 : 0.35,
        padding: 2
      }}
    >
      ⭐
    </button>
  ))}
</div>

        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder={t.reviewPlaceholder}
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
          {reviewSending ? t.sending : t.leaveReview}
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

  {/* Отзывы о тренере */}
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
        {t.noReviews}
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
    
    </main>

 <section
  id="contact"
  style={{
    maxWidth: 760,
    width: "90%",
    margin: "0 auto 60px",
    boxSizing: "border-box",
  }}
>
  <div
    style={{
      background: "linear-gradient(145deg, #101727, #080d1b)",
      border: "2px solid #34415a",
      borderRadius: 32,
      padding: "38px 24px",
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    <h2
      style={{
        margin: "0 0 12px",
        fontSize: 42,
        fontWeight: 600,
        color: "#ffffff",
      }}
    >
      {t.contact}
    </h2>

    <p
      style={{
        color: "#aab5ca",
        fontSize: 20,
        margin: "0 0 38px",
      }}
    >
      {t.contactText}
    </p>

    <a
      href="mailto:gamepro.market@gmail.com"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        width: "fit-content",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "20px 30px",
        border: "3px solid #22c55e",
        borderRadius: 28,
        background: "#17243a",
        color: "#ffffff",
        fontSize: 18,
        fontWeight: 600,
        textDecoration: "none",
        boxSizing: "border-box",
        overflowWrap: "anywhere",
      }}
    >
      <span style={{ color: "#22c55e", fontSize: 32 }}>✉</span>
      gamepro.market@gmail.com
    </a>

    <p
      style={{
        color: "#94a3b8",
        fontSize: 16,
        margin: "34px 0 0",
      }}
    >
      {t.contactResponse}
    </p>
  </div>
</section>
  
    <footer style={{borderTop:"1px solid #171c31",padding:28,color:"#737c98"}}><div className="footer" style={{maxWidth:1160,width:"92%",margin:"auto",display:"flex",justifyContent:"space-between",gap:15}}><span>© 2026 GamePro Market</span><span>Achievement Passport · WoW MVP · Dota 2 · CS2 · PoE2</span></div></footer>

    <style jsx>{`a,button{font-family:inherit}      .navlinks a:hover{color:#58eee5!important}.navlinks a:active,.navlinks a:focus-visible{color:#58eee5!important;text-shadow:0 0 14px #19e0d5}.achievementBadge{display:inline-flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid #1c8f82;border-radius:999px;background:#0a1d24;color:#52eee3;font-size:12px;font-weight:900;box-shadow:0 0 16px #16d8cf18}.achievementBadge b{font-size:9px;color:#8afff7}.achievementBadge:active{box-shadow:0 0 24px #16d8cfaa,0 0 50px #16d8cf55;transform:translateY(1px)}button:active,a:active{box-shadow:0 0 28px #16d8cfaa,0 0 60px #16d8cf44!important;transform:translateY(1px)}button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #19e0d5;outline-offset:3px;box-shadow:0 0 24px #16d8cf88}.reviewGrid{}
.navlinks a{text-decoration:none;transition:color .2s}.navlinks a:hover{color:#58eee5!important}.sectionHead,.gameHeader{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:25px}.verifiedPill,.status{display:inline-flex;padding:7px 10px;border-radius:999px;background:#0c302f;color:#52eee3;border:1px solid #168f88;font-size:11px;font-weight:900}.futureStatus{display:inline-flex;padding:6px 9px;border-radius:999px;background:#171d31;color:#8994af;font-size:10px;font-weight:800}.greenTag{background:#0d2929;padding:7px;border-radius:7px;color:#45e0a1;font-size:11px;border:1px solid #174f49}\n      @media(max-width:900px){.navlinks{display:none!important}.grid2,.cards,.steps,.gameGrid,.reviewGrid{grid-template-columns:1fr!important}.gameGrid>div{min-height:0}.sectionHead,.gameHeader{align-items:flex-start;flex-direction:column}.sectionHead button{width:100%}}\n      @media(max-width:700px){.rioForm{grid-template-columns:1fr!important}.rioForm button{width:100%}}
      @media(max-width:560px){.nav{min-height:68px}.nav select{margin-left:auto}.stats{grid-template-columns:1fr!important}.badges{grid-template-columns:1fr!important}.searchbar{flex-direction:column}.searchbar button{width:100%}.footer{display:block!important;text-align:center}.footer span{display:block;margin:7px 0}.hero{} }`}</style> </div>;
}
