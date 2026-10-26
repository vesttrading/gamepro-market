"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Coach = {
  id: number;
  battletag: string;
};

type CoachMessage = {
  id: number;
  coach_id: number;
  sender_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
};

export default function CoachMessagesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch("/api/coach/messages", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load messages");
          return;
        }

        setCoaches(data.coaches ?? []);
        setMessages(data.messages ?? []);
      } catch {
        setError("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080d1b",
        color: "#f4f7ff",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
     <Link 
    href={coaches.length > 0 ? /coach/${coaches[0].id} : "/"} 
    style={{
      color: "#00bfff", 
      textDecoration: "none", 
      fontSize: "14px", 
      display: "inline-block", 
      marginBottom: "16px"
    }}
  >
    ← GamePro
  </Link>

        <h1 style={{ fontSize: 30, marginBottom: 8 }}>
          Coach Inbox
        </h1>

        <p style={{ color: "#aab5d0", marginBottom: 28 }}>
          Messages sent to your GamePro coach profile.
        </p>

        {loading && <p>Loading messages...</p>}

        {!loading && error && (
          <div
            style={{
              padding: 16,
              background: "#251522",
              border: "1px solid #71384d",
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && coaches.length > 0 && (
          <p style={{ color: "#20c9bd", marginBottom: 20 }}>
            Coach profile: {coaches.map((coach) => coach.battletag).join(", ")}
          </p>
        )}

        {!loading && !error && messages.length === 0 && (
          <div
            style={{
              padding: 24,
              background: "#10162b",
              border: "1px solid #262d49",
              borderRadius: 16,
            }}
          >
            No messages yet.
          </div>
        )}

        {!loading &&
          !error &&
          messages.map((item) => (
            <article
              key={item.id}
              style={{
                padding: 20,
                marginBottom: 14,
                background: "#10162b",
                border: "1px solid #262d49",
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <strong>Player ID: {item.sender_id}</strong>
                <span style={{ color: "#aab5d0", fontSize: 13 }}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>

              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {item.message}
              </p>

              <p style={{ color: "#aab5d0", fontSize: 12 }}>
                {item.is_read ? "Read" : "Unread"}
              </p>
            </article>
          ))}
      </div>
    </main>
  );
}
