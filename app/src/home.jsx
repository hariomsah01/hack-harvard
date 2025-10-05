import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Reusable tiny helpers
  const stripFade = (pos) => ({
    position: "absolute",
    left: 0,
    right: 0,
    [pos]: 0,
    height: 56,
    background:
      pos === "top"
        ? "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))"
        : "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
    pointerEvents: "none",
    zIndex: 2,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: "#0e0e12",
      }}
    >
      {/* ===== Header ===== */}
      <header
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px dashed #9b5cff",
              color: "#7c3aed",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            ♫
          </span>
        <Link
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 28,
              color: "#0e0e12",
            }}
          >
            <span style={{ color: "#7c3aed" }}>Geo</span>BEATs
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#0e0e12" }}>
            Home
          </Link>
          <Link
            to="/discover"
            style={{ textDecoration: "none", color: "#0e0e12" }}
          >
            Explore
          </Link>
          <a href="#features" style={{ textDecoration: "none", color: "#0e0e12" }}>
            Play
          </a>
        </nav>
      </header>

      {/* ===== Hero ===== */}
      <section
        style={{
          position: "relative",
          textAlign: "center",
          padding: "6px 24px 0",
          overflow: "hidden",
        }}
      >
        {/* soft wave glows behind headline */}
        <div
          style={{
            position: "absolute",
            left: "-2%",
            top: 148,
            width: "36%",
            height: 120,
            background:
              "radial-gradient(ellipse at center, rgba(155,92,255,0.22), rgba(155,92,255,0) 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-2%",
            top: 170,
            width: "36%",
            height: 120,
            background:
              "radial-gradient(ellipse at center, rgba(155,92,255,0.22), rgba(155,92,255,0) 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: -0.02,
            margin: "0 auto 16px",
            maxWidth: 1200,
          }}
        >
          Spin the Globe, Find a New{" "}
          <span
            style={{
              background: "linear-gradient(180deg, #7c3aed 0%, #9b5cff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sound
          </span>
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: 16,
            maxWidth: 760,
            margin: "0 auto 26px",
          }}
        >
          Every place has a story to tell through music. Pick a country, press
          play, and start your journey.
        </p>

        {/* Ultra-reliable interactive CTA (no overlays, fully clickable) */}
        <button
          onClick={() => navigate("/discover")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 0 4px rgba(124,58,237,.25), 0 18px 40px rgba(109,40,217,.38)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 18px 40px rgba(109,40,217,.38)")
          }
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 52px",
            background: "linear-gradient(180deg, #6d28d9, #8b5cf6)",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            fontWeight: 800,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 18px 40px rgba(109,40,217,.38)",
            transform: "translateY(0) scale(1)",
            transition:
              "transform 160ms cubic-bezier(.2,.8,.2,1), box-shadow 160ms ease",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 26,
              height: 26,
              borderRadius: "999px",
              background: "#ffffff22",
              fontSize: 14,
            }}
          >
            ▶
          </span>
          Discover More
          {/* cursor-follow glow (purely decorative, no pointer trap) */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: -2,
              borderRadius: 9999,
              background:
                "radial-gradient(120px 120px at 50% 50%, rgba(255,255,255,.35), rgba(255,255,255,0))",
              pointerEvents: "none",
              mixBlendMode: "soft-light",
              filter: "blur(6px)",
            }}
          />
        </button>
      </section>

      {/* ===== Photo strip ===== */}
      <section
        style={{
          position: "relative",
          marginTop: 28,
          paddingBottom: 40,
          overflow: "hidden",
        }}
      >
        <div style={stripFade("top")} />
        <div style={stripFade("bottom")} />

        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 16px",
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}
        >
          {[
            "/images/img1.png",
            "/images/img2.png",
            "/images/img3.png",
            "/images/img4.png",
            "/images/img5.png",
          ].map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Music Culture ${i + 1}`}
              style={{
                width: "100%",
                height: 360,
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
                boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== Info / Features ===== */}
      <section
        id="features"
        style={{
          textAlign: "center",
          marginTop: 72,
          padding: "60px 20px",
          background: "linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)",
        }}
      >
        <h2
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 16,
            color: "#1a1a1a",
          }}
        >
          What is GeoBEATs?
        </h2>
        <p
          style={{
            maxWidth: 760,
            margin: "0 auto 40px",
            color: "#555",
            fontSize: 17,
            lineHeight: 1.6,
          }}
        >
          GeoBEATs is a global music discovery platform that lets you explore
          cultures through sound. Spin the globe, pick a place, and press play —
          we’ll cue up authentic, local music and the stories behind it.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {[
            {
              title: "🌍 Explore by Location",
              desc: "Click on any country and instantly hear what’s popular or traditional there.",
            },
            {
              title: "🎧 Smart Curation",
              desc: "AI-assisted picks surface culturally-relevant tracks and hidden gems.",
            },
            {
              title: "📚 Learn the Story",
              desc: "Each selection includes context — instruments, genres, and local history.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "28px 20px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  color: "#7c3aed",
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Contact + Footer ===== */}
      <footer
        style={{
          textAlign: "center",
          padding: "40px 20px 64px",
          color: "#666",
          fontSize: 15,
        }}
      >
        <h3 style={{ fontWeight: 800, fontSize: 20, color: "#1a1a1a" }}>
          Contact Us
        </h3>
        <p style={{ margin: "8px 0 20px" }}>
          Questions or ideas? Email{" "}
          <a
            href="mailto:hello@geobeats.app"
            style={{ color: "#7c3aed", textDecoration: "none" }}
          >
            hello@geobeats.app
          </a>
        </p>

        <p style={{ fontSize: 14 }}>
          Made at <strong>Hack Harvard</strong> with 💜
        </p>
      </footer>
    </main>
  );
}
