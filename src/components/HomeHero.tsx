import React from "react";

export default function HomeHero() {
  return (
    <section className="hero hero-silk">
      <div className="container-lg stack-lg" style={{ textAlign: "center" }}>
        <div className="stack" style={{ gap: ".6rem" }}>
          <div style={{ letterSpacing: ".18em", fontSize: ".85rem", color: "#9aa3b2" }}>
            PRE-PURCHASE INFO
          </div>
          <h1>
            A <em>single</em> right choice gets you better results.
          </h1>
          <p className="lead">
            Industry experts with decades of experience compile the facts that actually matter about brands and products. That way you don’t waste money or end up with a bottle of sawdust.
          </p>
        </div>
        <div className="stack" style={{ gap: ".6rem" }}>
          <a className="button" href="/brands/">Browse brands →</a>
          <a className="button button-secondary" href="/for-brands/">Get Verified →</a>
        </div>
      </div>
    </section>
  );
}
