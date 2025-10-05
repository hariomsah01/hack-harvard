import React from "react";
import { useNavigate, Link } from "react-router-dom";

/* ===================== Emotion Engine (Voice + Emoji) ===================== */

// Pick an emotional roast voice and speak with tone
// --- EMOTIONAL FEMALE VOICE (no emoji/symbol speech)
// ---- Voice: deep female, words-only (no emoji or punctuation)
let __voices = [];
function loadVoices(cb){const s=window.speechSynthesis;if(!s) return cb?.([]);const go=()=>{const v=s.getVoices()||[];if(v.length){__voices=v;cb?.(v);}else setTimeout(go,150)};if(s.onvoiceschanged!==undefined){s.onvoiceschanged=()=>{__voices=s.getVoices()||[];cb?.(__voices)};}go();}
loadVoices();

function pickFemaleVoice(){
  const prefs=[/Google US English Female/i,/Google UK English Female/i,/Samantha/i,/Zira/i,/Jenny/i,/Microsoft .* (Zira|Jenny)/i];
  for(const re of prefs){const hit=__voices.find(v=>re.test(v.name));if(hit) return hit;}
  const any=__voices.find(v=>/female/i.test(v.name+v.voiceURI));
  return any||__voices[0]||null;
}

function say(text){
  try{
    const synth=window.speechSynthesis; if(!synth) return;
    // keep only letters/numbers/space (unicode-safe)
    const clean=String(text).normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
    if(!clean) return;
    synth.cancel();
    const u=new SpeechSynthesisUtterance(clean);
    const v=pickFemaleVoice(); if(v) u.voice=v;
    u.lang="en-US"; u.pitch=0.8; u.rate=0.9; u.volume=1;
    synth.speak(u);
  }catch{}
}






// lightweight emoji burst (no libs)
function burstEmojis(container, emojis = ["🎶", "🔥", "💫", "🌍", "😂"]) {
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const el = document.createElement("div");
    el.textContent = emojis[i % emojis.length];
    Object.assign(el.style, {
      position: "absolute",
      left: `${50 + (Math.random() * 40 - 20)}%`,
      top: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: `${16 + Math.random() * 18}px`,
      opacity: "0.9",
      transition: "transform 900ms ease, opacity 900ms ease",
      pointerEvents: "none",
    });
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -${120 + Math.random() * 100}px)`;
      el.style.opacity = "0";
    });
    setTimeout(() => container.removeChild(el), 1000);
  }
}

// simple, dynamic roast generator (no hardcoded list)


/* =========================== Roast Quest Modal =========================== */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5174";

/* =========================== AI Quiz Roast Modal =========================== */


// function QuizRoastModal({ open, onClose, navigate }) {
//   const [stage, setStage] = React.useState("intro"); // intro | loading | question | result
//   const [question, setQuestion] = React.useState(null); // {question, choices[4], correctIndex}
//   const [count, setCount] = React.useState(5);
//   const [verdict, setVerdict] = React.useState("");
//   const [roast, setRoast] = React.useState("");
//   const containerRef = React.useRef(null);

//   React.useEffect(() => {
//     if (!open) {
//       setStage("intro"); setQuestion(null); setCount(5); setVerdict(""); setRoast("");
//     }
//   }, [open]);

//   React.useEffect(() => {
//     if (stage !== "question") return;
//     setCount(5);
//     const t = setInterval(() => {
//       setCount((c) => {
//         if (c <= 1) { clearInterval(t); submitAnswer(-1); }
//         return c - 1;
//       });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [stage]);

//   async function fetchQuestion() {
//     try{
//       setStage("loading");
//       const r = await fetch(`${API_BASE}/api/quiz-next`, { method:"POST" });
//       if(!r.ok) return; // silent (no fallback)
//       const data = await r.json().catch(()=>null);
//       if(!data || typeof data.question!=="string" || !Array.isArray(data.choices) || typeof data.correctIndex!=="number") return;
//       setQuestion(data);
//       setStage("question");
//     }catch{}
//   }

//   async function submitAnswer(userIndex){
//     if(!question) return;
//     setStage("result");
//     try{
//       const r = await fetch(`${API_BASE}/api/quiz-roast`, {
//         method:"POST",
//         headers:{ "content-type":"application/json" },
//         body: JSON.stringify({
//           question: question.question,
//           choices: question.choices,
//           correctIndex: question.correctIndex,
//           userIndex
//         })
//       });
//       if(!r.ok) return; // silent
//       const data = await r.json().catch(()=>null);
//       if(!data || typeof data.roast!=="string" || !data.verdict) return;
//       setVerdict(data.verdict);
//       setRoast(data.roast.trim());
//       say(data.roast);
//     }catch{}
//   }

//   if(!open) return null;

//   return (
//     <div
//       ref={containerRef}
//       onClick={(e)=>e.target===e.currentTarget && onClose()}
//       style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",display:"grid",placeItems:"center",zIndex:999}}
//     >
//       <div style={{width:"min(760px,92vw)",background:"#0f0f14",color:"#fff",borderRadius:20,boxShadow:"0 30px 80px rgba(0,0,0,.5)",padding:22,border:"1px solid rgba(124,58,237,.35)",position:"relative",overflow:"hidden"}}>
//         <div style={{position:"absolute",inset:"-40% -20% auto -20%",height:160,background:"radial-gradient(ellipse at center, rgba(124,58,237,.35), rgba(124,58,237,0) 65%)",filter:"blur(18px)"}} />
//         <div style={{display:"flex",alignItems:"center",gap:10}}>
//           <span style={{fontSize:20}}>🎧</span><strong>DJ Claude’s Quiz Roast</strong>
//         </div>

//         {stage==="intro" && (
//           <div style={{marginTop:18}}>
//             <p style={{opacity:.9}}>AI writes the question. You answer. Claude roasts.</p>
//             <button onClick={fetchQuestion} style={ctaStyle}>Start quiz</button>
//           </div>
//         )}

//         {stage==="loading" && (
//           <div style={{marginTop:18,opacity:.8}}>Cooking up a question…</div>
//         )}

//         {stage==="question" && question && (
//           <div style={{marginTop:18}}>
//             <div style={{marginBottom:10,color:"#a78bfa",fontWeight:700}}>Time: {count}s</div>
//             <h3 style={{margin:"0 0 12px 0"}}>{question.question}</h3>
//             <div style={{display:"grid",gap:10}}>
//               {question.choices.map((c,i)=>(
//                 <button key={i} onClick={()=>submitAnswer(i)} style={{textAlign:"left",borderRadius:12,border:"1px solid #2b2b36",background:"#171721",color:"#fff",padding:"12px 14px",cursor:"pointer"}}>
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {stage==="result" && (
//           <div style={{marginTop:18}}>
//             {verdict && (
//               <div style={{
//                 display:"inline-block",padding:"6px 10px",borderRadius:999,fontSize:12,marginBottom:8,
//                 background: verdict==="correct" ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)",
//                 border: verdict==="correct" ? "1px solid rgba(16,185,129,.35)" : "1px solid rgba(239,68,68,.35)",
//                 color: verdict==="correct" ? "#10b981" : "#ef4444"
//               }}>
//                 {verdict==="correct" ? "Correct" : "Wrong"}
//               </div>
//             )}
//             <p style={{whiteSpace:"pre-wrap",lineHeight:1.6}}>{roast}</p>
//             <div style={{marginTop:14,display:"flex",gap:10,flexWrap:"wrap"}}>
//               <button onClick={fetchQuestion} style={ctaStyle}>Another question</button>
//               <button onClick={()=>navigate("/discover")} style={ghostBtn}>Close</button>
//             </div>
//           </div>
//         )}

//         <button onClick={onClose} aria-label="close" style={{position:"absolute",right:10,top:10,background:"transparent",border:"none",color:"#bbb",fontSize:22,cursor:"pointer"}}>×</button>
//       </div>
//     </div>
//   );
// }

function RoastQuestModal({ open, onClose, navigate }) {
  const [stage, setStage] = React.useState("intro"); // intro | challenge | roast
  const [input, setInput] = React.useState("");
  const [roast, setRoast] = React.useState("");
  const [count, setCount] = React.useState(3);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setStage("intro");
      setInput("");
      setRoast("");
      setCount(3);
    }
  }, [open]);

  React.useEffect(() => {
    if (stage !== "challenge") return;
    setCount(5);
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          submit();
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // CRA/Webpack env var (not Vite). Create .env (see below).


  async function submit() {
  setStage("roast");
  try {
    const r = await fetch(`${API_BASE}/api/roast-quest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userInput: input  // no challenge text; Claude decides everything
      }),
    });

    if (!r.ok) return;
    const data = await r.json().catch(() => null);
    if (!data || !data.ok || typeof data.roast !== "string") return;

    const line = data.roast.trim();
    if (!line) return;          // <-- was backwards in your screenshot

    setRoast(line);
    say(line);                   // speaks words only (see say() below)
    burstEmojis(containerRef.current);
  } catch {
    // silent: no fallback by your request
  }
}





  if (!open) return null;

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "min(680px, 92vw)",
          background: "#0f0f14",
          color: "white",
          borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          padding: 22,
          border: "1px solid rgba(124,58,237,0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* neon top bar */}
        <div
          style={{
            position: "absolute",
            inset: "-40% -20% auto -20%",
            height: 160,
            background:
              "radial-gradient(ellipse at center, rgba(124,58,237,.35), rgba(124,58,237,0) 65%)",
            filter: "blur(18px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎧</span>
          <strong>DJ Claude’s Roast Quest</strong>
        </div>

        {/* emotion bubble */}
        <div
          id="emotion-bubble"
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            fontSize: 30,
            opacity: 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        >
          💀
        </div>

        {stage === "intro" && (
          <div style={{ marginTop: 16 }}>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Welcome, traveler. I’m DJ Claude — part time music curator,  full-time roastmaster.
              Ready to be judged by an AI with rhythm?
            </p>
            <button onClick={() => setStage("challenge")} style={ctaStyle}>
              Let’s Play
            </button>
          </div>
        )}

        {stage === "challenge" && (
          <div style={{ marginTop: 16 }}>
            <p style={{ opacity: 0.9 }}>
              <strong>Quick!</strong> Type a country or a genre you secretly love.
              You’ve got <span style={{ color: "#a78bfa" }}>{count}</span>…
            </p>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g., Brazil or Lo-fi"
              style={{
                width: "100%",
                marginTop: 10,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #2b2b36",
                background: "#171721",
                color: "white",
                outline: "none",
              }}
            />
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button onClick={submit} style={ctaStyle}>
                Lock it in
              </button>
              <button onClick={onClose} style={ghostBtn}>
                Nah, I’m scared
              </button>
            </div>
          </div>
        )}

        {stage === "roast" && (
          <div style={{ marginTop: 16 }}>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{roast}</p>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button onClick={() => navigate("/discover")} style={ctaStyle}>
                Ok I’ll press Play ▶
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setRoast("");
                  setStage("challenge");
                }}
                style={ghostBtn}
              >
                Roast me again
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="close"
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            background: "transparent",
            border: "none",
            color: "#bbb",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

const ctaStyle = {
  marginTop: 14,
  padding: "12px 18px",
  borderRadius: 9999,
  border: "none",
  background: "linear-gradient(180deg, #6d28d9, #8b5cf6)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 28px rgba(109,40,217,.35)",
};

const ghostBtn = {
  marginTop: 14,
  padding: "12px 18px",
  borderRadius: 9999,
  border: "1px solid #2b2b36",
  background: "transparent",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

/* =============================== Home UI =============================== */

export default function Home() {
  const navigate = useNavigate();
  const [questOpen, setQuestOpen] = React.useState(false);

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
          
          <Link
            to="/explore"
            style={{ textDecoration: "none", color: "#0e0e12" }}
          >
            Explore
          </Link>

          {/* Play opens Roast Quest */}
          <button
  onClick={() => setQuestOpen(true)}
  style={{
    background: "transparent",
    border: "none",
    color: "#0e0e12",
    cursor: "pointer",
    fontSize: 16,
    padding: 0,
  }}
>
  Play
</button>


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
        {/* soft wave glows */}
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

        {/* CTA */}
        <button
          onClick={() => navigate("/discover")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform =
              "translateY(-2px) scale(1.02)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0) scale(1)")
          }
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

      {/* Mount the modal */}
      <RoastQuestModal
        open={questOpen}
        onClose={() => setQuestOpen(false)}
        navigate={navigate}
      />
    </main>
  );
}
