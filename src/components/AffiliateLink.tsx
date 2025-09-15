import React from "react";

export default function AffiliateLink({
  href, children,
}: React.PropsWithChildren<{ href: string }>) {
  function handleClick() {
    try { (window as any).plausible?.("Affiliate Click", { props: { href } }); } catch {}
  }
  return (
    <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer" onClick={handleClick}>
      {children}
    </a>
  );
}
