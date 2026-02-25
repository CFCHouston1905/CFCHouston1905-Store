import { useState, useEffect, useRef } from "react";
import { client, urlFor } from "./sanity.js";

// =====================================================
// BAYOU CITY BLUES / CHELSEA HOUSTON
// Official Merch Store
// =====================================================
// Products are loaded from Sanity CMS.
// Images are served through Sanity's image pipeline
// (auto-resized, cropped, optimized).
// Payments go through Stripe Checkout.
// =====================================================

// ---------- FALLBACK DATA ----------
// Used while Sanity loads, or if CMS isn't set up yet
const FALLBACK_PRODUCTS = [
  { _id: "f1", name: "Chelsea Houston Crest Tee", category: "apparel", price: 32, sizes: ["S","M","L","XL","2XL"], colors: ["Chelsea Blue","White","Navy"], description: "Classic ringspun cotton tee with the Chelsea Houston circle crest. Pre-shrunk, true to size.", featured: true },
  { _id: "f2", name: "KTBFFH Matchday Jersey", category: "apparel", price: 45, sizes: ["S","M","L","XL","2XL"], colors: ["Chelsea Blue","White"], description: "Premium dry-fit jersey with the Bayou City Blues shield on chest and KTBFFH across the back.", featured: true },
  { _id: "f3", name: "Bayou City Blues Hoodie", category: "apparel", price: 55, sizes: ["S","M","L","XL","2XL"], colors: ["Navy","Chelsea Blue"], description: "Heavyweight fleece-lined hoodie with embroidered Bayou City Blues shield.", featured: true },
  { _id: "f4", name: "HOU/LDN 1905 Vintage Tee", category: "apparel", price: 35, sizes: ["S","M","L","XL"], colors: ["Heather Grey","Chelsea Blue"], description: "Distressed vintage print featuring the HOU/LDN 1905 mark." },
  { _id: "f5", name: "Chelsea Houston Snapback", category: "hats", price: 28, sizes: ["One Size"], colors: ["Chelsea Blue","Navy","White"], description: "Structured snapback with 3D embroidered CH monogram.", featured: true },
  { _id: "f6", name: "Matchday Scarf", category: "hats", price: 25, sizes: ["One Size"], colors: ["Chelsea Blue/White"], description: "Double-sided knit scarf. Bayou City Blues on one end, KTBFFH on the other." },
  { _id: "f7", name: "Chelsea Houston Ceramic Mug", category: "drinkware", price: 18, sizes: ["One Size"], colors: ["Chelsea Blue","White"], description: "11oz ceramic mug with Chelsea Houston circle crest." },
  { _id: "f8", name: "Pint Glass", category: "drinkware", price: 16, sizes: ["One Size"], colors: ["Clear"], description: "16oz pint glass with the Bayou City Blues shield." },
  { _id: "f9", name: "Die-Cut Crest Sticker", category: "accessories", price: 5, sizes: ["One Size"], colors: ["Full Color"], description: "3-inch weatherproof vinyl die-cut." },
  { _id: "f10", name: "Sticker Pack (6 designs)", category: "accessories", price: 12, sizes: ["One Size"], colors: ["Full Color"], description: "Six unique designs." },
  { _id: "f11", name: "Carefree in the 713 Banner", category: "banners", price: 65, sizes: ["One Size"], colors: ["Yellow/Blue"], description: "Full-size supporters banner. Chelsea Houston shield, CH monogram, and Carefree in the 713 Since 2011.", featured: true },
  { _id: "f12", name: "Paul Canoville Canners Banner", category: "banners", price: 65, sizes: ["One Size"], colors: ["Chelsea Blue"], description: "Paul Canoville tribute banner. Breaking Down Barriers.", featured: true },
];

const EVENTS = [
  { date: "SAT MAR 1", time: "6:30 AM CT", match: "Chelsea vs Manchester City", venue: "The Phoenix on Westheimer", type: "Premier League", note: "Doors open 6:00 AM. Breakfast tacos provided." },
  { date: "SAT MAR 8", time: "9:00 AM CT", match: "Chelsea vs Wolves", venue: "The Phoenix on Westheimer", type: "Premier League", note: "Wear your gear for 10% off merch." },
  { date: "TUE MAR 11", time: "2:00 PM CT", match: "Chelsea vs Real Madrid", venue: "The Phoenix on Westheimer", type: "Champions League", note: "Big screen. Big match. Be there." },
  { date: "SAT MAR 15", time: "9:00 AM CT", match: "Chelsea vs Aston Villa", venue: "The Phoenix on Westheimer", type: "Premier League", note: null },
];

const SIZE_CHART = {
  headers: ["Size", "Chest", "Length", "Sleeve"],
  rows: [["S",'34-36"','28"','8"'],["M",'38-40"','29"','8.5"'],["L",'42-44"','30"','9"'],["XL",'46-48"','31"','9.5"'],["2XL",'50-52"','32"','10"']],
};

const CATEGORIES = [
  { key: "all", label: "All Products" },
  { key: "apparel", label: "Apparel" },
  { key: "hats", label: "Hats & Scarves" },
  { key: "drinkware", label: "Drinkware" },
  { key: "accessories", label: "Stickers & More" },
  { key: "banners", label: "Banners & Flags" },
];

// ---------- CONSISTENT PRODUCT IMAGE ----------
// All images are displayed at the same aspect ratio (4:3)
// Sanity auto-crops and resizes. Fallback shows a placeholder.
const ProductImage = ({ product, size = "normal" }) => {
  const h = size === "large" ? 400 : 260;
  const imgW = size === "large" ? 600 : 400;
  const imgH = size === "large" ? 400 : 260;

  // If product has a Sanity image, use it
  if (product.image) {
    return (
      <div style={{ width: "100%", height: h, borderRadius: size === "large" ? 16 : 12, overflow: "hidden", background: "#e4e9f0" }}>
        <img
          src={urlFor(product.image).width(imgW).height(imgH).fit("crop").auto("format").url()}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback placeholder (used before CMS is connected)
  const catEmoji = { apparel: "\ud83d\udc55", hats: "\ud83e\udde2", drinkware: "\u2615", accessories: "\u2728", banners: "\ud83c\udff3\ufe0f" };
  return (
    <div style={{ width: "100%", height: h, borderRadius: size === "large" ? 16 : 12, background: "linear-gradient(150deg, #f5f7fa 0%, #e4e9f0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(3,70,148,0.03) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <span style={{ fontSize: size === "large" ? "3.5rem" : "2.5rem", zIndex: 1 }}>{catEmoji[product.category] || "\ud83d\udecd\ufe0f"}</span>
      <span style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: ".15em", color: "#034694", fontFamily: "'Oswald', sans-serif", zIndex: 1 }}>{(product.category || "").toUpperCase()}</span>
      <div style={{ position: "absolute", top: size === "large" ? 16 : 10, left: size === "large" ? 16 : 10, background: "#034694", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: ".58rem", fontWeight: 700, letterSpacing: ".12em", fontFamily: "'Oswald', sans-serif" }}>ADD PHOTO IN CMS</div>
    </div>
  );
};

// ---------- CSS ----------
const injectStyles = () => {
  if (document.getElementById("bcb-css")) return;
  const s = document.createElement("style"); s.id = "bcb-css";
  s.textContent = `
    @keyframes bcb-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bcb-in{from{opacity:0}to{opacity:1}}
    @keyframes bcb-slide{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
    @keyframes bcb-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    .bcb-up{animation:bcb-up .6s ease-out forwards;opacity:0}
    .bcb-in{animation:bcb-in .5s ease-out forwards;opacity:0}
    .bcb-slide{animation:bcb-slide .5s ease-out forwards;opacity:0}
    .bcb-card{transition:all .3s cubic-bezier(.25,.46,.45,.94)!important}
    .bcb-card:hover{transform:translateY(-5px)!important;box-shadow:0 14px 40px rgba(3,70,148,.14)!important}
    .bcb-btn{transition:all .2s ease}.bcb-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(3,70,148,.2)}
    .bcb-input:focus{outline:none;border-color:#034694!important;box-shadow:0 0 0 3px rgba(3,70,148,.1)}
    .bcb-navlink{position:relative}.bcb-navlink::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#D4AF37;transition:width .3s}.bcb-navlink:hover::after{width:100%}
    .bcb-marquee{animation:bcb-marquee 30s linear infinite}
    *{box-sizing:border-box;margin:0;padding:0}::selection{background:#034694;color:#fff}input::placeholder{color:#94a3b8}
    body{-webkit-font-smoothing:antialiased}
  `;
  document.head.appendChild(s);
};

// ---------- COLORS & FONTS ----------
const C = { p: "#034694", g: "#D4AF37", dk: "#0a1628", t: "#1a2332", tl: "#5a6577", bg: "#f8fafb", w: "#fff", b: "#e2e8f0", bl: "#f0f3f6" };
const F = { d: "'Oswald', sans-serif", b: "'Source Sans 3', sans-serif" };

// =====================================================
// MAIN STORE COMPONENT
// =====================================================
export default function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("shop");
  const [selProd, setSelProd] = useState(null);
  const [selSize, setSelSize] = useState("");
  const [selColor, setSelColor] = useState("");
  const [cat, setCat] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [chatIn, setChatIn] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [toast, setToast] = useState(false);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const chatEnd = useRef(null);
  const shopRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // ---------- LOAD PRODUCTS FROM SANITY ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"] | order(featured desc, name asc) {
          _id, name, category, price, sizes, colors, description, featured,
          "image": image.asset->url,
          image
        }`;
        const data = await client.fetch(query);
        if (data && data.length > 0) {
          setProducts(data);
        }
        // If no products in Sanity yet, keep fallback data
      } catch (err) {
        console.log("Sanity not connected yet, using fallback products. This is normal during setup.");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // ---------- CART LOGIC ----------
  const addToCart = (p, sz, cl) => {
    const ex = cart.find(i => i.p._id === p._id && i.sz === sz && i.cl === cl);
    if (ex) setCart(cart.map(i => i === ex ? { ...i, qty: i.qty + 1 } : i));
    else setCart([...cart, { p, sz, cl, qty: 1 }]);
    setToast(true); setTimeout(() => setToast(false), 2000);
  };
  const rmCart = (i) => setCart(cart.filter((_, x) => x !== i));
  const updQty = (i, d) => setCart(cart.map((it, x) => x !== i ? it : { ...it, qty: Math.max(0, it.qty + d) }).filter(it => it.qty > 0));
  const cartTotal = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const filtered = cat === "all" ? products : products.filter(p => p.category === cat);
  const featured = products.filter(p => p.featured);

  const nav = (v, prod = null) => {
    setView(v); setSelProd(prod);
    if (prod) { setSelSize(prod.sizes?.[0] || "One Size"); setSelColor(prod.colors?.[0] || ""); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- STRIPE CHECKOUT ----------
  const handleCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(i => ({
            name: i.p.name,
            price: i.p.price,
            size: i.sz,
            color: i.cl,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert("Something went wrong with checkout. Please try again.");
      }
    } catch (err) {
      alert("Checkout is not connected yet. See SETUP-GUIDE.md for Stripe setup instructions.");
    }
    setStripeLoading(false);
  };

  // ---------- AI CHAT ----------
  const sendChat = async () => {
    if (!chatIn.trim()) return;
    const msg = chatIn.trim(); setChatIn("");
    setMsgs(p => [...p, { role: "user", text: msg }]); setChatLoad(true);
    try {
      const sys = `You are the Bayou City Blues / Chelsea Houston shopping assistant. Chelsea supporters group in Houston, TX, est. 2011. "Carefree in the 713." Help customers find merch.\n\nProducts:\n${products.map(p => `- ${p.name} ($${p.price}) - ${p.description}`).join("\n")}\n\nEvents:\n${EVENTS.map(e => `- ${e.date} ${e.time}: ${e.match} at ${e.venue}`).join("\n")}\n\nBe friendly, concise (2-3 sentences). KTBFFH!`;
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: sys, messages: [...msgs.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), { role: "user", content: msg }] }),
      });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", text: d.content?.[0]?.text || "Sorry, try again!" }]);
    } catch { setMsgs(p => [...p, { role: "assistant", text: "Something went wrong!" }]); }
    setChatLoad(false);
  };

  // ---------- CATEGORY COUNTS ----------
  const catCounts = {};
  CATEGORIES.forEach(c => {
    catCounts[c.key] = c.key === "all" ? products.length : products.filter(p => p.category === c.key).length;
  });

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div style={{ fontFamily: F.b, background: C.bg, color: C.t, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: C.dk, color: "rgba(255,255,255,.85)", padding: "8px 0", overflow: "hidden", fontSize: ".72rem", letterSpacing: ".1em", fontWeight: 500 }}>
        <div className="bcb-marquee" style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", width: "max-content" }}>
          {[0,1].map(k => <div key={k} style={{ display: "flex", gap: "3rem" }}>
            <span>{"\u26bd"} FREE SHIPPING OVER $75</span><span style={{ color: C.g }}>{"\u2605"}</span>
            <span>CAREFREE IN THE 713 SINCE 2011</span><span style={{ color: C.g }}>{"\u2605"}</span>
            <span>KTBFFH</span><span style={{ color: C.g }}>{"\u2605"}</span>
          </div>)}
        </div>
      </div>

      {/* HEADER */}
      <header style={{ background: C.w, borderBottom: `1px solid ${C.b}`, position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)", backgroundColor: "rgba(255,255,255,.95)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <button onClick={() => nav("shop")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/images/logo-circle.png" alt="Chelsea Houston" style={{ height: 48, width: 48, objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <div style={{ fontFamily: F.d, fontSize: "1.2rem", fontWeight: 700, color: C.p, letterSpacing: ".06em", lineHeight: 1.1 }}>CHELSEA HOUSTON</div>
              <div style={{ fontSize: ".58rem", color: C.tl, letterSpacing: ".22em", fontWeight: 600 }}>BAYOU CITY BLUES {"\u2022"} OFFICIAL MERCH</div>
            </div>
          </button>
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[["Shop","shop"],["Matchday","events"]].map(([l,v]) => (
              <button key={v} className="bcb-navlink" onClick={() => nav(v)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.d, fontSize: ".88rem", fontWeight: 600, color: view === v ? C.p : C.tl, letterSpacing: ".08em", padding: "4px 0" }}>{l.toUpperCase()}</button>
            ))}
            <button onClick={() => nav("cart")} className="bcb-btn" style={{ background: C.p, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: ".82rem", fontFamily: F.d, letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 8 }}>
              CART {cartCount > 0 && <span style={{ background: C.g, color: C.dk, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".68rem", fontWeight: 800 }}>{cartCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      {toast && <div className="bcb-in" style={{ position: "fixed", top: 90, right: 24, background: C.p, color: "#fff", padding: "12px 24px", borderRadius: 10, zIndex: 100, fontWeight: 600, fontSize: ".88rem", boxShadow: "0 8px 32px rgba(3,70,148,.3)" }}>{"\u2713"} Added to cart</div>}

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* HERO */}
        {view === "shop" && !selProd && (
          <section className="bcb-up" style={{ margin: "32px 0", borderRadius: 20, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, ${C.dk} 0%, ${C.p} 50%, #1a5ab8 100%)`, minHeight: 400, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 0, opacity: .06 }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 400, height: 400, borderRadius: "50%", border: "60px solid #fff" }} />
              <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", border: "40px solid #fff" }} />
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${C.g}, transparent)` }} />
            <div style={{ position: "relative", zIndex: 2, padding: "48px 56px", maxWidth: 620 }}>
              <div style={{ display: "inline-block", background: "rgba(212,175,55,.15)", border: `1px solid ${C.g}`, borderRadius: 6, padding: "6px 14px", marginBottom: 20 }}>
                <span style={{ color: C.g, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".15em", fontFamily: F.d }}>CAREFREE IN THE 713 SINCE 2011</span>
              </div>
              <h1 style={{ fontFamily: F.d, fontSize: "3.2rem", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: ".02em", marginBottom: 16 }}>
                OFFICIAL<br />SUPPORTERS<br /><span style={{ color: C.g }}>MERCH</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 28, maxWidth: 420 }}>
                Gear up for matchday. Rep the badge everywhere. Houston to London, always Blue.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setCat("all"); shopRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="bcb-btn" style={{ background: C.g, color: C.dk, border: "none", padding: "14px 32px", borderRadius: 10, fontFamily: F.d, fontWeight: 700, fontSize: "1rem", letterSpacing: ".06em", cursor: "pointer" }}>SHOP ALL</button>
                <button onClick={() => nav("events")} className="bcb-btn" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.25)", padding: "14px 28px", borderRadius: 10, fontFamily: F.d, fontWeight: 600, fontSize: "1rem", letterSpacing: ".06em", cursor: "pointer" }}>MATCHDAY INFO</button>
              </div>
            </div>
          </section>
        )}

        {/* FEATURED */}
        {view === "shop" && !selProd && featured.length > 0 && (
          <section style={{ margin: "48px 0 24px" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: F.d, fontSize: "1.5rem", fontWeight: 700, letterSpacing: ".04em", color: C.dk }}>FEATURED GEAR</h2>
              <div style={{ width: 40, height: 3, background: C.g, borderRadius: 2, marginTop: 8 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {featured.slice(0, 6).map((p, i) => (
                <button key={p._id} className="bcb-card bcb-up" style={{ animationDelay: `${i*.1}s`, background: C.w, border: `1px solid ${C.bl}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 0 }} onClick={() => nav("product", p)}>
                  <ProductImage product={p} />
                  <div style={{ padding: "14px 16px 18px" }}>
                    <div style={{ fontFamily: F.d, fontSize: ".9rem", fontWeight: 600, color: C.dk, letterSpacing: ".02em", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ color: C.p, fontWeight: 700, fontSize: "1rem", fontFamily: F.d }}>${p.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ALL PRODUCTS */}
        {view === "shop" && !selProd && (
          <section ref={shopRef} style={{ margin: "48px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: F.d, fontSize: "1.5rem", fontWeight: 700, letterSpacing: ".04em", color: C.dk }}>ALL PRODUCTS</h2>
                <div style={{ width: 40, height: 3, background: C.g, borderRadius: 2, marginTop: 8 }} />
              </div>
              <span style={{ fontSize: ".78rem", color: C.tl }}>{filtered.length} items</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)} className="bcb-btn" style={{ padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${cat === c.key ? C.p : C.b}`, background: cat === c.key ? C.p : "transparent", color: cat === c.key ? "#fff" : C.tl, cursor: "pointer", fontWeight: 600, fontSize: ".8rem", display: "flex", alignItems: "center", gap: 6 }}>
                  {c.label} <span style={{ background: cat === c.key ? "rgba(255,255,255,.2)" : C.bl, padding: "1px 7px", borderRadius: 999, fontSize: ".68rem" }}>{catCounts[c.key] || 0}</span>
                </button>
              ))}
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: C.tl }}>Loading products...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
                {filtered.map((p, i) => (
                  <button key={p._id} className="bcb-card bcb-up" style={{ animationDelay: `${i*.05}s`, background: C.w, border: `1px solid ${C.bl}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", textAlign: "left", padding: 0 }} onClick={() => nav("product", p)}>
                    <ProductImage product={p} />
                    <div style={{ padding: "14px 16px 18px" }}>
                      <div style={{ fontFamily: F.d, fontSize: ".9rem", fontWeight: 600, color: C.dk, letterSpacing: ".02em", marginBottom: 4 }}>{p.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: C.p, fontWeight: 700, fontSize: "1rem", fontFamily: F.d }}>${p.price}</span>
                        <span style={{ fontSize: ".62rem", fontWeight: 600, letterSpacing: ".1em", color: C.tl, textTransform: "uppercase" }}>{(p.sizes?.length || 0) > 1 ? `${p.sizes.length} sizes` : p.sizes?.[0] || ""}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PRODUCT DETAIL */}
        {view === "product" && selProd && (
          <section className="bcb-in" style={{ margin: "32px 0 48px" }}>
            <button onClick={() => nav("shop")} style={{ background: "none", border: "none", color: C.p, cursor: "pointer", fontWeight: 600, fontSize: ".85rem", marginBottom: 24 }}>{"\u2190"} Back to shop</button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <ProductImage product={selProd} size="large" />
              <div>
                <h1 style={{ fontFamily: F.d, fontSize: "1.9rem", fontWeight: 700, color: C.dk, marginBottom: 8, lineHeight: 1.15 }}>{selProd.name}</h1>
                <div style={{ fontSize: "1.6rem", fontWeight: 700, color: C.p, fontFamily: F.d, marginBottom: 16 }}>${selProd.price}</div>
                <p style={{ color: C.tl, lineHeight: 1.7, marginBottom: 28, fontSize: ".95rem" }}>{selProd.description}</p>
                {/* Size */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: ".72rem", fontWeight: 700, color: C.tl, letterSpacing: ".12em", fontFamily: F.d }}>SIZE</span>
                    {selProd.category === "apparel" && <button onClick={() => setSizeGuide(!sizeGuide)} style={{ background: "none", border: "none", color: C.p, fontSize: ".72rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Size Guide</button>}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(selProd.sizes || []).map(s => (
                      <button key={s} onClick={() => setSelSize(s)} className="bcb-btn" style={{ padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${selSize === s ? C.p : C.b}`, background: selSize === s ? C.p : "transparent", color: selSize === s ? "#fff" : C.t, cursor: "pointer", fontWeight: 600, fontSize: ".85rem", minWidth: 52, textAlign: "center" }}>{s}</button>
                    ))}
                  </div>
                  {sizeGuide && (
                    <div style={{ marginTop: 16, background: C.w, border: `1px solid ${C.b}`, borderRadius: 12, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontFamily: F.d, fontWeight: 700 }}>SIZE GUIDE</span>
                        <button onClick={() => setSizeGuide(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.tl }}>{"\u2715"}</button>
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
                        <thead><tr>{SIZE_CHART.headers.map((h,i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `2px solid ${C.b}`, fontWeight: 700, color: C.tl, fontSize: ".68rem" }}>{h.toUpperCase()}</th>)}</tr></thead>
                        <tbody>{SIZE_CHART.rows.map((row,ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? C.bl : "transparent" }}>{row.map((cell,ci) => <td key={ci} style={{ padding: "8px 12px", fontWeight: ci === 0 ? 700 : 400 }}>{cell}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  )}
                </div>
                {/* Color */}
                {selProd.colors && selProd.colors.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.tl, letterSpacing: ".12em", fontFamily: F.d, marginBottom: 10 }}>COLOR</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {selProd.colors.map(c => (
                        <button key={c} onClick={() => setSelColor(c)} className="bcb-btn" style={{ padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${selColor === c ? C.p : C.b}`, background: selColor === c ? C.p : "transparent", color: selColor === c ? "#fff" : C.t, cursor: "pointer", fontWeight: 600, fontSize: ".85rem" }}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => addToCart(selProd, selSize, selColor)} className="bcb-btn" style={{ background: C.p, color: "#fff", border: "none", padding: "16px 0", borderRadius: 12, fontWeight: 700, fontSize: "1.05rem", cursor: "pointer", fontFamily: F.d, letterSpacing: ".06em", width: "100%" }}>ADD TO CART</button>
                <div style={{ display: "flex", gap: 12, fontSize: ".78rem", color: C.tl, justifyContent: "center", marginTop: 12 }}>
                  <span>{"\u2713"} Printed in Houston</span><span>{"\u00b7"}</span><span>{"\u2713"} Ships in 3-5 days</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EVENTS */}
        {view === "events" && (
          <section className="bcb-up" style={{ margin: "32px 0 48px" }}>
            <div style={{ background: `linear-gradient(135deg, ${C.dk} 0%, ${C.p} 100%)`, borderRadius: 20, padding: 48, marginBottom: 32 }}>
              <div style={{ color: C.g, fontSize: ".75rem", fontWeight: 700, letterSpacing: ".2em", fontFamily: F.d, marginBottom: 8 }}>UPCOMING MATCHES</div>
              <h1 style={{ fontFamily: F.d, fontSize: "2.2rem", fontWeight: 700, color: "#fff" }}>MATCHDAY WATCH PARTIES</h1>
              <p style={{ color: "rgba(255,255,255,.7)", fontSize: ".95rem", marginTop: 8 }}>Join the Bayou City Blues at the pub. Carefree in the 713.</p>
            </div>
            {EVENTS.map((e, i) => (
              <div key={i} className="bcb-card bcb-slide" style={{ animationDelay: `${i*.1}s`, background: C.w, border: `1px solid ${C.bl}`, borderRadius: 14, overflow: "hidden", display: "flex", marginBottom: 16 }}>
                <div style={{ background: C.p, color: "#fff", padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 110 }}>
                  <div style={{ fontFamily: F.d, fontSize: ".7rem", letterSpacing: ".15em", opacity: .8 }}>{e.date.split(" ")[0]}</div>
                  <div style={{ fontFamily: F.d, fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.1 }}>{e.date.split(" ")[1]}</div>
                  <div style={{ fontFamily: F.d, fontSize: "1rem", fontWeight: 600 }}>{e.date.split(" ")[2]}</div>
                </div>
                <div style={{ padding: "20px 28px", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ background: e.type === "Champions League" ? "rgba(212,175,55,.12)" : "rgba(3,70,148,.08)", color: e.type === "Champions League" ? C.g : C.p, padding: "3px 10px", borderRadius: 4, fontSize: ".65rem", fontWeight: 700, letterSpacing: ".1em", fontFamily: F.d }}>{e.type.toUpperCase()}</span>
                    <span style={{ color: C.tl, fontSize: ".82rem" }}>{e.time}</span>
                  </div>
                  <div style={{ fontFamily: F.d, fontSize: "1.2rem", fontWeight: 700, color: C.dk, marginBottom: 4 }}>{e.match}</div>
                  <div style={{ color: C.tl, fontSize: ".88rem" }}>{"\ud83d\udccd"} {e.venue}</div>
                  {e.note && <div style={{ marginTop: 8, color: C.p, fontSize: ".82rem", fontWeight: 600 }}>{e.note}</div>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CART */}
        {view === "cart" && (
          <section className="bcb-in" style={{ margin: "32px 0 48px" }}>
            <h2 style={{ fontFamily: F.d, fontSize: "1.8rem", fontWeight: 700, marginBottom: 24 }}>YOUR CART</h2>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "64px 0", color: C.tl }}>
                <p style={{ fontSize: "1.1rem", marginBottom: 20 }}>Your cart is empty</p>
                <button onClick={() => nav("shop")} className="bcb-btn" style={{ background: C.p, color: "#fff", border: "none", padding: "12px 32px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: F.d }}>SHOP NOW</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
                <div>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: 20, background: C.w, border: `1px solid ${C.bl}`, borderRadius: 12, marginBottom: 12, alignItems: "center" }}>
                      <div style={{ width: 72, height: 54, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.bl }}>
                        {item.p.image ? (
                          <img src={urlFor(item.p.image).width(144).height(108).fit("crop").url()} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{"\ud83d\udc55"}</div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: F.d, fontWeight: 600, fontSize: ".9rem" }}>{item.p.name}</div>
                        <div style={{ fontSize: ".78rem", color: C.tl }}>{item.sz} / {item.cl}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updQty(i, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.b}`, background: "transparent", cursor: "pointer", fontWeight: 700 }}>-</button>
                        <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center", fontFamily: F.d }}>{item.qty}</span>
                        <button onClick={() => updQty(i, 1)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.b}`, background: "transparent", cursor: "pointer", fontWeight: 700 }}>+</button>
                      </div>
                      <div style={{ fontWeight: 700, color: C.p, minWidth: 55, textAlign: "right", fontFamily: F.d }}>${item.p.price * item.qty}</div>
                      <button onClick={() => rmCart(i)} style={{ background: "none", border: "none", color: C.tl, cursor: "pointer" }}>{"\u2715"}</button>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.w, border: `1px solid ${C.bl}`, borderRadius: 16, padding: 28, position: "sticky", top: 100 }}>
                  <h3 style={{ fontFamily: F.d, fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>ORDER SUMMARY</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: ".9rem", color: C.tl }}>
                    <span>Subtotal</span><span style={{ fontWeight: 600, color: C.t }}>${cartTotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: ".9rem", color: C.tl }}>
                    <span>Shipping</span><span style={{ fontWeight: 600, color: cartTotal >= 75 ? "#16a34a" : C.t }}>{cartTotal >= 75 ? "FREE" : "$5.99"}</span>
                  </div>
                  {cartTotal < 75 && <div style={{ fontSize: ".78rem", color: C.p, marginBottom: 8 }}>Add ${(75 - cartTotal).toFixed(2)} more for free shipping</div>}
                  <div style={{ borderTop: `2px solid ${C.b}`, marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span style={{ fontFamily: F.d }}>TOTAL</span>
                    <span style={{ fontFamily: F.d, fontSize: "1.4rem", color: C.p }}>${cartTotal >= 75 ? cartTotal : (cartTotal + 5.99).toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={stripeLoading} className="bcb-btn" style={{ background: C.p, color: "#fff", border: "none", padding: 16, borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: "pointer", width: "100%", marginTop: 20, fontFamily: F.d, opacity: stripeLoading ? .7 : 1 }}>
                    {stripeLoading ? "REDIRECTING TO STRIPE..." : "CHECKOUT"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: 10, fontSize: ".72rem", color: C.tl }}>Secure payments by Stripe</div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* NEWSLETTER */}
        {view === "shop" && !selProd && (
          <section style={{ margin: "48px 0", background: C.dk, borderRadius: 20, padding: 48, textAlign: "center" }}>
            <h2 style={{ fontFamily: F.d, fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>JOIN THE BAYOU CITY BLUES</h2>
            <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 24, fontSize: ".95rem" }}>New drops, matchday events, and exclusive deals.</p>
            {emailDone ? (
              <div style={{ color: C.g, fontFamily: F.d, fontSize: "1.1rem", fontWeight: 700 }}>{"\u2713"} YOU'RE IN! KTBFFH!</div>
            ) : (
              <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="bcb-input" style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: ".95rem", fontFamily: F.b }} />
                <button onClick={() => { if (email) setEmailDone(true); }} className="bcb-btn" style={{ background: C.g, color: C.dk, border: "none", padding: "14px 28px", borderRadius: 10, fontFamily: F.d, fontWeight: 700, cursor: "pointer" }}>SIGN UP</button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.b}`, marginTop: 48, background: C.w, padding: "40px 24px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: F.d, fontSize: "1.05rem", fontWeight: 700, color: C.p, letterSpacing: ".06em" }}>CHELSEA HOUSTON</div>
        <div style={{ color: C.tl, fontSize: ".82rem", marginTop: 4 }}>Bayou City Blues {"\u2022"} Carefree in the 713 since 2011</div>
        <div style={{ color: C.tl, fontSize: ".72rem", marginTop: 16 }}>{"\u00a9"} 2025 Chelsea Houston / Bayou City Blues. Not affiliated with Chelsea Football Club. KTBFFH {"\ud83e\udd81"}</div>
      </footer>

      {/* CHAT */}
      <button onClick={() => setChatOpen(!chatOpen)} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: C.p, color: "#fff", border: "none", cursor: "pointer", fontSize: "1.4rem", boxShadow: "0 6px 24px rgba(3,70,148,.35)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {chatOpen ? "\u2715" : "\ud83d\udcac"}
      </button>
      {chatOpen && (
        <div className="bcb-in" style={{ position: "fixed", bottom: 92, right: 24, width: 370, maxHeight: 480, background: C.w, border: `1px solid ${C.b}`, borderRadius: 20, boxShadow: "0 16px 48px rgba(0,0,0,.15)", zIndex: 60, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ background: C.p, color: "#fff", padding: "14px 20px" }}>
            <div style={{ fontFamily: F.d, fontSize: ".9rem", fontWeight: 700 }}>BAYOU CITY BLUES ASSISTANT</div>
            <div style={{ fontSize: ".6rem", opacity: .7 }}>Merch, sizing, matchday info</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8, minHeight: 180, maxHeight: 300 }}>
            {msgs.length === 0 && <div style={{ color: C.tl, fontSize: ".86rem", textAlign: "center", padding: "28px 16px", lineHeight: 1.6 }}>Need help finding gear? Ask me anything! KTBFFH {"\u26bd"}</div>}
            {msgs.map((m, i) => <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? C.p : C.bl, color: m.role === "user" ? "#fff" : C.t, padding: "10px 14px", borderRadius: 14, maxWidth: "85%", fontSize: ".84rem", lineHeight: 1.5 }}>{m.text}</div>)}
            {chatLoad && <div style={{ color: C.tl, fontSize: ".8rem", fontStyle: "italic" }}>Thinking...</div>}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: 10, borderTop: `1px solid ${C.bl}`, display: "flex", gap: 8 }}>
            <input value={chatIn} onChange={e => setChatIn(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask anything..." className="bcb-input" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.b}`, fontSize: ".88rem", fontFamily: F.b, background: C.bg }} />
            <button onClick={sendChat} style={{ background: C.p, color: "#fff", border: "none", borderRadius: 10, padding: "0 14px", cursor: "pointer", fontWeight: 700 }}>{"\u2192"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
