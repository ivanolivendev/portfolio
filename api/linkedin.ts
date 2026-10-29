type VercelRequest = { method?: string; query?: Record<string, string | string[]> };
type VercelResponse = { status: (code:number)=>VercelResponse; setHeader:(key:string,value:string)=>void; json:(body:unknown)=>void };

// LinkedIn does not expose a public profile feed without authenticated access.
// Deployments can provide a server-side RSS/Atom bridge through LINKEDIN_FEED_URL.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const feedUrl = process.env.LINKEDIN_FEED_URL;
  if (!feedUrl) return res.status(200).json({ articles: [] });
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error('LinkedIn feed request failed');
    const xml = await response.text();
    const articles = [...xml.matchAll(/<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g)].slice(0, 6).flatMap(([, item], index) => {
      const value = (tag:string) => item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const title = value('title'); const url = value('link') || value('guid');
      if (!title || !url) return [];
      return [{ id: url || String(index), title, excerpt: value('description'), publishedAt: value('pubDate') || value('published'), url }];
    });
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({ articles });
  } catch { return res.status(502).json({ error: 'Unable to retrieve LinkedIn articles' }); }
}
