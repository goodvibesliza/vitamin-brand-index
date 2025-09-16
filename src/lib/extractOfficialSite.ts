/**
 * Helper to extract the most likely official website from a list of sources
 */

/**
 * Extracts the most likely official website from a list of source URLs
 * @param sources Array of URLs to analyze
 * @param brandName Brand name to match against domain
 * @returns The most likely official website URL or null if none found
 */
export function extractOfficialSite(sources: string[] = [], brandName: string): string | null {
  if (!sources?.length || !brandName) return null;
  
  // Normalize brand name: lowercase, remove non-alphanumerics
  const brandNormalized = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Split into tokens for partial matching (only keep tokens >=3 chars)
  const brandTokens = brandName
    .toLowerCase()
    .split(/\s+/)
    .map(token => token.replace(/[^a-z0-9]/g, ''))
    .filter(token => token.length >= 3);
  
  // Known non-official hosts to penalize
  const blockedHosts = [
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'linkedin.com', 'youtube.com', 'tiktok.com', 'wikipedia.org',
    'amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de',
    'amazon.fr', 'amazon.es', 'amazon.it', 'amazon.jp'
  ];
  
  // Score and filter sources
  const scored = sources.map(url => {
    try {
      const parsedUrl = new URL(url);
      
      // Extract registrable domain (simplified as last two hostname parts)
      const hostParts = parsedUrl.hostname.split('.');
      const registrableDomain = hostParts.length >= 2 
        ? hostParts.slice(-2).join('.') 
        : parsedUrl.hostname;
      
      const registrableNormalized = registrableDomain.toLowerCase().replace(/[^a-z0-9.]/g, '');
      
      // Calculate path depth (number of segments)
      const pathDepth = parsedUrl.pathname === '/' 
        ? 0 
        : parsedUrl.pathname.split('/').filter(Boolean).length;
      
      // Initialize score
      let score = 0;
      
      // Scoring rules
      if (registrableNormalized.includes(brandNormalized)) score += 3;
      
      // Check for brand tokens in registrable domain
      for (const token of brandTokens) {
        if (registrableNormalized.includes(token)) {
          score += 2;
          break; // Only count once
        }
      }
      
      // Root path bonus
      if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') score += 2;
      
      // HTTPS bonus
      if (parsedUrl.protocol === 'https:') score += 1;
      
      // Penalty for blocked hosts
      if (blockedHosts.some(host => parsedUrl.hostname.endsWith(host))) score -= 4;
      
      // Path depth penalty (max -3)
      score -= Math.min(pathDepth, 3);
      
      return {
        url,
        score,
        length: url.length // For tie-breaking
      };
    } catch (e) {
      // Invalid URL
      return { url, score: -999, length: Infinity };
    }
  });
  
  // Sort by score (descending), then by URL length (ascending)
  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.length - b.length;
  });
  
  // Return the best candidate or null
  return scored.length > 0 && scored[0].score > -5 ? scored[0].url : null;
}

// Default export for convenience
export default extractOfficialSite;
