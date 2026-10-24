"use client";

type Lang = "RU" | "EN" | "TR" | "DE" | "ES" | "FR" | "PL";

type HeaderProps = {
lang: Lang;
setLang: (lang: Lang) => void;
t: any;
};

export default function Header({ lang, setLang, t }: HeaderProps) {
return (
<header
style={{
position: "sticky",
top: 0,
zIndex: 5,
borderBottom: "1px solid #171c31",
background: "#050713ee",
backdropFilter: "blur(14px)",
}}
>
<nav
className="nav"
style={{
maxWidth: 1160,
width: "92%",
margin: "auto",
minHeight: 76,
display: "flex",
alignItems: "center",
gap: 28,
}}
>
<a
href="/"
aria-label="GamePro Market"
style={{
display: "flex",
alignItems: "center",
textDecoration: "none",
flexShrink: 0,
}}
>
<img
src="/gamepro-logo.png"
alt="GamePro Market"
style={{ height: "45px", width: "auto" }}
/>
</a>

    <div
      className="navlinks"
      style={{
        display: "flex",
        gap: 22,
        flex: 1,
        justifyContent: "center",
      }}
    >
     
      <a href="#how" style={{ color: "#bdc4da" }}>
        {t.how}
      </a>

      <a href="/become-coach" style={{ color: "#bdc4da" }}>
        {lang === "RU" ? "Стать коучем" :
        lang === "TR" ? "Koç Ol" :
        lang === "DE" ? "Coach werden" :
        lang === "ES" ? "Ser coach" :
        lang === "FR" ? "Devenir coach" :
        lang === "PL" ? "Zostań coachem" :
        "Become a coach"}
    </a>

        <a href="/coach/messages" style={{ color: "#bdc4da", textDecoration: "none", whiteSpace: "nowrap" }}>
         {lang === "RU" ? "Мои сообщения" : 
         lang === "TR" ? "Mesajlarım" :
         lang === "DE" ? "Meine Nachrichten" :
         lang === "ES" ? "Mis mensajes" :
         lang === "FR" ? "Mes messages" :
         lang === "PL" ? "Moje wiadomości" :
         "My Messages"}
     </a>

      <a href="#contact" style={{ color: "#bdc4da" }}>
        {t.contact}
      </a>
    </div>

    <div
      className="language"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 19 }}>
        🌐
      </span>

      <select
        value={lang}
        onChange={(e) => {
          const newLang = e.target.value as Lang;
          setLang(newLang);
          localStorage.setItem("gamepro-lang", newLang);
          window.dispatchEvent(new Event("languageChanged"));
        }}
        aria-label="Language"
        style={{
          background: "#0c1123",
          color: "white",
          border: "1px solid #313858",
          borderRadius: 9,
          padding: 9,
          cursor: "pointer",
        }}
      >
        <option value="EN">EN</option>
        <option value="DE">DE</option>
        <option value="ES">ES</option>
        <option value="FR">FR</option>
        <option value="TR">TR</option>
        <option value="RU">RU</option>
        <option value="PL">PL</option>
      </select>
    </div>
  </nav>
</header>

);
}
