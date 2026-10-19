"use client";

import { useState } from "react";

export default function PublishCoachButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function publishProfile() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/coaches/me", {
        method: "PATCH",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Publication failed");
        return;
      }

      setMessage("Profile published successfully!");
    } catch {
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button
        type="button"
        onClick={publishProfile}
        disabled={loading}
        style={{
          padding: "13px 22px",
          borderRadius: 10,
          border: "none",
          background: "#20c9bd",
          color: "#06101a",
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Publishing..." : "Publish Profile"}
      </button>

      {message && (
        <p style={{ color: "#20c9bd", marginTop: 12 }}>
          {message}
        </p>
      )}
    </div>
  );
}
