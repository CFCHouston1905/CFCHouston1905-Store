import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ─── Sanity Config ───
const sanityClient = createClient({
  projectId: 'a9vovusz',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source);

// ─── Fixtures Data ───
const FIXTURES = [
  { home: 'Arsenal', away: 'Chelsea', date: 'Sun, Mar 1', time: '10:30 AM CT', comp: 'Premier League' },
  { home: 'Aston Villa', away: 'Chelsea', date: 'Wed, Mar 4', time: '2:00 PM CT', comp: 'Premier League' },
  { home: 'Wrexham', away: 'Chelsea', date: 'Sat, Mar 7', time: '11:45 AM CT', comp: 'FA Cup' },
  { home: 'PSG', away: 'Chelsea', date: 'Wed, Mar 11', time: '12:00 PM CT', comp: 'Champions League' },
  { home: 'Chelsea', away: 'Newcastle', date: 'Sat, Mar 14', time: '10:00 AM CT', comp: 'Premier League' },
  { home: 'Chelsea', away: 'PSG', date: 'Tue, Mar 17', time: '3:00 PM CT', comp: 'Champions League' },
  { home: 'Everton', away: 'Chelsea', date: 'Sat, Mar 21', time: '10:00 AM CT', comp: 'Premier League' },
  { home: 'Chelsea', away: 'Man City', date: 'Sat, Apr 11', time: '9:00 AM CT', comp: 'Premier League' },
  { home: 'Chelsea', away: 'Man United', date: 'Sat, Apr 18', time: '9:00 AM CT', comp: 'Premier League' },
  { home: 'Brighton', away: 'Chelsea', date: 'Sat, Apr 25', time: '9:00 AM CT', comp: 'Premier League' },
  { home: 'Chelsea', away: 'Nottm Forest', date: 'Sat, May 2', time: '9:00 AM CT', comp: 'Premier League' },
  { home: 'Liverpool', away: 'Chelsea', date: 'Sat, May 9', time: '9:00 AM CT', comp: 'Premier League' },
  { home: 'Chelsea', away: 'Tottenham', date: 'Sat, May 17', time: 'TBD', comp: 'Premier League' },
  { home: 'Sunderland', away: 'Chelsea', date: 'Sat, May 24', time: 'TBD', comp: 'Premier League' },
];

// ─── Styles ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

:root {
  --bg-primary: #0a0a0f;
  --bg-card: #111118;
  --bg-card-hover: #16161f;
  --bg-elevated: #1a1a24;
  --chelsea-blue: #034694;
  --chelsea-blue-light: #0a5cc1;
  --chelsea-blue-dark: #022b5a;
  --gold: #c8a951;
  --gold-light: #dbc06e;
  --gold-dim: #a08530;
  --text-primary: #f0f0f5;
  --text-secondary: #8a8a9a;
  --text-muted: #55556a;
  --border-subtle: rgba(255,255,255,0.06);
  --border-gold: rgba(200,169,81,0.3);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Source Sans 3', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

::selection {
  background: var(--chelsea-blue);
  color: white;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--chelsea-blue-dark); border-radius: 3px; }

/* ─── Announcement Bar ─── */
.announce-bar {
  background: var(--chelsea-blue);
  padding: 8px 0;
  overflow: hidden;
  position: relative;
}
.announce-track {
  display: flex;
  gap: 60px;
  animation: scroll-left 30s linear infinite;
  white-space: nowrap;
}
.announce-track span {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.9);
  flex-shrink: 0;
}
.announce-track .gold-text { color: var(--gold); }
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ─── Header ─── */
header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10,10,15,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 40px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}
.header-left img { height: 44px; width: 44px; object-fit: contain; }
.header-brand {
  display: flex;
  flex-direction: column;
}
.header-brand-name {
  font-family: 'Oswald', sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-primary);
  line-height: 1.1;
}
.header-brand-sub {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 500;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.header-nav a {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}
.header-nav a:hover { color: var(--gold); }
.cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--border-gold);
  color: var(--gold);
  padding: 8px 18px;
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.cart-btn:hover {
  background: var(--gold);
  color: var(--bg-primary);
}
.cart-count {
  background: var(--chelsea-blue);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

/* ─── Hero ─── */
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #020810 0%, #03244a 40%, #034694 70%, #022b5a 100%);
}
.hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}
.hero-gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}
.hero-orb-1 {
  width: 600px; height: 600px;
  background: var(--chelsea-blue-light);
  top: -200px; right: -100px;
}
.hero-orb-2 {
  width: 400px; height: 400px;
  background: var(--gold);
  bottom: -100px; left: -50px;
  opacity: 0.08;
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 40px 24px;
  animation: fadeUp 1s ease-out;
}
.hero-crest {
  width: 160px;
  height: 160px;
  margin: 0 auto 30px;
  filter: drop-shadow(0 0 40px rgba(3,70,148,0.5));
  animation: fadeUp 0.8s ease-out;
}
.hero-crest img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.hero-tagline {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
  font-weight: 400;
}
.hero-title {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(42px, 7vw, 80px);
  font-weight: 700;
  line-height: 0.95;
  margin-bottom: 20px;
  text-transform: uppercase;
}
.hero-title .outline {
  -webkit-text-stroke: 1.5px var(--text-primary);
  color: transparent;
}
.hero-title .gold { color: var(--gold); }
.hero-desc {
  font-size: 17px;
  color: rgba(255,255,255,0.6);
  max-width: 500px;
  margin: 0 auto 36px;
  line-height: 1.6;
  font-weight: 300;
}
.hero-btns {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: var(--bg-primary);
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 36px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(200,169,81,0.3);
}
.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-primary);
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 36px;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  transition: all 0.3s;
}
.btn-outline:hover {
  border-color: var(--gold);
  color: var(--gold);
}
.hero-vertical-mark {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.06;
  height: 70vh;
  pointer-events: none;
}
.hero-vertical-mark img {
  height: 100%;
  object-fit: contain;
}
.hero-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, var(--bg-primary), transparent);
}

/* ─── Section Common ─── */
.section {
  padding: 80px 40px;
  max-width: 1280px;
  margin: 0 auto;
}
.section-label {
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 12px;
  font-weight: 400;
}
.section-title {
  font-family: 'Oswald', sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  margin-bottom: 8px;
}
.section-divider {
  width: 40px;
  height: 2px;
  background: var(--gold);
  margin: 16px 0 40px;
}

/* ─── Category Filters ─── */
.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.filter-btn {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}
.filter-btn.active {
  background: var(--chelsea-blue);
  border-color: var(--chelsea-blue);
  color: white;
}

/* ─── Product Grid ─── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  group: true;
}
.product-card:hover {
  border-color: rgba(200,169,81,0.2);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.product-img-wrap {
  position: relative;
  aspect-ratio: 4/3;
  background: var(--bg-elevated);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
  transition: transform 0.5s;
}
.product-card:hover .product-img-wrap img {
  transform: scale(1.05);
}
.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--chelsea-blue);
  color: white;
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
}
.product-featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--gold);
  color: var(--bg-primary);
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 10px;
  font-weight: 600;
}
.product-info {
  padding: 16px 18px 20px;
}
.product-name {
  font-family: 'Oswald', sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: var(--text-primary);
}
.product-cat {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.product-price {
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--gold);
}

/* ─── Product Detail Modal ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s;
}
.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--chelsea-blue);
  border-color: var(--chelsea-blue);
}
.modal-image {
  aspect-ratio: 1;
  background: var(--bg-elevated);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}
.modal-details {
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-cat {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}
.modal-name {
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.1;
}
.modal-price {
  font-family: 'Oswald', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--gold);
}
.modal-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
}
.option-group label {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.option-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pill {
  padding: 8px 16px;
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.pill:hover { border-color: var(--text-secondary); }
.pill.active {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(200,169,81,0.08);
}
.add-cart-btn {
  width: 100%;
  padding: 16px;
  background: var(--gold);
  color: var(--bg-primary);
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}
.add-cart-btn:hover {
  background: var(--gold-light);
  box-shadow: 0 6px 20px rgba(200,169,81,0.3);
}

/* ─── Fixtures ─── */
.fixtures-section {
  background: var(--bg-card);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}
.fixture-venue-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-gold);
  padding: 24px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.venue-icon {
  width: 48px;
  height: 48px;
  background: var(--chelsea-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.venue-info h4 {
  font-family: 'Oswald', sans-serif;
  font-size: 16px;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  margin-bottom: 2px;
}
.venue-info p {
  font-size: 13px;
  color: var(--text-secondary);
}
.venue-info a {
  color: var(--gold);
  text-decoration: none;
  font-size: 13px;
}
.venue-info a:hover { text-decoration: underline; }
.fixture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}
.fixture-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s;
}
.fixture-card:hover { border-color: rgba(200,169,81,0.2); }
.fixture-teams {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.fixture-team {
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.fixture-team.chelsea { color: var(--chelsea-blue-light); font-weight: 600; }
.fixture-meta {
  text-align: right;
}
.fixture-date {
  font-family: 'Oswald', sans-serif;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--text-primary);
  text-transform: uppercase;
}
.fixture-time {
  font-size: 12px;
  color: var(--gold);
  font-weight: 600;
}
.fixture-comp {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* ─── About ─── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.about-shield {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}
.about-shield img {
  width: 100%;
  height: auto;
  object-fit: contain;
  mix-blend-mode: screen;
  filter: invert(1) drop-shadow(0 0 30px rgba(3,70,148,0.3));
}
.about-text h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  margin-bottom: 20px;
}
.about-text p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.about-stats {
  display: flex;
  gap: 32px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
}
.stat-item {}
.stat-num {
  font-family: 'Oswald', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ─── Cart Drawer ─── */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 300;
  animation: fadeIn 0.2s;
}
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: var(--bg-card);
  border-left: 1px solid var(--border-subtle);
  z-index: 301;
  display: flex;
  flex-direction: column;
  animation: slideLeft 0.3s ease-out;
}
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--border-subtle);
}
.cart-header h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 18px;
  letter-spacing: 0.1em;
}
.cart-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 22px;
  cursor: pointer;
}
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}
.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.cart-item-img {
  width: 72px;
  height: 72px;
  background: var(--bg-elevated);
  overflow: hidden;
  flex-shrink: 0;
}
.cart-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cart-item-info { flex: 1; }
.cart-item-name {
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.cart-item-variant {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.cart-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cart-qty {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--border-subtle);
}
.cart-qty button {
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
}
.cart-qty button:hover { color: var(--text-primary); }
.cart-qty span {
  width: 28px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}
.cart-item-price {
  font-family: 'Oswald', sans-serif;
  font-size: 16px;
  color: var(--gold);
  font-weight: 600;
}
.cart-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}
.cart-empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
}
.cart-footer {
  padding: 24px;
  border-top: 1px solid var(--border-subtle);
}
.cart-shipping-bar {
  background: var(--bg-primary);
  padding: 12px;
  margin-bottom: 16px;
  text-align: center;
}
.cart-shipping-bar p {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.shipping-progress {
  height: 3px;
  background: var(--border-subtle);
  border-radius: 2px;
  overflow: hidden;
}
.shipping-fill {
  height: 100%;
  background: var(--gold);
  transition: width 0.3s;
}
.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.cart-total-label {
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.cart-total-amount {
  font-family: 'Oswald', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--gold);
}
.checkout-btn {
  width: 100%;
  padding: 16px;
  background: var(--gold);
  color: var(--bg-primary);
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.checkout-btn:hover {
  background: var(--gold-light);
}

/* ─── Toast ─── */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--chelsea-blue);
  color: white;
  padding: 14px 28px;
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 500;
  animation: toastIn 0.3s, toastOut 0.3s 2.2s forwards;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);
}
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } }
@keyframes toastOut { to { opacity: 0; transform: translateX(-50%) translateY(20px); } }

/* ─── Chat Widget ─── */
.chat-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: var(--chelsea-blue);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 150;
  box-shadow: 0 4px 20px rgba(3,70,148,0.5);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 30px rgba(3,70,148,0.6);
}
.chat-window {
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 500px;
  max-height: 60vh;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  z-index: 151;
  display: flex;
  flex-direction: column;
  animation: fadeUp 0.3s;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.chat-header {
  padding: 16px 20px;
  background: var(--chelsea-blue);
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-header-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
}
.chat-header h4 {
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  letter-spacing: 0.08em;
  font-weight: 500;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-msg {
  max-width: 85%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
}
.chat-msg.bot {
  background: var(--bg-elevated);
  align-self: flex-start;
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}
.chat-msg.user {
  background: var(--chelsea-blue);
  align-self: flex-end;
  color: white;
}
.chat-input-wrap {
  display: flex;
  border-top: 1px solid var(--border-subtle);
}
.chat-input-wrap input {
  flex: 1;
  background: var(--bg-primary);
  border: none;
  padding: 14px 16px;
  color: var(--text-primary);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  outline: none;
}
.chat-input-wrap input::placeholder {
  color: var(--text-muted);
}
.chat-send {
  background: var(--gold);
  border: none;
  padding: 0 18px;
  color: var(--bg-primary);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-send:hover { background: var(--gold-light); }

/* ─── Footer ─── */
footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-subtle);
  padding: 60px 40px 30px;
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}
.footer-brand img {
  height: 50px;
  margin-bottom: 16px;
}
.footer-brand p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 280px;
}
.footer-col h5 {
  font-family: 'Oswald', sans-serif;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.footer-col a {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s;
  cursor: pointer;
}
.footer-col a:hover { color: var(--gold); }
.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.footer-copy {
  font-size: 12px;
  color: var(--text-muted);
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: none;
}
.footer-links a:hover { color: var(--gold); }

/* ─── Animations ─── */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── No Products Placeholder ─── */
.no-products {
  text-align: center;
  padding: 60px 20px;
  grid-column: 1 / -1;
}
.no-products p {
  color: var(--text-muted);
  font-size: 16px;
}

/* ─── Mobile hamburger ─── */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
}
.mobile-nav-overlay {
  display: none;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .modal-content { grid-template-columns: 1fr; max-height: 95vh; }
  .modal-image { aspect-ratio: 16/9; }
  .about-grid { grid-template-columns: 1fr; text-align: center; }
  .about-shield { max-width: 250px; }
  .about-stats { justify-content: center; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .hero-vertical-mark { display: none; }
}
@media (max-width: 768px) {
  header { padding: 0 20px; }
  .header-nav { display: none; }
  .mobile-menu-btn { display: block; }
  .mobile-nav-overlay {
    display: flex;
    position: fixed;
    inset: 0;
    background: rgba(10,10,15,0.97);
    z-index: 400;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    animation: fadeIn 0.2s;
  }
  .mobile-nav-overlay a {
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-primary);
    text-decoration: none;
    cursor: pointer;
  }
  .mobile-nav-overlay a:hover { color: var(--gold); }
  .mobile-nav-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 28px;
    cursor: pointer;
  }
  .section { padding: 50px 20px; }
  .hero { min-height: 70vh; }
  .hero-crest { width: 120px; height: 120px; }
  .footer-grid { grid-template-columns: 1fr; }
  .fixture-grid { grid-template-columns: 1fr; }
  .fixture-venue-card { flex-direction: column; text-align: center; }
}
`;

// ─── Category map ───
const CATEGORY_MAP = {
  all: 'All Products',
  apparel: 'Apparel',
  hats: 'Hats',
  drinkware: 'Drinkware',
  accessories: 'Accessories',
  flags: 'Flags',
};

// ─── Main App ───
export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState(() => {
    try { const saved = window.localStorage.getItem('bcb-cart'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [modalQty, setModalQty] = useState(1);
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hey Blue! Welcome to the Bayou City Blues store. Ask me about any of our gear, sizing, or upcoming watch parties. KTBFFH!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const chatEndRef = useRef(null);

  // Save cart to localStorage
  useEffect(() => {
    try { window.localStorage.setItem('bcb-cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  // Fetch from Sanity
  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "product"] | order(_createdAt desc) {
        _id, name, price, category, description, image, gallery, sizes, colors, featured
      }`)
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtered products
  const filtered = filter === 'all'
    ? products
    : products.filter((p) => {
        const cat = (p.category || '').toLowerCase().replace(/[\s&]+/g, '-');
        return cat === filter || (p.category || '').toLowerCase() === filter;
      });

  // Category counts
  const catCounts = {};
  products.forEach((p) => {
    const cat = (p.category || '').toLowerCase().replace(/[\s&]+/g, '-');
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  // Cart functions
  const addToCart = (product, size, color, quantity = 1) => {
    const key = `${product._id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + quantity } : i));
      }
      return [...prev, {
        key,
        id: product._id,
        name: product.name,
        price: product.price,
        size,
        color,
        image: product.image,
        qty: quantity,
      }];
    });
    setToast(`${product.name} added to cart`);
    setTimeout(() => setToast(''), 2500);
    setSelectedProduct(null);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const freeShipThreshold = 75;
  const freeShipProgress = Math.min(cartTotal / freeShipThreshold, 1);

  // Checkout
  const handleCheckout = async () => {
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({
            name: `${i.name}${i.size ? ` - ${i.size}` : ''}${i.color ? ` - ${i.color}` : ''}`,
            price: i.price,
            quantity: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setToast('Checkout not available yet. Set up Stripe to enable.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Chat
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatMessage: userMsg }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'bot', text: data.reply || "Sorry, I couldn't process that. Try again!" }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'bot', text: "I'm having trouble connecting right now. Check back soon! In the meantime, browse our shop or check the fixtures schedule." },
      ]);
    }
    setChatLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Announcement Bar */}
      <div className="announce-bar">
        <div className="announce-track">
          {[...Array(3)].map((_, i) => (
            <span key={i}>
              Free shipping on orders over $75 &nbsp;&nbsp; ★ &nbsp;&nbsp;
              <span className="gold-text">Next Match: Arsenal vs Chelsea | Sun, Mar 1 | 11:30 AM CT</span>
              &nbsp;&nbsp; ★ &nbsp;&nbsp;
              Watch Parties at Little Woodrow's EaDo &nbsp;&nbsp; ★ &nbsp;&nbsp;
              <span className="gold-text">Carefree in the 713 Since 2011</span>
              &nbsp;&nbsp; ★ &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header>
        <div className="header-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/images/logo-circle.png" alt="Chelsea Houston" />
          <div className="header-brand">
            <span className="header-brand-name">Chelsea Houston</span>
            <span className="header-brand-sub">Bayou City Blues</span>
          </div>
        </div>

        <div className="header-nav">
          <a onClick={() => scrollTo('shop')}>Shop</a>
          <a onClick={() => scrollTo('fixtures')}>Fixtures</a>
          <a onClick={() => scrollTo('about')}>About</a>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileNav(true)}>☰</button>
      </header>

      {/* Mobile Nav */}
      {mobileNav && (
        <div className="mobile-nav-overlay">
          <button className="mobile-nav-close" onClick={() => setMobileNav(false)}>✕</button>
          <a onClick={() => scrollTo('shop')}>Shop</a>
          <a onClick={() => scrollTo('fixtures')}>Fixtures</a>
          <a onClick={() => scrollTo('about')}>About</a>
          <a onClick={() => { setMobileNav(false); setCartOpen(true); }}>Cart ({cartCount})</a>
        </div>
      )}

      {/* Hero */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-gradient-orb hero-orb-1" />
        <div className="hero-gradient-orb hero-orb-2" />
        <div className="hero-vertical-mark">
          <img src="/images/logo-vertical.png" alt="" />
        </div>
        <div className="hero-content">
          <div className="hero-crest">
            <img src="/images/logo-circle.png" alt="Chelsea Houston 1905" />
          </div>
          <div className="hero-tagline">Carefree in the 713 since 2011</div>
          <h1 className="hero-title">
            <span className="outline">Official</span><br />
            Supporters <span className="gold">Merch</span>
          </h1>
          <p className="hero-desc">
            Gear up for matchday. Rep the badge from Houston to London. Always Blue.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo('shop')}>Shop Collection</button>
            <button className="btn-outline" onClick={() => scrollTo('fixtures')}>Watch Parties</button>
          </div>
        </div>
        <div className="hero-divider" />
      </section>

      {/* Shop Section */}
      <section className="section" id="shop">
        <div className="section-label">Collection</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <h2 className="section-title">Shop All</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="section-divider" />

        <div className="filter-row">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({products.length})
          </button>
          {Object.entries(CATEGORY_MAP).filter(([k]) => k !== 'all').map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label} ({catCounts[key] || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="no-products">
            <p>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-products">
            <p>
              {products.length === 0
                ? 'No products yet. Add products in Sanity Studio to see them here.'
                : 'No products in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product, idx) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize(product.sizes?.[0] || '');
                  setSelectedColor(product.colors?.[0] || '');
                  setGalleryIdx(0);
                  setModalQty(1);
                }}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="product-img-wrap">
                  {product.image ? (
                    <img src={urlFor(product.image).width(600).fit('max').auto('format').url()} alt={product.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/images/logo-circle.png" alt="" style={{ width: '60px', opacity: 0.15 }} />
                    </div>
                  )}
                  <div className="product-badge">{product.category || 'Merch'}</div>
                  {product.featured && <div className="product-featured-badge">Featured</div>}
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-cat">{product.category || 'Merch'}</div>
                  <div className="product-price">${product.price?.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fixtures Section */}
      <section className="fixtures-section" id="fixtures">
        <div className="section" style={{ padding: '80px 0' }}>
          <div style={{ padding: '0 40px' }}>
            <div className="section-label">Matchday</div>
            <h2 className="section-title">Fixtures & Watch Parties</h2>
            <div className="section-divider" />

            <div className="fixture-venue-card">
              <div className="venue-icon">📍</div>
              <div className="venue-info">
                <h4>Little Woodrow's EaDo</h4>
                <p>801 St Emanuel St, Houston, TX 77003</p>
                <p style={{ marginTop: '4px' }}>
                  Every Chelsea match. All Blues welcome.{' '}
                  <a href="https://www.google.com/maps/place/Little+Woodrow's+EaDo" target="_blank" rel="noopener noreferrer">
                    Get Directions →
                  </a>
                </p>
              </div>
            </div>

            <div className="fixture-grid">
              {FIXTURES.map((f, i) => (
                <div key={i} className="fixture-card">
                  <div className="fixture-teams">
                    <span className={`fixture-team ${f.home === 'Chelsea' ? 'chelsea' : ''}`}>{f.home}</span>
                    <span className={`fixture-team ${f.away === 'Chelsea' ? 'chelsea' : ''}`}>{f.away}</span>
                  </div>
                  <div className="fixture-meta">
                    <div className="fixture-date">{f.date}</div>
                    <div className="fixture-time">{f.time}</div>
                    <div className="fixture-comp">{f.comp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" id="about">
        <div className="about-grid">
          <div className="about-shield">
            <img src="/images/logo-shield.jpeg" alt="Bayou City Blues Crest" />
          </div>
          <div className="about-text">
            <div className="section-label">Our Story</div>
            <h3>Chelsea Houston 1905</h3>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '-12px', marginBottom: '20px' }}>Bayou City Blues</div>
            <div className="section-divider" />
            <p>
              Founded in 2011, Chelsea Houston 1905 / Bayou City Blues are Houston's official Chelsea FC supporters group.
              What started as a handful of Blues gathering at a local pub has grown into one of the
              largest and most passionate Chelsea communities in the United States.
            </p>
            <p>
              Every matchday, we pack Little Woodrow's EaDo to sing, cheer, and suffer together.
              From the highs of Champions League glory to the lows of a rough Saturday, we're always
              here. Houston to London, always Blue.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-num">2011</div>
                <div className="stat-label">Founded</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">713</div>
                <div className="stat-label">Houston Area Code</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">1905</div>
                <div className="stat-label">Chelsea Est.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/images/logo-circle.png" alt="Chelsea Houston" />
              <p>
                Houston's official Chelsea FC supporters group. Carefree in the 713 since 2011.
              </p>
            </div>
            <div className="footer-col">
              <h5>Shop</h5>
              <a onClick={() => { setFilter('apparel'); scrollTo('shop'); }}>Apparel</a>
              <a onClick={() => { setFilter('hats'); scrollTo('shop'); }}>Hats</a>
              <a onClick={() => { setFilter('drinkware'); scrollTo('shop'); }}>Drinkware</a>
              <a onClick={() => { setFilter('accessories'); scrollTo('shop'); }}>Accessories</a>
              <a onClick={() => { setFilter('flags'); scrollTo('shop'); }}>Flags</a>
            </div>
            <div className="footer-col">
              <h5>Club</h5>
              <a onClick={() => scrollTo('fixtures')}>Fixtures</a>
              <a onClick={() => scrollTo('about')}>About Us</a>
              <a href="https://www.chelseafc.com" target="_blank" rel="noopener noreferrer">Chelsea FC</a>
            </div>
            <div className="footer-col">
              <h5>Watch Parties</h5>
              <a href="https://www.google.com/maps/place/Little+Woodrow's+EaDo" target="_blank" rel="noopener noreferrer">
                Little Woodrow's EaDo
              </a>
              <a>801 St Emanuel St</a>
              <a>Houston, TX 77003</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">
              &copy; {new Date().getFullYear()} Bayou City Blues / Chelsea Houston. Not affiliated with Chelsea FC.
            </span>
            <div className="footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-image" style={{ position: 'relative' }}>
              {(() => {
                const allImages = [];
                if (selectedProduct.image) allImages.push(selectedProduct.image);
                if (selectedProduct.gallery?.length) {
                  selectedProduct.gallery.forEach((g) => { if (g) allImages.push(g); });
                }
                if (allImages.length === 0) {
                  return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
                      <img src="/images/logo-circle.png" alt="" style={{ width: '80px', opacity: 0.15 }} />
                    </div>
                  );
                }
                const current = allImages[galleryIdx] || allImages[0];
                return (
                  <>
                    <img src={urlFor(current).width(800).fit('max').auto('format').url()} alt={selectedProduct.name} />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + allImages.length) % allImages.length); }}
                          style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % allImages.length); }}
                          style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                          {allImages.map((_, i) => (
                            <button key={i} onClick={(e) => { e.stopPropagation(); setGalleryIdx(i); }}
                              style={{ width: i === galleryIdx ? '20px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === galleryIdx ? 'var(--gold)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="modal-details">
              <div className="modal-cat">{selectedProduct.category || 'Merch'}</div>
              <div className="modal-name">{selectedProduct.name}</div>
              <div className="modal-price">${selectedProduct.price?.toFixed(2)}</div>
              {selectedProduct.description && (
                <div className="modal-desc" style={{ whiteSpace: 'pre-line' }}>{selectedProduct.description}</div>
              )}
              {selectedProduct.sizes?.length > 0 && (
                <div className="option-group">
                  <label>Size</label>
                  <div className="option-pills">
                    {selectedProduct.sizes.map((s) => (
                      <button key={s} className={`pill ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedProduct.colors?.length > 0 && (
                <div className="option-group">
                  <label>Color</label>
                  <div className="option-pills">
                    {selectedProduct.colors.map((c) => (
                      <button key={c} className={`pill ${selectedColor === c ? 'active' : ''}`} onClick={() => setSelectedColor(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="option-group">
                <label>Quantity</label>
                <div className="cart-qty" style={{ justifyContent: 'flex-start' }}>
                  <button onClick={() => setModalQty(Math.max(1, modalQty - 1))}>-</button>
                  <span>{modalQty}</span>
                  <button onClick={() => setModalQty(modalQty + 1)}>+</button>
                </div>
              </div>
              <button className="add-cart-btn" onClick={() => addToCart(selectedProduct, selectedSize, selectedColor, modalQty)}>
                Add to Cart{modalQty > 1 ? ` (${modalQty})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <h3>Your Cart ({cartCount})</h3>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.key} className="cart-item">
                    <div className="cart-item-img">
                      {item.image ? (
                        <img src={urlFor(item.image).width(150).height(150).fit('crop').url()} alt={item.name} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)' }} />
                      )}
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-variant">
                        {[item.size, item.color].filter(Boolean).join(' / ') || 'One size'}
                      </div>
                      <div className="cart-item-bottom">
                        <div className="cart-qty">
                          <button onClick={() => updateQty(item.key, -1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.key, 1)}>+</button>
                        </div>
                        <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-shipping-bar">
                  <p>
                    {cartTotal >= freeShipThreshold
                      ? '✓ You qualify for free shipping!'
                      : `$${(freeShipThreshold - cartTotal).toFixed(2)} away from free shipping`}
                  </p>
                  <div className="shipping-progress">
                    <div className="shipping-fill" style={{ width: `${freeShipProgress * 100}%` }} />
                  </div>
                </div>
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-amount">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Chat Widget */}
      <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? '✕' : '💬'}
      </button>
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-dot" />
            <h4>Blues Assistant</h4>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="chat-msg bot" style={{ opacity: 0.5 }}>Thinking...</div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-wrap">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
              placeholder="Ask about merch, sizing, watch parties..."
            />
            <button className="chat-send" onClick={sendChat}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
