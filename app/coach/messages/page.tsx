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

{/* MESSAGES */}
        {!loading &&
          !error &&
          messages.map((item) => (
            <article
              key={item.id}
              style={{
                padding: "30px 26px",
                marginBottom: 22,
                background: "#17233d",
                border: "2px solid #477fe0",
                borderRadius: 28,
                boxShadow: "0 8px 25px #00000020",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    color: "#aab5d0",
                    fontSize: 15,
                  }}
                >
                  {new Date(item.created_at).toLocaleString("ru-RU")}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  flexWrap: "wrap",
                }}
              >
                {/* PLAYER AVATAR */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    minWidth: 100,
                    borderRadius: "50%",
                    background: "#202d48",
                    border: "2px solid #34425d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aab5d0",
                    fontSize: 25,
                  }}
                >
                  P{item.sender_id}
                </div>

                {/* MESSAGE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "clamp(25px, 5vw, 48px)",
                      fontWeight: 800,
                      overflowWrap: "anywhere",
                      lineHeight: 1.2,
                      marginBottom: 20,
                    }}
                  >
                    {item.message}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "#aab5d0",
                        fontSize: 17,
                      }}
                    >
                      Player ID: {item.sender_id}
                    </span>

                    <span
                      style={{
                        padding: "7px 15px",
                        border: 2px solid ${
                          item.is_read ? "#20c978" : "#f5a623"
                        },
                        borderRadius: 30,
                        color: item.is_read ? "#20c978" : "#f5a623",
                        fontWeight: 700,
                        fontSize: 15,
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
    </main>
  );
