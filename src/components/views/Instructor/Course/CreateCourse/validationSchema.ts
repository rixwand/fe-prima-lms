import * as yup from "yup";
const DiscountTypes = ["FIXED", "PERCENTAGE"] as const;
type DiscountType = (typeof DiscountTypes)[number];
export const createCourseSchema = yup.object({
  title: yup.string().required(),
  status: yup.mixed<"PUBLISHED" | "DRAFT">().oneOf(["PUBLISHED", "DRAFT"]),
  coverImage: yup.string().required(),
  previewVideo: yup.string().optional(),
  shortDescription: yup.string().required(),
  descriptionJson: yup.string().optional(),
  priceAmount: yup.number().required(),
  isFree: yup.boolean().optional().default(false),
  tags: yup.array().of(yup.string().trim().required()).min(1).required(),
  sections: yup
    .array(
      yup.object({
        title: yup.string().required(),
        lessons: yup
          .array(
            yup.object({
              title: yup.string().required(),
              summary: yup.string().optional(),
              durationSec: yup.number().optional(),
              isPreview: yup.boolean().default(false).optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  discount: yup
    .object({
      type: yup.mixed<DiscountType>().defined().oneOf(DiscountTypes).required(),
      value: yup
        .number()
        .required()
        .when("type", {
          is: "PERCENTAGE",
          then: s => s.min(0).max(100),
          otherwise: s => s.positive(),
        }),
      label: yup.string().optional(),
      isActive: yup.boolean().default(true).optional(),
      startAt: yup.date().min(new Date(), "must be equal or greater than the current time").optional(),
      endAt: yup.date().optional(),
    })
    .optional(),
});
