type VercelRequest = { method?: string; query?: Record<string, string | string[]> };
type VercelResponse = { status: (code:number)=>VercelResponse; setHeader:(key:string,value:string)=>void; json:(body:unknown)=>void };

// Vercel-compatible server endpoint. Keep the API key server-side and cache the
// normalized response so a new upload appears without editing the React app.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const key = process.env.YOUTUBE_API_KEY;
    let channelId = process.env.YOUTUBE_CHANNEL_ID;
    if (!channelId) {
      const channelPage = await fetch('https://www.youtube.com/@ivandecodes');
      const html = await channelPage.text();
      channelId = html.match(/(?:\\"|\")channelId(?:\\"|\")\s*:\s*(?:\\"|\")(UC[^\\"\"]+)/)?.[1] ?? html.match(/browseId["']\s*[:=]\s*["'](UC[^"']+)/)?.[1];
    }
    if (!channelId) throw new Error('Channel ID not found');
    if (!key) {
      const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
      const xml = await feed.text();
      const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0,6).flatMap(match => {
        const item = match[1]; const id = item.match(/<yt:videoId>([^<]+)</)?.[1]; const title = item.match(/<media:title>([^<]+)</)?.[1]; const publishedAt = item.match(/<published>([^<]+)</)?.[1];
        return id && title && publishedAt ? [{ id, title, publishedAt, thumbnail:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url:`https://www.youtube.com/watch?v=${id}` }] : [];
      });
      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600'); return res.status(200).json({ videos });
    }
    const cursor = typeof req.query?.cursor === 'string' ? req.query.cursor : undefined;
    const params = new URLSearchParams({ part:'snippet', channelId, maxResults:'6', order:'date', type:'video', key });
    if (cursor) params.set('pageToken', cursor);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!response.ok) throw new Error('YouTube request failed');
    const data = await response.json() as { items?: Array<{ id?: {videoId?:string}; snippet?: {title?:string; publishedAt?:string; thumbnails?: {high?: {url?:string}; medium?: {url?:string}}} }> };
    const videos = (data.items ?? []).flatMap(item => {
      const id = item.id?.videoId; const snippet = item.snippet;
      if (!id || !snippet?.title || !snippet.publishedAt) return [];
      return [{ id, title:snippet.title, publishedAt:snippet.publishedAt, thumbnail:snippet.thumbnails?.high?.url ?? snippet.thumbnails?.medium?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url:`https://www.youtube.com/watch?v=${id}` }];
    });
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({ videos, nextCursor:data.nextPageToken });
  } catch { return res.status(502).json({ error: 'Unable to retrieve videos' }); }
}
