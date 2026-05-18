This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## WebSocket Setup

1. Set WebSocket URL in `.env` (optional if your API host is the same origin):

```bash
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

2. Use `useWebSocket` hook from `src/hooks/use-websocket.ts` inside client components/pages:

```tsx
import { useWebSocket } from "@/hooks/use-websocket";

export default function NotificationsPage() {
  const { status, lastMessage, emit } = useWebSocket({
    namespace: "/notifications",
    includeAuthToken: true,
  });

  return (
    <div>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(lastMessage ?? "-", null, 2)}</pre>
      <button onClick={() => emit("ping", { from: "frontend" })}>Ping</button>
    </div>
  );
}
```

The hook uses `socket.io-client` and sends NextAuth `accessToken` during handshake by default (`auth.accessToken` and query `accessToken`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
