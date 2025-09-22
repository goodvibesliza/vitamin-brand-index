import React from "react";

export default function HomeHero() {
  return (
    <section className="hero hero-silk">
      <div className="container-lg stack" style={{ textAlign: "center" }}>
        <div className="stack" style={{ gap: ".6rem" }}>
          <div style={{ letterSpacing: ".18em", fontSize: "1.2rem", color: "#9aa3b2" }}>
            SUPPLEMENT BETTER
          </div>
          <h1
            style={{
              fontSize: "clamp(3rem, 7vw, 5rem)",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.015em" // tighter tracking per request
            }}
          >
            A <em style={{ fontStyle: "italic", fontWeight: 400, color: "#000" }}>single right choice</em><br />
            gets you better results.
          </h1>
          <p className="lead" style={{ fontSize: "1.6rem", lineHeight: 1.35 }}>
            Vitamin Brand Index helps you choose<br />
            between quality supplements and a bottle of sawdust...<br />
            the power of informed choice is in your hands.
          </p>
        </div>
      </div>
    </section>
  );
}
