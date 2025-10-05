import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5174";

/* Simple Leaflet pin (no local assets) */
const pin = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -34],
  shadowSize: [41, 41],
});

/** Little chips for genres/instruments */
const Chip = ({ children }) => (
  <span
    style={{
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      background: "#f2ecff",
      color: "#6d28d9",
      fontSize: 12,
      fontWeight: 700,
      margin: "4px 6px 0 0",
      border: "1px solid #e8dbff",
    }}
  >
    {children}
  </span>
);

/** Click catcher for map */
function ClickCapture({ onPick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onPick({ lat, lng });
    },
  });
  return null;
}

export default function Explore() {
  const [picked, setPicked] = React.useState(null);   // {lat,lng}
  const [place, setPlace] = React.useState(null);     // {state,country,displayName}
  const [data, setData] = React.useState("");       // AI payload
  const [loading, setLoading] = React.useState(false);
  

  // When a map point is picked, reverse geocode and then ask your AI backend
  React.useEffect(() => {
    if (!picked) return;

    (async () => {
      setLoading(true);
      setData(null);

      // 1) Reverse geocode (state + country only)
      let display = null;
      try {
        const url = new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("lat", picked.lat);
        url.searchParams.set("lon", picked.lng);
        url.searchParams.set("zoom", "10");
        url.searchParams.set("addressdetails", "1");

        const r = await fetch(url, { headers: { "accept-language": "en" } });
        const j = await r.json();
        const a = j?.address || {};
        const state = a.state || null;
        const country = a.country || null;

        display = {
          state,
          country,
          displayName: `${state ? `${state}, ` : ""}${country || ""}`,
        };
        setPlace(display);
      } catch {
        setPlace(null);
      }

      // 2) Ask your AI server to generate music culture info
      try {
        const r = await fetch(`${API_BASE}/api/geo-music`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            coords: picked,
            place: display, // {state,country,displayName}
          }),
        });

        if (!r.ok) {
          setLoading(false);
          return;
        }
        const j = await r.json().catch(() => null);
        if (!j?.ok) {
          setLoading(false);
          return;
        }
        setData(j);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, [picked]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px,1fr) 420px",
        gap: 16,
        minHeight: "calc(100vh - 80px)",
        padding: 12,
      }}
    >
      {/* Map side */}
      <div style={{ position: "relative" }}>
        {/* Info card (top-right over the map) */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1000,
            background: "#fff",
            borderRadius: 16,
            padding: "14px 16px",
            boxShadow: "0 12px 24px rgba(0,0,0,.12)",
            border: "1px solid #eee",
            maxWidth: 340,
          }}
        >
          <div style={{ fontWeight: 900, color: "#6d28d9" }}>
            Discover World Music
          </div>
          <div style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
            Click anywhere on the map to explore the rich musical heritage and
            culture of that region.
          </div>
        </div>

        <MapContainer
          center={[20, 0]}
          zoom={3}
          style={{ width: "100%", height: "calc(100vh - 88px)", borderRadius: 12 }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onPick={setPicked} />
          {picked && <Marker position={[picked.lat, picked.lng]} icon={pin} />}
        </MapContainer>
      </div>

      {/* Right panel */}
      <aside
        style={{
          background: "#0f0f14",
          color: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(124,58,237,.35)",
          boxShadow: "0 30px 80px rgba(0,0,0,.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 88px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 16,
            background: "linear-gradient(180deg, #6d28d9 0%, rgba(13,13,20,0) 120%)",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            {place?.state || place?.country || "Pick a place"}
          </div>
          <div style={{ opacity: 0.85, fontSize: 13 }}>
            {place?.country || ""}
          </div>
        </div>

        {/* Body — OVERVIEW ONLY */}
        <div style={{ padding: 16, overflow: "auto", flex: 1 }}>
          {!picked && (
            <div style={{ color: "#9aa0a6", fontSize: 14 }}>
              Click on the map to get started.
            </div>
          )}

          {picked && loading && (
            <div style={{ color: "#a78bfa" }}>Gathering vibes…</div>
          )}

          {picked && !loading && data && (
            <>
              {data.summary && (
                <>
                  <div
                    style={{
                      fontWeight: 900,
                      letterSpacing: 0.2,
                      opacity: 0.9,
                      marginBottom: 6,
                    }}
                  >
                    🎵 CULTURAL CONTEXT
                  </div>
                  <p style={{ lineHeight: 1.6, opacity: 0.95 }}>{data.summary}</p>
                </>
              )}

              {Array.isArray(data.genres) && data.genres.length > 0 && (
                <>
                  <div style={{ fontWeight: 900, marginTop: 16 }}>POPULAR GENRES</div>
                  <div style={{ marginTop: 6 }}>
                    {data.genres.map((g, i) => (
                      <Chip key={i}>{g}</Chip>
                    ))}
                  </div>
                </>
              )}

              {Array.isArray(data.instruments) && data.instruments.length > 0 && (
                <>
                  <div style={{ fontWeight: 900, marginTop: 16 }}>
                    TRADITIONAL INSTRUMENTS
                  </div>
                  <div style={{ marginTop: 6 }}>
                    {data.instruments.map((ins, i) => (
                      <Chip key={i}>{ins}</Chip>
                    ))}
                  </div>
                </>
              )}

              {Array.isArray(data.artists) && data.artists.length > 0 && (
                <>
                  <div style={{ fontWeight: 900, marginTop: 16 }}>FAMOUS ARTISTS</div>
                  <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
                    {data.artists.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#121220",
                          border: "1px solid #2b2b36",
                          borderRadius: 12,
                          padding: 12,
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>{a.name}</div>
                        {a.genre && (
                          <div style={{ opacity: 0.7, fontSize: 12 }}>{a.genre}</div>
                        )}
                        {a.blurb && (
                          <div style={{ marginTop: 6, opacity: 0.95 }}>{a.blurb}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
