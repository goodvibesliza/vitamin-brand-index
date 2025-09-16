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
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              margin: 0
            }}
          >
            A single right choice gets you better results.
          </h1>
          <p className="lead">
            Vitamin Brand Index helps you spot the difference between quality supplements
            and a bottle of sawdust—putting the power of informed choice in your hands.
          </p>
        </div>
      </div>
    </section>
  );
}
