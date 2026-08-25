import { SUPABASE_BUCKET, SUPABASE_URL } from "@/config/env";
import { storageClient } from "@/libs/supabase/client";
import { toSlug } from "@/libs/utils/string";
import { File } from "formidable";
import { readFile } from "fs/promises";
import sharp from "sharp";
import uniqueSlug from "unique-slug";

export async function uploadImages(files: File[], prefix: string, fileName?: string): Promise<string[]> {
  const fileList = Array.isArray(files) ? files : [files];

  const urls = await Promise.all(
    fileList.map(async (file, index) => {
      const buffer = await readFile(file.filepath);
      const avifBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .avif({ quality: 80, effort: 4 })
        .toBuffer();
      const path = `${prefix}/${fileName ? toSlug(`${fileName}-${index}-${uniqueSlug()}`) : uniqueSlug()}.avif`;
      const { data, error } = await storageClient.from(SUPABASE_BUCKET).upload(path, avifBuffer, {
        upsert: false,
        contentType: "image/avif",
      });
      if (error) {
        throw error;
      }
      return `${SUPABASE_URL}/object/public/${data.fullPath}`;
    }),
  );

  return urls;
}
