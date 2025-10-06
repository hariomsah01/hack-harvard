# GeoBeats

**“Where geography meets melody — discover how every country’s music tells its own story.”**

GeoBeats is a web app that lets you click on a world map and instantly explore a region’s musical heritage, genres, instruments, and famous artists through rich, narrative content. It bridges global culture, AI, and music in one interactive experience.

---

## 🚀 Live Demo & Code

- **Project Page / Demo**: https://devpost.com/software/geobeats-nq8y1k  
- **GitHub Repo**: (add your repo URL here)  
- **Deployment**: Vercel (client + serverless API functions)  

---

## 🧩 Features

- Click anywhere on the map to explore a region’s musical identity  
- AI-generated narrative overview (history, influences, artists)  
- Display of *Popular Genres*, *Traditional Instruments*, and *Famous Artists*  
- Designed for storytelling, not just lists — it’s a musical travelogue  
- Modular backend routes for expandability (suggestion, preview, etc.)

---

## 🛠 Tech Stack

| Layer        | Technologies & APIs |
|---------------|---------------------|
| Frontend      | React 18, React-Leaflet, Leaflet |
| Backend       | Vercel Serverless Functions (Node.js) |
| AI            | Anthropic Claude via API |
| Geocoding     | Nominatim (OpenStreetMap) reverse geocoding |
| Music Metadata| (Optional / legacy) Last.fm / Apple iTunes APIs |
| Dev Tools     | dotenv, fetch, proxying for dev, caching, error handling |

---

## 🧭 Architecture & Flow

1. **User clicks on map** → front end gets latitude/longitude  
2. **Reverse geocode** using Nominatim → determines region (state, country)  
3. **Call `/api/geo-music`** serverless function with coords + region  
4. **Prompt Claude** to generate a narrative overview with sections:
   - 🎵 CULTURAL CONTEXT  
   - POPULAR GENRES  
   - TRADITIONAL INSTRUMENTS  
   - FAMOUS ARTISTS  
5. **Return the generated prose** (Markdown-style) to frontend  
6. **Frontend renders** the content visually (with styles, chips, cards)  

This design allows the narrative to evolve: you can later add filters by decade, mood, or user contributions without rearchitecting the base.
Built at Hack_Harvard
---

## 🧪 Local Development

```bash
# 1. Clone repo
git clone <your-repo-url>
cd geobeats

# 2. Setup environment variables
# In a `.env.local` (for front end) and `.env` (for API):
REACT_APP_API_BASE=""     # so client calls same origin /api
ANTHROPIC_API_KEY=sk-…
ANTHROPIC_MODEL= (optional)
LASTFM_KEY= (optional)

# 3. Install dependencies
cd app
npm install
cd ..

# 4. Run development server with Vercel emulation
npm i -g vercel
vercel dev
