"use client";

// Переводы для шапки
const L = {
  RU: { how: "Как это работает", find: "Игры", guilds: "Гильдии" },
  EN: { how: "How it works", find: "Games", guilds: "Guilds" },
  TR: { how: "Nasıl Çalışır", find: "Oyunlar", guilds: "Loncalar" },
  DE: { how: "Wie es funktioniert", find: "Spiele", guilds: "Gilden" },
  ES: { how: "Cómo funciona", find: "Juegos", guilds: "Gremios" },
  FR: { how: "Comment ça marche", find: "Jeux", guilds: "Guildes" },
  PL: { how: "Jak to działa", find: "Gry", guilds: "Gildie" }
};

type Lang = keyof typeof L;

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const t = L[lang] || L.RU;

  return (
    <>
      <header className="main-header">
        <nav className="nav">
          <a href="#" aria-label="GamePro Market" className="logo-link">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAAAAMUlEQVR42u3XQREAAAjDMCv5N7aCh2tgNuQ5ExGZmZmZmZmZmZmZmZmZmZmZmZmZmZl5YwGms1shXZj51AAAAABJRU5ErkJggg==" alt="Logo" />
          </a>
          
          <div className="navlinks">
            <a href="#how">{t.how}</a>
            <a href="#players">{t.find}</a>
            <a href="#guilds">{t.guilds}</a>
          </div>

          <div className="language">
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              <option value="RU">RU</option>
              <option value="EN">EN</option>
              <option value="TR">TR</option>
              <option value="DE">DE</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
              <option value="PL">PL</option>
            </select>
          </div>
        </nav>
      </header>

      <style jsx>{
        .main-header {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #17bcb2;
          background: #0a0f18;
          padding: 0 16px;
        }
        .nav {
          max-width: 1160px;
          width: 100%;
          margin: 0 auto;
          min-height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-link img {
          height: 40px;
        }
        .navlinks {
          display: flex;
          gap: 22px;
        }
        .navlinks a {
          color: #bdc4da;
          text-decoration: none;
          transition: color 0.2s;
        }
        .navlinks a:hover {
          color: #17bcb2;
        }
        .language select {
          background: transparent;
          color: #bdc4da;
          border: 1px solid #17bcb2;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
        }
        .language select option {
          background: #0a0f18;
        }
      }</style>
    </>
  );
}
