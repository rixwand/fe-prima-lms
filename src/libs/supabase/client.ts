import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/env";
import { StorageClient } from "@supabase/storage-js";
export const storageClient = new StorageClient(SUPABASE_URL, {
  apiKey: SUPABASE_ANON_KEY,
  Authorization: "Bearer " + SUPABASE_ANON_KEY,
});
