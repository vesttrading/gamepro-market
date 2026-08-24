"use client";

import { useMemo, useState } from "react";

const achievements = [
  { game: "World of Warcraft", title: "KSM", value: "2850", status: "VERIFIED", icon: "🏆" },
  { game: "World of Warcraft", title: "2850 M+", value: "2.4k+", status: "VERIFIED", icon: "⚡" },
  { game: "World of Warcraft", title: "Cutting Edge", value: "CE", status: "VERIFIED", icon: "🔥" },
  { game: "World of Warcraft", title: "AOTC", value: "AOTC", status: "VERIFIED", icon: "🛡️" },
];

const players = [
  { name: "Vladimir", role: "Restoration Shaman", game: "World of Warcraft", region: "EU", rating: "2850", progress: "CE" },
  { name: "Artem", role: "Frost Mage", game: "World of Warcraft", region: "EU", rating: "2810", progress: "CE" },
  { name: "Mikhail", role: "Protection Paladin", game: "World of Warcraft", region: "EU", rating: "2765", progress: "AOTC" },
];

export default function HomePage() {
  const [lang, setLang] = useState("RU");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredPlayers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return players;
    return players.filter((p) =>
      `${p.name} ${p.role} ${p.game} ${p.region} ${p.rating}`.toLowerCase().includes(q)
    );
  }, [search]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #05070d; }
        button, input, select { font: inherit; }
        h1,h2,h3,p { margin-top: 0; }
        .statbox { background:#101827;border:1px solid #202b40;border-radius:14px;padding:18px; }
        .statbox b { display:block;font-size:28px; }
        .statbox span { color:#71809b;font-size:12px; }
        .guildBox > div { padding:16px 0;border-bottom:1px solid #1e293c; }
        .guildBox > div:last-child { border-bottom:0; }
        .guildBox b { display:block;font-size:18px;margin-top:3px; }
        .guildBox span { color:#71809b;font-size:12px; }
        @media (max-width: 850px) {
          nav { display:none !important; }
          .gameGrid,.steps { grid-template-columns:1fr 1fr !important; }
          .twoColumns { grid-template-columns:1fr !important; }
          .achievementGrid { grid-template-columns:1fr !important; }
          .playerCard { flex-wrap:wrap; }
          .playerStat { text-align:left; }
        }
        @media (max-width: 560px) {
          .hero { padding-top:75px !important; }
          .gameGrid,.steps,.stats { grid-template-columns:1fr !important; }
          .passport { padding:20px !important; }
          .searchBox { flex-direction:column; }
          .playerStat { min-width:80px; }
          .share { margin-left:0 !important; }
          .headerInner { padding:0 12px !important; }
          .searchSmall { display:none; }
        }
      `}</style>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button style={styles.logo} onClick={() => scrollTo("home")}>
            <span style={styles.logoMark}>🎮</span>
            <span>
              <b>GAMEPRO</b> <strong>MARKET</strong>
            </span>
          </button>

          <nav style={styles.nav}>
            <button onClick={() => scrollTo("games")}>Игры</button>
            <button onClick={() => scrollTo("players")}>Игроки</button>
            <button onClick={() => scrollTo("guilds")}>Гильдии</button>
            <button onClick={() => scrollTo("how")}>Как это работает</button>
          </nav>

          <div style={styles.headerActions}>
            <button style={styles.searchSmall} onClick={() => scrollTo("players")}>⌕ Поиск</button>
            <div style={styles.languageButtons}>
              {["RU", "EN", "TR", "DE"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  style={{
                    ...styles.langButton,
                    ...(lang === item ? styles.langButtonActive : {}),
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section id="home" style={styles.hero}>
        <div style={styles.badge}>✦ ACHIEVEMENT PASSPORT</div>
        <h1 style={styles.heroH1}>
          Докажи свой скилл.
          <br />
          <span>Покажи свои достижения.</span>
        </h1>
        <p style={styles.heroP}>
          Игровой профиль с подтверждёнными результатами. Собери свой
          паспорт игрока и покажи гильдиям и командам, на что ты способен.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.primary} onClick={() => scrollTo("passport")}>
            Создать игровой паспорт
          </button>
          <button style={styles.secondary} onClick={() => scrollTo("players")}>
            Найти игрока
          </button>
        </div>
        <div style={styles.trust}>
          <span>✓ Проверяем результаты</span>
          <span>✓ VERIFIED бейджи</span>
          <span>✓ Публичный профиль</span>
        </div>
      </section>

      <section id="games" style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>01</span>
          <h2>Игры</h2>
        </div>
        <div style={styles.gameGrid}>
          {[
            ["⚔️", "World of Warcraft", "Mythic+ · Raid · PvP", "ACTIVE"],
            ["☠️", "Dota 2", "Rank · Match history", "SOON"],
            ["🎯", "CS2", "Premier · Faceit", "SOON"],
            ["🧪", "Path of Exile 2", "Build · Progress", "SOON"],
          ].map(([icon, name, desc, status]) => (
            <div style={styles.gameCard} key={name}>
              <div style={styles.gameIcon}>{icon}</div>
              <div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
              <span style={status === "ACTIVE" ? styles.active : styles.soon}>{status}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="passport" style={styles.passportSection}>
        <div style={styles.sectionTitle}>
          <span>02</span>
          <h2>Achievement Passport</h2>
        </div>

        <div style={styles.passport}>
          <div style={styles.profile}>
            <div style={styles.avatar}>⚡</div>
            <div>
              <h2>Vladimir</h2>
              <p>Restoration Shaman · EU · World of Warcraft</p>
              <small>● Профиль подтверждён</small>
            </div>
          </div>

          <div style={styles.stats}>
            <div className="statbox"><b>2850</b><span>Mythic+ Rating</span></div>
            <div className="statbox"><b>CE</b><span>Raid Progress</span></div>
            <div className="statbox"><b>2.4k+</b><span>M+ Runs</span></div>
          </div>

          <div style={styles.achievements}>
            <h3>🏆 Подтверждённые достижения</h3>
            <div style={styles.achievementGrid}>
              {achievements.map((a) => (
                <div style={styles.achievement} key={a.title}>
                  <div>
                    <span style={styles.achievementIcon}>{a.icon}</span>
                    <b>{a.title}</b>
                    <small>{a.game}</small>
                  </div>
                  <strong>✓ {a.status}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.passportLinks}>
            <span>raider.io ✓</span>
            <span>warcraftlogs ✓</span>
            <button style={styles.share} onClick={() => navigator.clipboard?.writeText(location.href)}>
              Поделиться паспортом
            </button>
          </div>
        </div>
      </section>

      <section id="players" style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>03</span>
          <h2>Найти игрока</h2>
        </div>
        <p style={styles.lead}>Ищите игроков по игре, роли, рейтингу и подтверждённым достижениям.</p>

        <div style={styles.searchBox}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Например: Restoration Shaman 2700+"
          />
          <button style={styles.primary} onClick={() => setShowSearch(true)}>Поиск</button>
        </div>

        <div style={styles.playerList}>
          {filteredPlayers.map((p) => (
            <div style={styles.playerCard} key={p.name}>
              <div style={styles.miniAvatar}>⚡</div>
              <div style={{ flex: 1 }}>
                <h3>{p.name} <span style={styles.verified}>✓ VERIFIED</span></h3>
                <p>{p.role} · {p.game} · {p.region}</p>
              </div>
              <div style={styles.playerStat}><b>{p.rating}</b><span>M+ Rating</span></div>
              <div style={styles.playerStat}><b>{p.progress}</b><span>Progress</span></div>
              <button style={styles.outline}>Открыть</button>
            </div>
          ))}
        </div>
        {showSearch && <div style={styles.notice}>Найдено игроков: {filteredPlayers.length}</div>}
      </section>

      <section id="guilds" style={styles.darkSection}>
        <div style={styles.sectionTitle}>
          <span>04</span>
          <h2>Для гильдий и команд</h2>
        </div>
        <div style={styles.twoColumns}>
          <div>
            <h2>Меньше слов. Больше доказательств.</h2>
            <p>
              Не нужно часами проверять Discord-резюме. Откройте паспорт,
              увидьте VERIFIED достижения и сразу поймите уровень игрока.
            </p>
            <button style={styles.primary} onClick={() => scrollTo("players")}>Открыть поиск</button>
          </div>
          <div style={styles.guildBox}>
            <div>🔎 <b>2850+ Rio</b><span>Игроки с подтверждённым рейтингом</span></div>
            <div>✓ <b>CE / AOTC</b><span>Рейдовый прогресс проверен</span></div>
            <div>⚡ <b>Роль</b><span>Быстрый подбор нужного игрока</span></div>
          </div>
        </div>
      </section>

      <section id="how" style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>05</span>
          <h2>Как это работает</h2>
        </div>
        <div style={styles.steps}>
          {[
            ["01", "Создай паспорт", "Заполни игровой профиль и добавь свои аккаунты."],
            ["02", "Загрузи пруф", "Добавь ссылку на Raider.IO, WarcraftLogs или другой источник."],
            ["03", "Получишь VERIFIED", "Мы проверяем достижение и выдаём подтверждённый бейдж."],
            ["04", "Покажи результат", "Отправляй профиль гильдиям, командам и организаторам."],
          ].map(([num, title, text]) => (
            <div style={styles.step} key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <div>
          <b>🎮 GAMEPRO MARKET</b>
          <p>Achievement Passport для игроков.</p>
        </div>
        <div>© 2026 GamePro Market</div>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 50% -10%, #202a48 0, #080b14 42%, #05070d 100%)",
    color: "#f4f7ff",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  header: { position: "sticky", top: 0, zIndex: 20, background: "rgba(5,7,13,.88)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,.08)" },
  headerInner: { maxWidth: 1200, margin: "0 auto", minHeight: 72, padding: "0 22px", display: "flex", alignItems: "center", gap: 28 },
  logo: { background: "none", border: 0, color: "white", display: "flex", alignItems: "center", gap: 10, fontSize: 17, cursor: "pointer", marginRight: "auto" },
  logoMark: { width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 11, background: "linear-gradient(135deg,#00e5d4,#695cff)" },
  logo: { background: "none", border: 0, color: "white", display: "flex", alignItems: "center", gap: 10, fontSize: 17, cursor: "pointer", marginRight: "auto" },
  nav: { display: "flex", gap: 24 },
  navButton: { background: "none", border: 0 },
  headerActions: { display: "flex", alignItems: "center", gap: 10 },
  searchSmall: { background: "none", color: "#b8c3dd", border: 0, cursor: "pointer" },
  languageButtons: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: 4,
    background: "#0b101b",
    border: "1px solid #202b40",
    borderRadius: 11,
  },
  langButton: {
    background: "transparent",
    color: "#7f8da8",
    border: "1px solid transparent",
    borderRadius: 8,
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all .2s ease",
  },
  langButtonActive: {
    color: "#031014",
    background: "#00d8cc",
    border: "1px solid #45fff3",
    boxShadow: "0 0 14px rgba(0,216,204,.65), 0 0 28px rgba(0,216,204,.25)",
  },
  hero: { maxWidth: 1050, margin: "0 auto", padding: "115px 22px 90px", textAlign: "center" },
  badge: { display: "inline-block", color: "#64e9df", fontSize: 13, letterSpacing: 1.4, marginBottom: 22 },
  heroH1: { fontSize: 72 },
  hero: { maxWidth: 1050, margin: "0 auto", padding: "115px 22px 90px", textAlign: "center" },
  heroButtons: { display: "flex", justifyContent: "center", gap: 14, marginTop: 35, flexWrap: "wrap" },
  primary: { background: "linear-gradient(135deg,#12e2d0,#00aeb8)", color: "#031014", border: 0, borderRadius: 11, padding: "15px 26px", fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,210,200,.2)" },
  secondary: { background: "rgba(255,255,255,.03)", color: "#dce8ff", border: "1px solid #00cfc5", borderRadius: 11, padding: "15px 26px", fontWeight: 700, cursor: "pointer" },
  trust: { display: "flex", justifyContent: "center", gap: 26, flexWrap: "wrap", marginTop: 30, color: "#7e8ba7", fontSize: 13 },
  section: { maxWidth: 1150, margin: "0 auto", padding: "90px 22px" },
  sectionTitle: { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 },
  gameGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  gameCard: { background: "rgba(15,20,33,.9)", border: "1px solid #202b42", borderRadius: 18, padding: 20, display: "flex", alignItems: "center", gap: 14 },
  gameIcon: { fontSize: 30 },
  active: { marginLeft: "auto", color: "#62eadf", fontSize: 10, fontWeight: 800 },
  soon: { marginLeft: "auto", color: "#65728c", fontSize: 10, fontWeight: 800 },
  passportSection: { background: "linear-gradient(180deg,rgba(0,217,205,.04),transparent)", padding: "90px 22px" },
  passport: { maxWidth: 1100, margin: "0 auto", background: "rgba(12,17,29,.95)", border: "1px solid rgba(0,220,210,.22)", borderRadius: 26, padding: 30, boxShadow: "0 25px 70px rgba(0,0,0,.3)" },
  profile: { display: "flex", gap: 18, alignItems: "center" },
  avatar: { width: 82, height: 82, borderRadius: 22, display: "grid", placeItems: "center", fontSize: 35, background: "linear-gradient(135deg,#263b85,#6a45b8)" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "25px 0" },
  achievements: { borderTop: "1px solid #222c40", paddingTop: 25 },
  achievementGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 },
  achievement: { background: "#111827", border: "1px solid #222d43", borderRadius: 14, padding: 17, display: "flex", justifyContent: "space-between", alignItems: "center" },
  achievementIcon: { marginRight: 8 },
  passportLinks: { marginTop: 20, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", color: "#69e8df", fontSize: 13 },
  share: { marginLeft: "auto", background: "#101827", border: "1px solid #2b3852", color: "#dce6fb", padding: "10px 14px", borderRadius: 9, cursor: "pointer" },
  lead: { color: "#8d9ab3", marginTop: -20, marginBottom: 25 },
  searchBox: { display: "flex", gap: 10, maxWidth: 800 },
  input: { flex: 1 },
  searchBox: { display: "flex", gap: 10, maxWidth: 800 },
  playerList: { display: "grid", gap: 10, marginTop: 25 },
  playerCard: { display: "flex", alignItems: "center", gap: 15, background: "#0d1320", border: "1px solid #202a40", borderRadius: 15, padding: 16 },
  miniAvatar: { width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 14, background: "#1a2440" },
  verified: { color: "#4ee3d8", fontSize: 10, marginLeft: 6 },
  playerStat: { minWidth: 75, textAlign: "center" },
  outline: { background: "transparent", border: "1px solid #00cfc5", color: "#6ce9e0", padding: "9px 13px", borderRadius: 9, cursor: "pointer" },
  notice: { marginTop: 14, color: "#64e9df" },
  darkSection: { background: "#070b12", borderTop: "1px solid #111a29", borderBottom: "1px solid #111a29", padding: "90px 22px" },
  twoColumns: { maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" },
  guildBox: { background: "#0e1522", border: "1px solid #202c42", borderRadius: 20, padding: 25 },
  guildBoxItem: { padding: 15 },
  steps: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  step: { background: "#0e1420", border: "1px solid #202a40", borderRadius: 16, padding: 22 },
  footer: { maxWidth: 1150, margin: "0 auto", padding: "45px 22px", display: "flex", justifyContent: "space-between", color: "#68758e", gap: 20, flexWrap: "wrap" },
};

styles.heroH1 = { fontSize: "clamp(46px,8vw,76px)", lineHeight: 1.03, margin: "0 0 24px", letterSpacing: "-2px" };
styles.heroP = { maxWidth: 720, margin: "0 auto", color: "#8e9bb6", fontSize: 18, lineHeight: 1.6 };
styles.sectionTitle = { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 };
styles.sectionTitle = { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 };
styles.sectionTitle = { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 };
styles.sectionTitle = { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 };
styles.sectionTitle = { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 35 };
styles.input = { flex: 1, background: "#0d1421", border: "1px solid #29364e", borderRadius: 11, color: "white", padding: "15px 17px", outline: "none" };
styles.page = { ...styles.page, lineHeight: 1.4 };
styles.page.h1 = {};
