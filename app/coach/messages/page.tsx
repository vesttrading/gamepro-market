"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function CoachMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch("/api/coach/messages");
        const data = await res.json();
        
        if (!res.ok) {
          setError("Error loading data");
          return;
        }

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
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* КРАСИВЫЙ ОБЩИЙ КОНТЕЙНЕР КАРТОЧКИ */}
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          background: "rgba(13, 20, 38, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "35px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* ВЕРХНЯЯ НАВИГАЦИЯ И ИКОНКИ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            &lt;- GamePro
          </Link>
          
          {/* Иконки панели управления в стиле макета */}
          <div style={{ display: "flex", gap: "18px", color: "#64748b" }}>
            <span style={{ cursor: "pointer" }}>🔍</span>
            <span style={{ cursor: "pointer" }}>🔔</span>
            <span style={{ cursor: "pointer" }}>⚙️</span>
            <span style={{ cursor: "pointer" }}>👤</span>
          </div>
        </div>

        {/* ЗАГОЛОВОК СТРАНИЦЫ */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            margin: "0 0 8px 0",
          }}
        >
          Coach Inbox
        </h1>
        
        <p
          style={{
            color: "#94a3b8",
            fontSize: "16px",
            margin: "0 0 20px 0",
          }}
        >
          Messages sent to your GamePro coach profile.
        </p>

        {/* ТЕГ ПРОФИЛЯ ТРЕНЕРА */}
        <div style={{ marginBottom: "35px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              borderRadius: "20px",
              padding: "6px 16px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            🟢 BlueSquid#214180 🟢
          </span>
        </div>

        {/* СПИСОК СООБЩЕНИЙ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {!loading && !error && messages.length === 0 && (
            <p style={{ color: "#64748b" }}>У вас пока нет сообщений.</p>
          )}
            {!loading &&
            !error &&
            messages.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "30px 26px",
                  background: "#17233d",
                  border: "2px solid #477fe0",
                  borderRadius: "28px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}
              >
                {/* ДАТА ОТПРАВКИ */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      color: "#aab5d0",
                      fontSize: "15px",
                    }}
                  >
                    {new Date(item.created_at).toLocaleString("ru-RU")}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* КРУГЛАЯ АВАТАРКА */}
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      minWidth: "100px",
                      borderRadius: "50%",
                      background: "#202d48",
                      border: "2px solid #34425d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aab5d0",
                      fontSize: "25px",
                      fontWeight: 700,
                    }}
                  >
                    P{item.sender_id}
                  </div>

                  {/* КОНТЕНТ */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "clamp(24px, 4vw, 42px)",
                        fontWeight: 800,
                        color: "#ffffff",
                        overflowWrap: "anywhere",
                        lineHeight: 1.2,
                        marginBottom: "16px",
                      }}
                    >
                      {item.message}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: "#aab5d0",
                          fontSize: "16px",
                        }}
                      >
                        Player ID: {item.sender_id}
                      </span>

                      <span
                        style={{
                          padding: "6px 16px",
                          border: `2px solid ${item.is_read ? "#20c978" : "#f5a623"}`,
                          borderRadius: "30px",
                          color: item.is_read ? "#20c978" : "#f5a623",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {item.is_read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </main>
  );
}
