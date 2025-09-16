import React from "react";

export default function HomeHero() {
  return (
    <section className="hero hero-silk">
      <div className="container-lg stack-lg" style={{textAlign:"center"}}>
        <div className="stack" style={{gap:".6rem"}}>
          <div style={{letterSpacing:".18em", fontSize:".85rem", color:"#9aa3b2"}}>
            PRE-PURCHASE CHECKLIST
          </div>
          <h1>Vitamin Brand Index</h1>
          <p className="lead">
            Independent brand and product facts verified by industry experts. We research brands and products so you don’t waste money...or end up with sawdust in a capsule.
          </p>
        </div>
        <div className="stack" style={{gap:".6rem"}}>
          <a className="button" href="/brands/">Browse brands →</a>
          <a className="button button-secondary" href="/for-brands/">Get Verified →</a>
        </div>
      </div>
    </section>
  );
}
