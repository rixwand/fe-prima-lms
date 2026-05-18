export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";
export const AUTH_SECRET: string = process.env.NEXTAUTH_SECRET as string;
export const NODE_ENV: string = process.env.NODE_ENV || "development";

const wsUrlFromApi = API_URL ? API_URL.replace(/\/api\/?$/, "") : "";
export const WS_URL: string = process.env.NEXT_PUBLIC_WS_URL || wsUrlFromApi;

export const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const SUPABASE_BUCKET: string = process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string;

export const SITE_URL: string = process.env.NEXT_PUBLIC_SITE_URL as string;

const parsedDelay = Number(process.env.NEXT_PUBLIC_AXIOS_SIMULATED_DELAY_MS ?? "3000");
export const AXIOS_SIMULATED_DELAY_MS: number = Number.isFinite(parsedDelay) ? Math.max(0, parsedDelay) : 3000;
