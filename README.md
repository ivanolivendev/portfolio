# Ivan Decodes

React + TypeScript portfolio for Ivan Decodes, with responsive editorial styling, reusable project/video cards, and routes for Home, Projects, project details, Videos, About, Contact, and 404.

## Run locally

```bash
pnpm install
pnpm dev
```

The app expects a server-side `GET /api/youtube` endpoint returning:

```json
{ "videos": [{ "id": "...", "title": "...", "thumbnail": "...", "publishedAt": "2026-01-01T00:00:00Z", "url": "https://www.youtube.com/watch?v=..." }] }
```

That endpoint should use the YouTube Data API (or another server-side retrieval strategy), keep credentials out of client code, cache/revalidate results, and return the newest public videos from `@ivandecodes`. The UI includes loading, empty, and failure states and links to the official channel when the endpoint is unavailable.

For Vercel, `api/youtube.ts` is included and expects `YOUTUBE_API_KEY` and the verified `YOUTUBE_CHANNEL_ID` environment variables. It returns the newest three public videos and applies a 15-minute edge cache.

## Build

```bash
pnpm build
```

Social URLs are centralized in `src/data.ts` and should be replaced with verified profiles before deployment.
