import brands from '../data/brands.json';
export function getAllBrands() { return brands; }
export function getBrandBySlug(slug) { return brands.find(b => b.slug === slug); }
