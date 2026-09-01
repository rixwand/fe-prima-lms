import { uploadImages } from "@/server/supabase/supabase-utils";
import formidable, { Fields, Files } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import * as yup from "yup";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadSchema = yup.object({
  prefix: yup.string().required(),
  fileName: yup.string().optional(),
});

function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFiles: 10,
      maxFileSize: 5 * 1024 * 1024,
      filter: ({ mimetype }) => mimetype?.startsWith("image/") ?? false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      resolve({ fields, files });
    });
  });
}

function normalizeFields(fields: Fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const parsedFields = normalizeFields(fields);
    const payload = await uploadSchema.validate(JSON.parse(parsedFields.payload ?? "{}"), {
      stripUnknown: true,
    });
    const imageFiles = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];
    if (!imageFiles.length) {
      return res.status(400).json({
        message: "No images uploaded",
      });
    }
    for (const file of imageFiles) {
      if (!file.mimetype?.startsWith("image/")) {
        return res.status(400).json({
          message: "Invalid file type",
        });
      }
    }
    const urls = await uploadImages(imageFiles, payload.prefix, payload.prefix);
    return res.status(200).json({ urls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Upload failed",
    });
  }
}
