# Hustle Bro Roast Machine™

Leveraging AI to disrupt cringe at scale. Paste any AI-generated hustle bro LinkedIn post, receive a devastating corporate-speak comment ready to deploy.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic SDK** (server-side only — key never exposed to client)

---

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd roast-machine
npm install
```

### 2. Set up your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add `ANTHROPIC_API_KEY`.

### Option B — GitHub + Vercel dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

That's it. Vercel auto-detects Next.js.

---

## How it works

The frontend (`app/page.tsx`) sends POST requests to `/api/roast`. That route (`app/api/roast/route.ts`) runs **server-side on Vercel** and calls the Anthropic API using your secret key — which is never sent to the browser.

---

## Customising

- **Model**: change `claude-opus-4-5` in `app/api/roast/route.ts` to any Anthropic model
- **Personas / intensities**: edit the `personaDesc` / `intensityDesc` maps in the API route
- **Styling**: all design tokens are CSS variables in `app/globals.css`
