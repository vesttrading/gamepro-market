 "use client";
import { useState } from "react";

export default function GuildApplicationPage() {
  const [guildName, setGuildName] = useState("");
  const [guildGame, setGuildGame] = useState("World of Warcraft");
  const [guildRegion, setGuildRegion] = useState("EU");
  const [guildRealm, setGuildRealm] = useState("");
  const [guildDiscord, setGuildDiscord] = useState("");
  const [guildEmail, setGuildEmail] = useState("");
  const [guildLink, setGuildLink] = useState("");
  const [guildPlayers, setGuildPlayers] = useState("");
  const [guildInterest, setGuildInterest] = useState("поиск игроков");
  const [guildLoading, setGuildLoading] = useState(false);
  const [guildStatus, setGuildStatus] = useState("");

  const handleGuildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildName || !guildRealm || !guildDiscord) {
      setGuildStatus("❌ Заполните обязательные поля: Название, Реалм и Discord.");
      return;
    }
    setGuildLoading(true); setGuildStatus("");
    try {
      const response = await fetch(${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/guild_applications, {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!},
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          guild_name: guildName,
          game: guildGame,
          region: guildRegion,
          realm: guildRealm,
          discord_contact: guildDiscord,
          email_contact: guildEmail,
          guild_link: guildLink,
          player_count: guildPlayers,
          interest_reason: guildInterest
        })
      });
      if (!response.ok) throw new Error("Ошибка при отправке");
      setGuildStatus("🎉 Заявка успешно отправлена! Мы свяжемся с вами в Discord.");
      setGuildName(""); setGuildRealm(""); setGuildDiscord(""); setGuildEmail(""); setGuildLink(""); setGuildPlayers("");
    } catch (error) {
      setGuildStatus("❌ Не удалось отправить заявку. Попробуйте позже.");
    } finally { setGuildLoading(false); }
  };

  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 20px", borderRadius: 12,
    background: "linear-gradient(135deg,#18e0d1,#12bfb6)", color: "#021312", fontWeight: 900, border: 0, cursor: "pointer",
    boxShadow: "0 0 30px #16d8cf38", fontSize: "15px", width: "100%", marginTop: 10
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050713", color: "#f7f8ff", fontFamily: "Arial,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 650, width: "100%", background: "linear-gradient(145deg,#10162b,#080d1b)", border: "1px solid #17bcb2", borderRadius: 20, padding: 30, boxShadow: "0 0 35px #16d8cf12" }}>
        
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <div style={{ fontSize: 35 }}>👥</div>
          <h1 style={{ fontSize: 28, margin: "10px 0 5px", fontWeight: "bold" }}>Регистрация гильдий и команд</h1>
          <p style={{ color: "#9da6c0", margin: 0, fontSize: "14px" }}>Получите бесплатный PRO-доступ к базе проверенных игроков на 3 месяца</p>
        </div>

        <form onSubmit={handleGuildSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input value={guildName} onChange={e => setGuildName(e.target.value)} placeholder="Название гильдии *" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
            <select value={guildGame} onChange={e => setGuildGame(e.target.value)} style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }}>
             <option value="World of Warcraft">World of Warcraft</option>
              <option value="Dota 2">Dota 2</option>
              <option value="CS2">CS2</option>
              <option value="Path of Exile 2">Path of Exile 2</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            <select value={guildRegion} onChange={e => setGuildRegion(e.target.value)} style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }}>
              <option value="EU">EU</option><option value="US">US</option><option value="RU">RU</option>
            </select>
            <input value={guildRealm} onChange={e => setGuildRealm(e.target.value)} placeholder="Реалм / Сервер (например, Kazzak) *" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input value={guildDiscord} onChange={e => setGuildDiscord(e.target.value)} placeholder="Контакт Discord (логин) *" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
            <input type="email" value={guildEmail} onChange={e => setGuildEmail(e.target.value)} placeholder="Контактный email" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <input value={guildLink} onChange={e => setGuildLink(e.target.value)} placeholder="Ссылка (Raider.IO / WCL / Сайт)" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
            <input value={guildPlayers} onChange={e => setGuildPlayers(e.target.value)} placeholder="Кол-во игроков" style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: "#9da6c0" }}>Что наиболее интересно в платформе?</label>
            <select value={guildInterest} onChange={e => setGuildInterest(e.target.value)} style={{ background: "#090e1d", border: "1px solid #26364b", borderRadius: 12, padding: 14, color: "white", outline: "none" }}>
              <option value="поиск игроков">Быстрый поиск проверенных игроков (Рекрутинг)</option>
              <option value="проверка достижений">Автоматическая проверка достижений кандидатов</option>
              <option value="другое">Всё вместе / Другое</option>
            </select>
          </div>

          <button type="submit" disabled={guildLoading} style={btn}>
            {guildLoading ? "Отправка..." : "Оставить заявку"}
          </button>

          {guildStatus && (
            <p style={{ textAlign: "center", color: guildStatus.startsWith("🎉") ? "#45e0a1" : "#ff8e9e", fontSize: 14, margin: "10px 0 0", fontWeight: "bold" }}>
              {guildStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
