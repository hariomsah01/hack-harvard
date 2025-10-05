import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "GeoMusicApp/1.0 (demo@example.com)"
    }
  });
  if (!res.ok) throw new Error("Geocode failed");
  const data = await res.json();
  const addr = data.address || {};
  const countryCode = addr.country_code?.toLowerCase();
  const country = addr.country;
  const state = addr.state || addr.town || addr.village || addr.hamlet || addr.municipality || addr.state_district || addr.state;
  return { country, countryCode, state };
}

const SERVER_URL = "http://localhost:5174";

async function suggestSongsViaClaude({ state, country, lat, lng, limit = 15 }) {
  const resp = await fetch(`${SERVER_URL}/api/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, country, lat, lng, limit })
  });
  if (!resp.ok) throw new Error("Claude suggest failed");
  const data = await resp.json();
  return data.songs || [];
}



async function resolveOnLastFm(items) {
  const resp = await fetch(`${SERVER_URL}/api/resolve-lastfm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });
  if (!resp.ok) throw new Error("Last.fm resolve failed");
  return resp.json();
}

async function addPreviewsViaItunes(tracks, countryCode = "us") {
  const country = (countryCode || "us").toLowerCase();
  const out = [];
  for (const t of tracks) {
    try {
      const term = encodeURIComponent(`${t.title} ${t.artist}`);
      const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1&country=${country}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const match = data?.results?.[0];
        out.push({
          ...t,
          preview: match?.previewUrl || null,
          artwork: match?.artworkUrl100?.replace("100x100", "200x200") || t.image || null,
          itunesUrl: match?.trackViewUrl || null,
        });
      } else {
        out.push(t);
      }
    } catch {
      out.push(t);
    }
  }
  return out;
}

function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick({ lat, lng });
    },
  });
  return null;
}

export default function App() {
  const [picked, setPicked] = useState(null);
  const [place, setPlace] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!picked) return;
      setErr("");
      setLoading(true);
      try {
        const info = await reverseGeocode(picked.lat, picked.lng);
        setPlace(info);

        const suggestions = await suggestSongsViaClaude({
          state: info.state,
          country: info.country,
          lat: picked.lat,
          lng: picked.lng,
          limit: 15,
        });

        const resolved = await resolveOnLastFm(suggestions);
        const withPreviews = await addPreviewsViaItunes(resolved, info.countryCode);
        setTracks(withPreviews);
        //setSource("claude + lastfm + itunes");
      } catch (e) {
        setErr(e.message || "Something went wrong");
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [picked]);

  const center = useMemo(() => (picked ? [picked.lat, picked.lng] : [20, 0]), [picked]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 380px", height: "100vh" }}>
      <div>
        <MapContainer center={center} zoom={picked ? 6 : 2} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onPick={setPicked} />
          {picked && (
            <Marker position={[picked.lat, picked.lng]}>
              <Popup>
                {place?.country ? (
                  <div>
                    <div><b>{place.state || "Unknown state"}</b></div>
                    <div>{place.country} ({place.countryCode?.toUpperCase()})</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{picked.lat.toFixed(4)}, {picked.lng.toFixed(4)}</div>
                  </div>
                ) : (
                  <div>{picked.lat.toFixed(4)}, {picked.lng.toFixed(4)}</div>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <aside style={{ borderLeft: "1px solid #1f2433", overflow: "auto", padding: 12, background: "#11131a", color: "#e6e6ea" }}>
        <h3 style={{ marginTop: 0 }}>Songs for this place</h3>

        {!picked && <p>Click anywhere on the map to pick a location.</p>}

        {place && (
          <div style={{ marginBottom: 8, fontSize: 14 }}>
            <div>State: <b>{place.state || "N/A"}</b></div>
            <div>Country: <b>{place.country}</b> ({place.countryCode?.toUpperCase()})</div>
            {source && <div style={{ opacity: 0.8 }}>Source: {source}</div>}
          </div>
        )}

        {loading && <p>Loading suggestions…</p>}
        {err && <p style={{ color: "#ff7b7b" }}>{err}</p>}

        {tracks.map((t, i) => (
          <div key={`${t.title}-${t.artist}-${i}`} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid #1d2030" }}>
            <div>
              {t.artwork ? (
                <img src={t.artwork} width={64} height={64} alt={t.title} style={{ borderRadius: 8 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 8, background: "#222" }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{t.title}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>{t.artist}</div>
              {t.reason && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{t.reason}</div>}
              <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                {t.preview ? (
                  <audio controls src={t.preview} style={{ width: "100%" }} />
                ) : (
                  <span style={{ fontSize: 12, opacity: 0.8 }}>No preview</span>
                )}
                {t.itunesUrl && (
                  <a href={t.itunesUrl} target="_blank" rel="noreferrer">iTunes</a>
                )}
                {t.lastfmUrl && (
                  <a href={t.lastfmUrl} target="_blank" rel="noreferrer">Last.fm</a>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && picked && place && tracks.length === 0 && !err && (
          <p>No songs available right now.</p>
        )}
      </aside>
    </div>
  );
}
