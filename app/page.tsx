"use client";
import Header from "../components/Header";
import { useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const L = {
  RU: {
    games:"Игры", players:"Игроки", guilds:"Гильдии", how:"Как это работает",
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
    passportLink:"Паспорт игрока", shareTitle:"Твой игровой профиль — одной ссылкой", login:"Войти через Battle.net", reviews:"Отзывы", gameproRating:"Оценка GamePro", playerReviews:"Отзывы игроков", verifiedReviews:"Отзывы о системе VERIFIED"
  },
  EN: {
    games:"Games", players:"Players", guilds:"Guilds", how:"How it works",
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
    passportLink:"Player passport", shareTitle:"Your gaming profile — one link", login:"Login with Battle.net", reviews:"Reviews", gameproRating:"GamePro rating", playerReviews:"Player reviews", verifiedReviews:"VERIFIED system reviews"
  },
  TR: {
    games:"Oyunlar", players:"Oyuncular", guilds:"Loncalar", how:"Nasıl çalışır",
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
    passportLink:"Oyuncu pasaportu", shareTitle:"Oyun profilin — tek bağlantı", login:"Battle.net ile giriş", reviews:"Yorumlar", gameproRating:"GamePro puanı", playerReviews:"Oyuncu yorumları", verifiedReviews:"VERIFIED sistemi yorumları"
  },
  DE: {
    games:"Spiele", players:"Spieler", guilds:"Gilden", how:"So funktioniert es",
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
    passportLink:"Spielerpass", shareTitle:"Dein Gaming-Profil — ein Link", login:"Mit Battle.net einloggen", reviews:"Bewertungen", gameproRating:"GamePro-Bewertung", playerReviews:"Spielerbewertungen", verifiedReviews:"Bewertungen zum VERIFIED-System"
  },
  ES: {
    games:"Juegos", players:"Jugadores", guilds:"Gremios", how:"Cómo funciona",
    h1:"Demuestra tu habilidad.", h2:"Muestra tus logros.",
    intro:"Perfil gaming con logros verificados. Crea tu Achievement Passport y demuestra a gremios y equipos lo que puedes hacer.",
    create:"Crear pasaporte gamer", find:"Buscar jugador", passport:"Achievement Passport", sub:"No palabras — resultados verificados.", verified:"Perfil verificado", verifiedShort:"VERIFIED",
    searchTitle:"Buscar jugador", searchSub:"Busca por rol, rating y logros verificados.", placeholder:"Por ejemplo: Holy Paladin 2700+", search:"Buscar",
    howTitle:"Cómo funciona la verificación", howSub:"De los datos del juego a la insignia VERIFIED.", guild:"Gremios y equipos", guildText:"Encuentra jugadores por rol, rating y progreso verificado.", open:"Abrir búsqueda de jugadores", share:"Compartir pasaporte", copied:"¡Enlace copiado!",
    current:"Disponible ahora", future:"Próximamente", wow:"World of Warcraft", wowText:"Mythic+, raids y PvP — el primer juego de GamePro.", futureText:"Dota 2, CS2 y Path of Exile 2 están en la hoja de ruta.", source:"Fuente", sourceText:"GamePro compara los datos del juego con fuentes compatibles.", check:"Verificación", checkText:"Los datos se comprueban antes de recibir el estado VERIFIED.", badge:"VERIFIED", badgeText:"Solo los logros verificados reciben la insignia verde.", passportLink:"Pasaporte del jugador", shareTitle:"Tu perfil gaming — un solo enlace", login:"Entrar con Battle.net", reviews:"Opiniones", gameproRating:"Valoración de GamePro", playerReviews:"Opiniones de jugadores", verifiedReviews:"Opiniones sobre el sistema VERIFIED"
  },
  FR: {
    games:"Jeux", players:"Joueurs", guilds:"Guildes", how:"Comment ça marche",
    h1:"Prouve ton niveau.", h2:"Montre tes accomplissements.",
    intro:"Profil gaming avec accomplissements vérifiés. Crée ton Achievement Passport et montre aux guildes et équipes ce que tu sais faire.",
    create:"Créer mon passeport", find:"Trouver un joueur", passport:"Achievement Passport", sub:"Pas de paroles — des résultats vérifiés.", verified:"Profil vérifié", verifiedShort:"VERIFIED",
    searchTitle:"Trouver un joueur", searchSub:"Recherche par rôle, rating et accomplissements vérifiés.", placeholder:"Par exemple : Holy Paladin 2700+", search:"Rechercher",
    howTitle:"Comment fonctionne la vérification", howSub:"Des données du jeu au badge VERIFIED.", guild:"Guildes et équipes", guildText:"Trouve des joueurs par rôle, rating et progression vérifiée.", open:"Ouvrir la recherche", share:"Partager le passeport", copied:"Lien copié !",
    current:"Disponible maintenant", future:"Bientôt", wow:"World of Warcraft", wowText:"Mythic+, raids et PvP — le premier jeu de GamePro.", futureText:"Dota 2, CS2 et Path of Exile 2 sont sur la feuille de route.", source:"Source", sourceText:"GamePro vérifie les données du jeu avec les sources prises en charge.", check:"Vérification", checkText:"Les données sont vérifiées avant l'attribution du statut VERIFIED.", badge:"VERIFIED", badgeText:"Seuls les accomplissements vérifiés obtiennent le badge vert.", passportLink:"Passeport joueur", shareTitle:"Ton profil gaming — un seul lien", login:"Se connecter avec Battle.net", reviews:"Avis", gameproRating:"Note GamePro", playerReviews:"Avis des joueurs", verifiedReviews:"Avis sur le système VERIFIED"
  },
  PL: {
    games:"Gry", players:"Gracze", guilds:"Gildie", how:"Jak to działa",
    h1:"Udowodnij swój skill.", h2:"Pokaż swoje osiągnięcia.",
    intro:"Profil gracza ze zweryfikowanymi osiągnięciami. Stwórz Achievement Passport i pokaż gildiom oraz drużynom, co potrafisz.",
    create:"Utwórz paszport gracza", find:"Znajdź gracza", passport:"Achievement Passport", sub:"Nie słowa — zweryfikowane wyniki.", verified:"Profil zweryfikowany", verifiedShort:"VERIFIED",
    searchTitle:"Znajdź gracza", searchSub:"Szukaj po roli, ratingu i zweryfikowanych osiągnięciach.", placeholder:"Na przykład: Holy Paladin 2700+", search:"Szukaj",
    howTitle:"Jak działa weryfikacja", howSub:"Od danych z gry do odznaki VERIFIED.", guild:"Gildie i drużyny", guildText:"Znajduj graczy według roli, ratingu i zweryfikowanego progresu.", open:"Otwórz wyszukiwanie graczy", share:"Udostępnij paszport", copied:"Link skopiowany!",
    current:"Dostępne teraz", future:"Wkrótce", wow:"World of Warcraft", wowText:"Mythic+, rajdy i PvP — pierwsza gra GamePro.", futureText:"Dota 2, CS2 i Path of Exile 2 są już na roadmapie.", source:"Źródło", sourceText:"GamePro porównuje dane z gry z obsługiwanymi źródłami.", check:"Weryfikacja", checkText:"Dane są sprawdzane przed nadaniem statusu VERIFIED.", badge:"VERIFIED", badgeText:"Tylko zweryfikowane osiągnięcia otrzymują zieloną odznakę.", passportLink:"Paszport gracza", shareTitle:"Twój profil gamingowy — jeden link", login:"Zaloguj przez Battle.net", reviews:"Opinie", gameproRating:"Ocena GamePro", playerReviews:"Opinie graczy", verifiedReviews:"Opinie o systemie VERIFIED"
  }
} as const;

type Lang = keyof typeof L;

export default function HomePage() {
  const [lang,setLang] = useState<Lang>("RU");
  const [q,setQ] = useState("");
  const [copied,setCopied] = useState(false);
  const [rioName,setRioName] = useState("");
  const [rioRealm,setRioRealm] = useState("");
  const [rioRegion,setRioRegion] = useState("eu");
  const [rioData,setRioData] = useState<any>(null);
  const [rioLoading,setRioLoading] = useState(false);
  const [rioError,setRioError] = useState("");
  const [supabaseSaving,setSupabaseSaving] = useState(false);
  const [supabaseStatus,setSupabaseStatus] = useState("");
  const [verified,setVerified] = useState(false);
  const [verifiedId,setVerifiedId] = useState<string>("");
  const [verifying,setVerifying] = useState(false);
  const t=L[lang];

  const players=[
    ["🛡️","PlayerOne","Holy Paladin · EU","2920","CE"],
    ["🌙","MoonHeal","Restoration Druid · EU","2780","KSM"],
    ["🔥","FireMage","Fire Mage · EU","2710","AOTC"]
  ].filter(x => !q || x.join(" ").toLowerCase().includes(q.toLowerCase()));

  const sharePassport = async () => {
    const url = typeof window !== "undefined" ? window.location.href + "#passport" : "";
    try {
      if (navigator.share) await navigator.share({ title:"GamePro Achievement Passport", url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2200); }
    } catch {}
  };

  const searchRaiderIO = async () => {
    if (!rioName.trim() || !rioRealm.trim()) { setRioError("Укажи имя персонажа и реалм."); setRioData(null); return; }
    setRioLoading(true); setRioError(""); setRioData(null); setSupabaseStatus("");
    try {
      const params = new URLSearchParams({region:rioRegion,realm:rioRealm.trim().toLowerCase().replace(/\s+/g,"-"),name:rioName.trim(),fields:"mythic_plus_scores_by_season:current,gear"});
      const response = await fetch("https://raider.io/api/v1/characters/profile?"+params.toString());
      if (!response.ok) throw new Error("Персонаж не найден в Raider.IO.");
      setRioData(await response.json());
    } catch (error) { setRioError(error instanceof Error ? error.message : "Не удалось получить данные Raider.IO."); }
    finally { setRioLoading(false); }
  };

  const verifyRaiderIO = async () => {
    if (!rioData) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setSupabaseStatus("Supabase не настроен в переменных Vercel.");
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
      if (!findResponse.ok) throw new Error("Не удалось найти сохранённую запись.");
      const rows = await findResponse.json();
      if (!rows.length) throw new Error("Сначала нажми «Сохранить в GamePro».");
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/player_verifications?id=eq.${rows[0].id}`, {
        method: "PATCH",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ source_verified: true })
      });
      if (!updateResponse.ok) throw new Error(await updateResponse.text() || "Не удалось подтвердить VERIFIED.");
      setVerified(true);
      setVerifiedId(String(rows[0].id || ""));
      setSupabaseStatus("✓ VERIFIED подтверждён GamePro.");
    } catch (error) {
      setSupabaseStatus(error instanceof Error ? error.message : "Не удалось подтвердить VERIFIED.");
    } finally {
      setVerifying(false);
    }
  };

  const saveRaiderIOToSupabase = async () => {
    if (!rioData) return;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setSupabaseStatus("Supabase не настроен в переменных Vercel.");
      return;
    }
    setSupabaseSaving(true); setSupabaseStatus("");
    try {
      const score = rioData.mythic_plus_scores_by_season?.[0]?.scores?.all ?? null;
      const payload = {
        player_name: rioData.name,
        realm: rioData.realm?.name || rioRealm,
        region: String(rioData.region?.name || rioRegion).toUpperCase(),
        mythic_plus_score: score,
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
        throw new Error(text || "Supabase не принял данные.");
      }
      setSupabaseStatus("✓ Данные сохранены в Supabase. Пока это DATA FOUND, не VERIFIED.");
    } catch (error) {
      setSupabaseStatus(error instanceof Error ? `Ошибка Supabase: ${error.message}` : "Не удалось сохранить данные.");
    } finally {
      setSupabaseSaving(false);
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
  <Header lang={lang} setLang={setLang} t={t} />
    <main>
      <section style={{maxWidth:1000,width:"92%",margin:"auto",textAlign:"center",padding:"25px 0 20px"}}>
        <span style={{color:"#72fff4",border:"1px solid #168f88",background:"#0b292b",padding:"8px 13px",borderRadius:99,fontSize:12,fontWeight:800}}>🏆 ACHIEVEMENT PASSPORT</span>
        <h1 style={{fontSize:"clamp(30px,5vw,55px)",lineHeight:.98,margin:"22px 0 18px"}}>{t.h1}<br/><span style={{background:"linear-gradient(90deg,#fff,#e832ff,#16ddff)",WebkitBackgroundClip:"text",color:"transparent"}}>{t.h2}</span></h1>
        <p style={{maxWidth:690,margin:"auto",color:"#9da6c0",fontSize:18,lineHeight:1.65}}>{t.intro}</p>
        <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}><button style={btn} onClick={()=>{}}><span>🎮</span> {t.login}</button></div><div className="achievementRow" style={{marginTop:22,display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>{["KSM","AOTC","CE","2400+ PvP"].map(x=><span key={x} className="achievementBadge">✓ {x} <b>VERIFIED</b></span>)}</div>
      </section>

      <section id="passport" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"60px 0"}}>
        <div className="sectionHead"><div><h2 style={{fontSize:36,marginBottom:8}}>{t.passport}</h2><p style={{color:"#9da6c0",marginTop:0}}>{t.sub}</p></div><button onClick={sharePassport} style={outline}>🔗 {copied ? t.copied : t.share}</button></div>
        <div className="grid2" style={{display:"grid",gridTemplateColumns:"1.05fr .95fr",gap:20}}>
          <div style={card}>
            <div style={{display:"flex",alignItems:"center",gap:15}}><div style={{width:72,height:72,borderRadius:18,display:"grid",placeItems:"center",fontSize:32,background:"linear-gradient(135deg,#7e2cff,#ec2ad4)"}}>⚡</div><div><div style={{fontSize:11,fontWeight:900,letterSpacing:1.5,color:"#52eee3",marginBottom:5}}>GAMEPRO ACHIEVEMENT PASSPORT</div><h3 style={{fontSize:24,margin:"0 0 5px"}}>{rioData?.name || "Vladimir"}</h3><div style={{color:"#9da6c0"}}>{rioData?.class?.name || "Restoration Shaman"} · {rioData?.realm?.name || rioRealm || "EU"} · {String(rioData?.region?.name || rioRegion).toUpperCase()} · World of Warcraft</div><div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,flexWrap:"wrap"}}><span className="verifiedPill">✓ VERIFIED</span><span style={{color:"#71809e",fontSize:11}}>VERIFIED ID: {verifiedId || "—"}</span></div></div></div>
            <div className="stats" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:25}}>{[[rioData?.mythic_plus_scores_by_season?.[0]?.scores?.all ?? "2850","Mythic+ Rating"],["CE","Raid Progress"],["2.4k+","M+ Runs"]].map(x=><div key={x[0]} style={{padding:15,background:"#080d1b",border:"1px solid #1e2540",borderRadius:12}}><b style={{fontSize:21}}>{x[0]}</b><small style={{display:"block",color:"#9da6c0",marginTop:4}}>{x[1]}</small></div>)}</div>
         
          </div>
          <div style={card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><h3 style={{marginTop:0}}>🏆 {t.verifiedShort}</h3><span className="verifiedPill">✓ VERIFIED</span></div><div className="badges" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>{["KSM","2850 M+","Cutting Edge","AOTC"].map(x=><div key={x} style={{padding:17,borderRadius:14,background:"#0a1021",border:"1px solid #1c8f82"}}><b>🏆 {x}</b><small style={{display:"block",color:"#45e0a1",marginTop:6}}>✓ {t.verifiedShort}</small></div>)}</div></div>
        </div>
      </section>

      <section id="players" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"60px 0"}}>
        <h2 style={{textAlign:"center",fontSize:36}}>{t.searchTitle}</h2><p style={{textAlign:"center",color:"#9da6c0"}}>{t.searchSub}</p>
        <div className="searchbar" style={{display:"flex",gap:10,maxWidth:760,margin:"25px auto"}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.placeholder} style={{flex:1,minWidth:0,background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:15,color:"white",outline:"none"}}/><button style={btn}>🔎 {t.search}</button></div>
        <div className="cards" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>{players.map(x=><div key={x[1]} style={card}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:48,height:48,borderRadius:12,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#6126e9,#e92ad4)",fontSize:22}}>{x[0]}</div><div><h3 style={{margin:"0 0 4px"}}>{x[1]}</h3><small style={{color:"#9da6c0"}}>{x[2]}</small></div></div><div style={{display:"flex",gap:7,marginTop:15,flexWrap:"wrap"}}><span className="greenTag">✓ {x[3]} VERIFIED</span><span className="greenTag">✓ {x[4]}</span></div></div>)}</div>
      </section>

      <section id="raiderio" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"0 0 60px"}}>
        <div style={{...card,borderColor:"#17bcb2"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div><h2 style={{fontSize:28,margin:"0 0 7px"}}>🔎 Проверить игрока через Raider.IO</h2><p style={{color:"#9da6c0",margin:0}}>Первый живой источник GamePro для Mythic+ данных.</p></div>
            <span className="verifiedPill">RAIDER.IO</span>
          </div>
          <div className="rioForm" style={{display:"grid",gridTemplateColumns:"1fr 1fr 90px auto",gap:10,marginTop:18}}>
            <input value={rioName} onChange={e=>setRioName(e.target.value)} placeholder="Имя персонажа" style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white",outline:"none"}} />
            <input value={rioRealm} onChange={e=>setRioRealm(e.target.value)} placeholder="Реалм, например Kazzak" style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white",outline:"none"}} />
            <select value={rioRegion} onChange={e=>setRioRegion(e.target.value)} style={{background:"#090e1d",border:"1px solid #26364b",borderRadius:12,padding:14,color:"white"}}><option value="eu">EU</option><option value="us">US</option><option value="kr">KR</option><option value="tw">TW</option></select>
            <button style={btn} onClick={searchRaiderIO} disabled={rioLoading}>{rioLoading ? "Проверяем…" : "Проверить"}</button>
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

      <section id="reviews" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"60px 0"}}><h2 style={{textAlign:"center",fontSize:36}}>{t.reviews}</h2><p style={{textAlign:"center",color:"#9da6c0"}}>GamePro — доверие, подтверждённое игроками.</p><div className="reviewGrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:25}}>{[["⭐ 4.9/5",t.gameproRating,"★★★★★"],["💬",t.playerReviews,"«Удобно показать прогресс и быстро найти подходящую команду.»"],["✓ VERIFIED",t.verifiedReviews,"«Наконец понятно, какие достижения действительно подтверждены.»"]].map(x=><div key={x[1]} style={card}><div style={{fontSize:25,fontWeight:900}}>{x[0]}</div><h3>{x[1]}</h3><p style={{color:"#9da6c0",lineHeight:1.6,marginBottom:0}}>{x[2]}</p></div>)}</div></section>

<section id="guilds" style={{maxWidth:1160,width:"92%",margin:"auto",padding:"40px 0 80px"}}><div style={{...card,textAlign:"center",borderColor:"#17bcb2",background:"radial-gradient(circle at 50% 0,#0c3335,transparent 60%),linear-gradient(145deg,#10162b,#080d1b)"}}><div style={{fontSize:35}}>👥</div><h2 style={{fontSize:34}}>{t.guild}</h2><p style={{maxWidth:700,margin:"0 auto 24px",color:"#9da6c0",lineHeight:1.7}}>{t.guildText}</p><a href="#players" style={btn}>{t.open}</a></div></section>

      <section style={{maxWidth:760,width:"92%",margin:"auto",padding:"0 0 80px",textAlign:"center"}}><h2>{t.shareTitle}</h2><p style={{color:"#9da6c0"}}>{t.passportLink}: Vladimir · 2850 M+ · CE · VERIFIED</p><button onClick={sharePassport} style={btn}>🔗 {copied ? t.copied : t.share}</button></section>
    </main>

    <footer style={{borderTop:"1px solid #171c31",padding:28,color:"#737c98"}}><div className="footer" style={{maxWidth:1160,width:"92%",margin:"auto",display:"flex",justifyContent:"space-between",gap:15}}><span>© 2026 GamePro Market</span><span>Achievement Passport · WoW MVP · Dota 2 · CS2 · PoE2</span></div></footer>

    <style jsx>{`\n      a,button{font-family:inherit}      .navlinks a:hover{color:#58eee5!important}.navlinks a:active,.navlinks a:focus-visible{color:#58eee5!important;text-shadow:0 0 14px #19e0d5}.achievementBadge{display:inline-flex;align-items:center;gap:6px;padding:9px 12px;border:1px solid #1c8f82;border-radius:999px;background:#0a1d24;color:#52eee3;font-size:12px;font-weight:900;box-shadow:0 0 16px #16d8cf18}.achievementBadge b{font-size:9px;color:#8afff7}.achievementBadge:active{box-shadow:0 0 24px #16d8cfaa,0 0 50px #16d8cf55;transform:translateY(1px)}button:active,a:active{box-shadow:0 0 28px #16d8cfaa,0 0 60px #16d8cf44!important;transform:translateY(1px)}button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #19e0d5;outline-offset:3px;box-shadow:0 0 24px #16d8cf88}.reviewGrid{}
.navlinks a{text-decoration:none;transition:color .2s}.navlinks a:hover{color:#58eee5!important}.sectionHead,.gameHeader{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:25px}.verifiedPill,.status{display:inline-flex;padding:7px 10px;border-radius:999px;background:#0c302f;color:#52eee3;border:1px solid #168f88;font-size:11px;font-weight:900}.futureStatus{display:inline-flex;padding:6px 9px;border-radius:999px;background:#171d31;color:#8994af;font-size:10px;font-weight:800}.greenTag{background:#0d2929;padding:7px;border-radius:7px;color:#45e0a1;font-size:11px;border:1px solid #174f49}\n      @media(max-width:900px){.navlinks{display:none!important}.grid2,.cards,.steps,.gameGrid,.reviewGrid{grid-template-columns:1fr!important}.gameGrid>div{min-height:0}.sectionHead,.gameHeader{align-items:flex-start;flex-direction:column}.sectionHead button{width:100%}}\n      @media(max-width:700px){.rioForm{grid-template-columns:1fr!important}.rioForm button{width:100%}}
      @media(max-width:560px){.nav{min-height:68px}.nav select{margin-left:auto}.stats{grid-template-columns:1fr!important}.badges{grid-template-columns:1fr!important}.searchbar{flex-direction:column}.searchbar button{width:100%}.footer{display:block!important;text-align:center}.footer span{display:block;margin:7px 0}.hero{} }\n    `}</style>\n  </div>;
}
