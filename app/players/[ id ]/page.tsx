<small
              style={{
                display: "block",
                color: "#9da6c0",
                marginTop: 6,
              }}
            >
              Source
            </small>
          </div>
        </div>

        <div
          style={{
            marginTop: 25,
            padding: 18,
            background: "#0a1021",
            borderRadius: 14,
            border: "1px solid #1c8f82",
          }}
        >
          <div
            style={{
              color: "#9da6c0",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            GamePro Verification
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            {verified
              ? "✓ Профиль подтверждён GamePro"
              : "DATA FOUND · NOT VERIFIED"}
          </div>

          <div
            style={{
              color: "#65708d",
              fontSize: 11,
              marginTop: 8,
            }}
          >
            Verification ID: {player.id}
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            textAlign: "center",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px 22px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#18e0d1,#12bfb6)",
              color: "#021312",
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            ← Вернуться в GamePro
          </a>
        </div>
      </div>
    </div>
  );
}
