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
| Frontend      | React 18, React‑Leaflet, Leaflet |
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
5. **Return the generated prose** (Markdown‑style) to frontend  
6. **Frontend renders** the content visually (with styles, chips, cards)  

This design allows the narrative to evolve: you can later add filters by decade, mood, or user contributions without rearchitecting the base.

---

## 🧪 Local Development

```bash
# 1. Clone repo
git clone <your‑repo-url>
cd geobeats

# 2. Setup environment variables
# In a `.env.local` (for front end) and `.env` (for API):
REACT_APP_API_BASE=""     # so client calls same origin /api
ANTHROPIC_API_KEY=sk‑…
ANTHROPIC_MODEL= (optional)
LASTFM_KEY= (optional)

# 3. Install dependencies
cd app
npm install
cd ..

# 4. Run development server with Vercel emulation
npm i -g vercel
vercel dev
```

This will run both the React front end and your `/api` functions locally at `http://localhost:3000`.

---

## ✅ Deployment (Vercel)

1. Push the repository to GitHub/GitLab/Bitbucket  
2. On Vercel, **Import Project** → select your repo  
3. Configure:
   - Framework: **Create React App**  
   - Build command: `npm run build`  
   - Output directory: `build`  
   - API routes: functions under `/api`  
4. Add **Environment Variables** in Vercel settings:
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_MODEL` (optional)
   - `LASTFM_KEY` (optional)
5. Click **Deploy**  
6. Visit your site (e.g. `https://geobeats.vercel.app`)

Frontend and serverless API endpoints (e.g. `/api/geo-music`) will live under the same domain.

---

## 🚧 Challenges & Lessons Learned

- Mapping lat/lng to the correct musical dataset, especially for border regions  
- Handling API rate limits and incomplete data gracefully  
- Balancing AI generative content with factual reliability  
- Team coordination: merging design & code under tight deadlines  

---

## 🔮 Future Roadmap

- **Decade filters** — explore how a region’s music changed by year  
- **Mood / genre filters** — e.g. “party”, “folk”, “hip-hop” across regions  
- **User contributions** — let users share local tracks or stories  
- **Audio playback** — embed previews via Spotify / iTunes  
- **Localization** — generate content in multiple languages  

---

## 🎉 Acknowledgments

Built for **HackHarvard 2025: Compile the Decade**  
Team: Hari Om Sah, Yinson Tso, Armish Sheikh, Gbolahan Azeem  
Inspired by the idea that *music is the thread weaving cultures together*

---

## 📜 License & Credit

(Choose your license)  
Credit to Anthropic for Claude, OpenStreetMap for geocoding, React ecosystem, and all API providers used.
