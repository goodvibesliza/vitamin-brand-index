import React from "react";

export default function HomeHero() {
  return (
    <section className="hero hero-silk">
      <div className="container-lg stack" style={{textAlign:"center"}}>
        <div className="stack" style={{gap:".6rem"}}>
          <div style={{letterSpacing:".18em", fontSize:".85rem", color:"#9aa3b2"}}>
            SUPPLEMENT BETTER
          </div>
          <h1 style={{ fontSize: "1.5em" }}>
            Choosing the right product gets you the right results.
          </h1>
          <p className="lead">
            Search brands, attributes, and products—make the right choice, skip the hype.
          </p>
        </div>
      </div>
    </section>
  );
}
