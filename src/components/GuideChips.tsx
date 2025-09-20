import React from "react";
import { guidesMap } from "../data/guidesMap";

/**
 * Renders a horizontal scrolling strip of guide topic chips
 * that link to corresponding guide pages
 */
export default function GuideChips() {
  // Convert the guidesMap object to an array of entries
  const guideEntries = Object.entries(guidesMap).map(([key, guide]) => ({
    key,
    ...guide,
  }));

  // Handle chip click with analytics tracking
  const handleChipClick = (slug: string, label: string) => {
    // TODO: Add Plausible analytics tracking
    // track("guide_chip_click", { slug, label });
  };

  return (
    <section className="container" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <h2 style={{ 
        fontSize: "1.5rem", 
        marginBottom: "1rem",
        fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
        textAlign: "center" 
      }}>
        What matters to you?
      </h2>
      
      {/* Wrapping flexbox container */}
      <div className="chip-container">
          {guideEntries.map((guide) => (
            <a
              key={guide.key}
              href={`/guides/${guide.slug}/`}
              onClick={() => handleChipClick(guide.slug, guide.label)}
              style={{
                display: "inline-block",
                /* allow natural wrapping – no fixed flex-basis */
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                backgroundColor: "white",
                color: "var(--text)",
                fontSize: "0.95rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-petal-1)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {guide.label}
            </a>
          ))}
      </div>
      {/* local styles just for this component */}
      <style>{`
        .chip-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0.5rem 0.25rem 1rem;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
