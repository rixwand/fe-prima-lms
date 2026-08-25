import { getUnknownErrorMessage } from "@/libs/axios/error";
import uploadFileService from "@/services/upload-file.service";
import { addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useNProgress } from "./use-nProgress";

type UploadImagesForm = {
  files: File | File[];
  prefix: string;
  fileName?: string;
};

export default function () {
  const { mutateAsync: uploadImages, isPending: isUploadImagesPending } = useMutation({
    mutationFn: async (data: UploadImagesForm) => {
      const res = await uploadFileService.uploadImages(buildFormData(data));
      return res.data.urls;
    },
    onError: error => {
      console.log(error);
      addToast({
        title: "Failed to upload Images",
        description: getUnknownErrorMessage(error),
        color: "danger",
      });
    },
  });
  useNProgress(isUploadImagesPending);
  return {
    uploadImages,
    isUploadImagesPending,
  };
}

const buildFormData = ({ files, prefix, fileName }: UploadImagesForm) => {
  const imagesFile = Array.isArray(files) ? files : [files];
  const formData = new FormData();
  for (let images of imagesFile) {
    formData.append("images", images);
  }
  formData.append(
    "payload",
    JSON.stringify({
      prefix,
      fileName,
    }),
  );

  return formData;
};
