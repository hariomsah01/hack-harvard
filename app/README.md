# GeoMusic — Claude + Last.fm + iTunes

Click on the map → Claude (Anthropic) suggests culturally relevant songs → we resolve each on Last.fm → add iTunes 30s previews → play.

## Prereqs
- Node 18+
- Anthropic API key
- Last.fm API key

## Quick start

### 1) Backend (server)
```
cd server
npm install
cp .env.example .env
# edit .env and set your keys:
# ANTHROPIC_API_KEY=sk-ant-...
# LASTFM_KEY=your_lastfm_key
npm start
```
The server runs on http://localhost:5174

### 2) Frontend (React app)
```
cd app
npm install
npm start
```

Open http://localhost:3000 and click anywhere on the map.
