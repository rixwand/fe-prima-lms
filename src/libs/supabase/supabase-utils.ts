import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/env";
import { StorageClient } from "@supabase/storage-js";
export const storageClient = new StorageClient(SUPABASE_URL, {
  apiKey: SUPABASE_ANON_KEY,
  Authorization: "Bearer " + SUPABASE_ANON_KEY,
});

export async function uploadStreamed(
  file: File,
  signedUrl: string,
  onProgress?: (event: { progress: number }) => void,
) {
  const total = file.size;
  let uploaded = 0;

  const reader = file.stream().getReader();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) return controller.close();
      uploaded += value.length;
      onProgress?.({ progress: Math.round((uploaded / total) * 100) });
      controller.enqueue(value);
    },
  });

  await fetch(signedUrl, {
    method: "PUT",
    // ⬇️ Chromium requires this when using a streaming body
    // @ts-expect-error: 'duplex' is not in the TS type yet
    duplex: "half",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: stream,
  });
}
// export async function uploadImage(file: File, fileName: string) {
//   const path = `courses/${toSlug(fileName)}.avif`;

//   const buffer = Buffer.from(await file.arrayBuffer());

//   const avifBuffer = await sharp(buffer)
//     .avif({
//       quality: 80,
//       effort: 4, // 0-9, higher = smaller file but slower
//     })
//     .toBuffer();

//   const { data, error } = await storageClient.from(SUPABASE_BUCKET).upload(path, avifBuffer, {
//     upsert: true,
//     contentType: "image/avif",
//   });

//   if (error) {
//     throw error;
//   }

//   return `${SUPABASE_URL}/object/public/${data.fullPath}`;
// }
