// server/server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

/**
 * ENV you need in server/.env
 *  - ANTHROPIC_API_KEY=sk-ant-...
 *  - LASTFM_KEY=your_lastfm_key
 *  - (optional) ANTHROPIC_MODEL=<one of /v1/models ids>
 *  - (optional) PORT=5174
 */

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const LASTFM_KEY = process.env.LASTFM_KEY;
const PORT = process.env.PORT || 5174;

// Boot logs (helps confirm .env is loaded)
console.log("GeoMusic server starting…");
console.log("Using model from .env:", process.env.ANTHROPIC_MODEL || "(auto-pick at runtime)");
console.log("Anthropic key loaded:", ANTHROPIC_API_KEY ? "yes" : "NO!");
console.log("Last.fm key loaded:", LASTFM_KEY ? "yes" : "NO!");

// ----------------------------- Utilities ------------------------------

function stripJsonFences(s = "") {
  // Remove ```json ... ``` if model wrapped response
  return s.trim().replace(/^```json\s*|\s*```$/g, "");
}

function fail(res, code, msg, detail) {
  res.status(code).json({ error: msg, detail });
}

// Pick a valid model for this key if ANTHROPIC_MODEL is not set
async function pickAvailableModel() {
  const r = await fetch("https://api.anthropic.com/v1/models", {
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Failed to list models: ${r.status} ${r.statusText} ${t}`);
  }
  const data = await r.json();
  const ids = (data?.data || []).map((m) => m.id);

  // Preference order (newest/strongest first, then cheaper fallbacks)
  const prefs = [
    /^claude-sonnet-4\.5-/,
    /^claude-3-7-sonnet-/,
    /^claude-sonnet-4-/,
    /^claude-3\.5-haiku-/,
    /^claude-3-haiku-/,
  ];
  for (const re of prefs) {
    const hit = ids.find((id) => re.test(id));
    if (hit) return hit;
  }
  if (ids[0]) return ids[0];
  throw new Error("No Anthropic models available to this workspace");
}

async function claudeSuggest({ state, country, lat, lng, limit }) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY in server/.env");
  }

  const model = process.env.ANTHROPIC_MODEL || (await pickAvailableModel());
  if (!process.env.ANTHROPIC_MODEL) {
    console.log("Auto-picked Anthropic model:", model);
  }

  const prompt = `
You are a music expert. Given a location, suggest ${limit} culturally relevant songs
(popular or influential) associated with that place (mix of local-language classics and modern hits).
Return STRICT JSON ONLY, matching exactly:

{
  "songs": [
    {"title": "string", "artist": "string", "reason": "short cultural/context note"}
  ]
}

Location:
- State: ${state || "N/A"}
- Country: ${country || "N/A"}
- Lat/Lng: ${lat}, ${lng}
`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      temperature: 0.6,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    console.error("Anthropic error", resp.status, resp.statusText, body);
    throw new Error(`Anthropic ${resp.status} ${resp.statusText}: ${body}`);
  }

  const data = await resp.json();
  const raw = data?.content?.[0]?.text ?? "{}";
  let parsed;
  try {
    parsed = JSON.parse(stripJsonFences(raw));
  } catch {
    console.error("Claude returned non-JSON output:", raw);
    throw new Error("Claude returned non-JSON output");
  }

  const songs = (parsed?.songs || [])
    .filter((s) => s?.title && s?.artist)
    .map((s) => ({
      title: s.title.trim(),
      artist: s.artist.trim(),
      reason: s.reason || "",
    }));

  return songs;
}

// ------------------------------- Routes --------------------------------

// For debugging your workspace models quickly
app.get("/api/models", async (_req, res) => {
  try {
    const r = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    const data = await r.json();
    res.status(r.ok ? 200 : 500).json(data);
  } catch (e) {
    fail(res, 500, "Models fetch failed", String(e));
  }
});

// 1) Ask Claude for culturally relevant songs for a place
app.post("/api/suggest", async (req, res) => {
  try {
    const { state, country, lat, lng, limit = 15 } = req.body || {};
    const songs = await claudeSuggest({ state, country, lat, lng, limit });
    res.json({ songs });
  } catch (e) {
    console.error("Suggest endpoint error:", e);
    fail(res, 500, "Claude suggest failed", String(e.message || e));
  }
});

// 2) Resolve each suggestion on Last.fm (canonical URL/artwork)
app.post("/api/resolve-lastfm", async (req, res) => {
  try {
    if (!LASTFM_KEY) {
      return fail(res, 500, "Missing LASTFM_KEY in server/.env");
    }
    const { items = [], limit = 1 } = req.body || {};
    const out = [];

    for (const it of items) {
      const q = encodeURIComponent(`${it.title} ${it.artist}`);
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${q}&api_key=${LASTFM_KEY}&format=json&limit=${limit}`;
      try {
        const r = await fetch(url);
        const d = await r.json();
        const hit = d?.results?.trackmatches?.track?.[0];
        out.push({
          title: it.title,
          artist: it.artist,
          reason: it.reason || "",
          lastfmUrl: hit?.url || null,
          mbid: hit?.mbid || null,
          image: hit?.image?.pop()?.["#text"] || null,
        });
      } catch {
        out.push({
          title: it.title,
          artist: it.artist,
          reason: it.reason || "",
          lastfmUrl: null,
          mbid: null,
          image: null,
        });
      }
    }

    res.json(out);
  } catch (e) {
    console.error("Resolve endpoint error:", e);
    fail(res, 500, "Last.fm resolve failed", String(e.message || e));
  }
});

// -----------------------------------------------------------------------

app.listen(PORT, () =>
  console.log(`GeoMusic server running on http://localhost:${PORT}`)
);
