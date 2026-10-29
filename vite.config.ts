import { defineConfig, type Plugin } from 'vite'; import react from '@vitejs/plugin-react';

function youtubeDevApi(): Plugin {
  return { name:'youtube-dev-api', configureServer(server) {
    server.middlewares.use('/api/youtube', async (_req, res) => {
      try {
        const channelPage = await fetch('https://www.youtube.com/@ivandecodes');
        const html = await channelPage.text();
        const channelId = html.match(/(?:\\"|\")channelId(?:\\"|\")\s*:\s*(?:\\"|\")(UC[^\\"\"]+)/)?.[1] ?? html.match(/browseId["']\s*[:=]\s*["'](UC[^"']+)/)?.[1];
        if (!channelId) throw new Error('Channel ID not found');
        const feed = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const xml = await feed.text();
        const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0,3).map(match => {
          const item = match[1]; const id = item.match(/<yt:videoId>([^<]+)</)?.[1];
          const title = item.match(/<media:title>([^<]+)</)?.[1]; const publishedAt = item.match(/<published>([^<]+)</)?.[1];
          return id && title && publishedAt ? { id, title, publishedAt, thumbnail:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, url:`https://www.youtube.com/watch?v=${id}` } : null;
        }).filter(Boolean);
        res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({videos}));
      } catch { res.statusCode=502; res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({error:'Unable to retrieve videos'})); }
    });
  }};
}
export default defineConfig({ plugins:[react(), youtubeDevApi()] });
