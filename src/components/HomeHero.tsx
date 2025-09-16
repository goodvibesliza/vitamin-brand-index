import React from "react";

export default function HomeHero() {
  return (
    <section className="hero hero-silk">
      <div className="container-lg stack" style={{ textAlign: "center" }}>
        <div className="stack" style={{ gap: ".6rem" }}>
          <div style={{ letterSpacing: ".18em", fontSize: ".85rem", color: "#9aa3b2" }}>
            SUPPLEMENT BETTER
          </div>
          <h1
  style={{
    fontSize: "clamp(3rem, 7vw, 5rem)",  // bigger
    lineHeight: 1.1,
    margin: 0
  }}
>
  A <em style={{ fontStyle: "italic", fontWeight: 600, opacity: 0.95 }}>single</em> right choice gets you better results.
</h1>
          <p className="lead">
            Vitamin Brand Index helps you spot the difference between quality supplements
            and a bottle of sawdust...putting the power of informed choice in your hands.
          </p>
        </div>
      </div>
    </section>
  );
}
