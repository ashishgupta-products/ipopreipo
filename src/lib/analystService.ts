import { IpoAnalyst } from '../types/analyst';
import analystsData from '../data/ipo_analysts.json';

export function getAllAnalysts(): IpoAnalyst[] {
  return analystsData as IpoAnalyst[];
}

export function getAnalystBySlug(slug: string): IpoAnalyst | undefined {
  return (analystsData as IpoAnalyst[]).find(
    (a) => a.slug === slug || a.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getTopAnalysts(limit: number = 10): IpoAnalyst[] {
  return (analystsData as IpoAnalyst[]).slice(0, limit);
}

export function searchAnalysts(query: string): IpoAnalyst[] {
  if (!query || !query.trim()) return analystsData as IpoAnalyst[];
  const q = query.toLowerCase().trim();
  return (analystsData as IpoAnalyst[]).filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      (a.sebiRegId && a.sebiRegId.toLowerCase().includes(q))
  );
}
