 "use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function BecomeCoachPage() {
  const { data: session, status } = useSession();

  const [game, setGame] = useState("WoW");
  const [role, setRole] = useState("");
  const [discord, setDiscord] = useState("");
  const [description, setDescription] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceType, setServiceType] = useState("Coaching");
  const [price, setPrice] = useState("25");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    console.log("COACH FORM SUBMITTED");
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/coaches/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game,
          role,
          discord,
          description,
          serviceTitle,
          serviceType,
          price: Number(price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Could not save your profile.");
      } else {
        setMessage("Profile saved! It is not published yet.");
      }
    } catch {
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    background: "#0c1123",
    color: "white",
    border: "1px solid #313858",
    borderRadius: 9,
    boxSizing: "border-box",
  };

  if (status === "loading") {
    return <main style={{ padding: 40, color: "white" }}>Loading...</main>;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 620, margin: "60px auto", padding: 24, color: "white" }}>
        <h1>Become a GamePro Coach</h1>
        <p>Sign in with Battle.net to create your coach profile.</p>
        <button
          onClick={() => signIn("battlenet", { callbackUrl: "/become-coach" })}
          style={{ padding: 13, borderRadius: 9, cursor: "pointer" }}
        >
          Sign in with Battle.net
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: 24, color: "white" }}>
      <h1>Become a GamePro Coach</h1>
      <p>Create your profile and offer coaching services to players.</p>

      <form onSubmit={submitForm} style={{ display: "grid", gap: 18 }}>
        <label>
          Game
          <select value={game} onChange={(e) => setGame(e.target.value)} style={fieldStyle}>
            <option value="WoW">World of Warcraft</option>
            <option value="Dota 2">Dota 2</option>
            <option value="CS2">Counter-Strike 2</option>
          </select>
        </label>

        <label>
          Role or specialization
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Mythic+, Healer, Mid lane"
            required
            style={fieldStyle}
          />
        </label>

        <label>
          Discord username or contact
          <input
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="Your Discord contact"
            required
            style={fieldStyle}
          />
        </label>

        <label>
          About you (2–3 sentences)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={20}
            maxLength={1000}
            required
            rows={4}
            style={fieldStyle}
          />
        </label>

        <h2>First service</h2>
        <label>
          Service title
          <input
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
            placeholder="e.g. Mythic+ coaching session"
            required
            style={fieldStyle}
          />
        </label>

        <label>
          Service type
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={fieldStyle}>
            <option value="Coaching">Coaching</option>
            <option value="Guide">Guide</option>
            <option value="UI">UI setup</option>
          </select>
        </label>

        <label>
          Price (USD)
          <input
            type="number"
            min="1"
            max="10000"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={fieldStyle}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 14,
            border: 0,
            borderRadius: 10,
            background: "#20c9bd",
            color: "#06101a",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Save coach profile"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
