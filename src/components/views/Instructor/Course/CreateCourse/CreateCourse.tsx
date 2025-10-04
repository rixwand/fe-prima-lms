import { SUPABASE_BUCKET, SUPABASE_URL } from "@/config/env";
import { storageClient } from "@/libs/supabase/client";
import cn from "@/libs/utils/cn";
import { toSlug } from "@/libs/utils/string";
import { CalendarDate, addToast } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuChevronLeft, LuChevronRight, LuCircleCheck, LuEye, LuImage, LuStar, LuUsers } from "react-icons/lu";
import BasicsForm from "./Forms/BasicForm";
import CurriculumBuilder from "./Forms/CurriculumBuilder";
import PricingPanel from "./Forms/PricingPanel";

export type CourseForm = {
  title: string;
  status: "PUBLISHED" | "DRAFT";
  coverImage: FileList;
  previewVideo?: string;
  shortDescription: string;
  descriptionJson?: string;
  priceAmount: number;
  isFree?: boolean; // default false in Yup, but optional in type
  tags: string[];
  sections?: {
    title: string;
    lessons?: {
      id: string;
      title: string;
      summary?: string;
      durationSec?: number;
      isPreview?: boolean; // default false in Yup
    }[];
  }[];
  discount?: {
    type: "FIXED" | "PERCENTAGE"; // from DiscountType/DiscountTypes
    value: number;
    label?: string;
    isActive?: boolean; // default true in Yup
    startAt?: CalendarDate;
    endAt?: CalendarDate;
  };
};

export default function CreateCourse({
  onCancel,
  onFinish,
}: {
  onCancel: () => void;
  onFinish: (payload: { title: string; cover?: string }) => void;
}) {
  const [step, setStep] = useState(1);
  const [basics, setBasics] = useState<NewCourseBasics>({
    title: "",
    subtitle: "",
    category: "Development",
    level: "Beginner",
    language: "English",
    description: "",
    tags: [],
  });
  const [curriculum, setCurriculum] = useState<CurriculumSection[]>([]);
  // const [pricing, setPricing] = useState<Pricing>({ price: 19.99, visibility: "Public" });
  const [isLoading, setLoading] = useState(false);

  const methods = useForm<CourseForm>({
    defaultValues: {
      priceAmount: 0,
      tags: [],
      discount: { value: 0, isActive: false, label: "", type: "PERCENTAGE" },
      sections: [],
    },
    // resolver: yupResolver(createCourseSchema)
  });

  const onSubmit = async (value: CourseForm) => {
    setLoading(true);
    const fileImage = value.coverImage[0];
    const ext = fileImage.name.split(".").pop();
    const path = `courses/${toSlug(value.title)}.${ext}`;
    const { error, data } = await storageClient.from(SUPABASE_BUCKET).upload(path, fileImage);
    if (error) {
      addToast({ color: "danger", title: "Error uploading image", description: error.message });
      setLoading(false);
      return;
    }
    const urlImg = SUPABASE_URL + "/object/public/" + data.fullPath;
    const courseData = { ...value, coverImage: urlImg };
    setLoading(false);
  };

  const fileList = methods.watch("coverImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;

  // const canNextBasics = basics.title.trim().length >= 5 && basics.description.trim().length >= 20;
  const canNextBasics = true;
  const canPublish = canNextBasics && curriculum.some(s => s.lessons.length > 0);

  const goNext = () => setStep(s => Math.min(3, s + 1));
  const goPrev = () => setStep(s => Math.max(1, s - 1));

  const saveDraft = () => {
    alert("Draft saved ✨ (demo)");
    onFinish({ title: basics.title || "Untitled Course", cover: basics.thumbnail });
  };

  const publish = () => {
    if (!canPublish) return alert("Add at least 1 lesson to publish.");
    alert("Course published 🚀 (demo)");
    onFinish({ title: basics.title || "Untitled Course", cover: basics.thumbnail });
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        {/* Stepper */}
        <div className="flex items-center gap-3">
          <StepPill active={step === 1} done={step > 1} label="Basics" />
          <LuChevronRight className="w-4 h-4 text-slate-400" />
          <StepPill active={step === 2} done={step > 2} label="Pricing" />
          <LuChevronRight className="w-4 h-4 text-slate-400" />
          <StepPill active={step === 3} done={false} label="Curriculum" />
        </div>

        {/* Panels */}
        <FormProvider {...methods}>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}>
                  <BasicsForm />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}>
                  <PricingPanel />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}>
                  <CurriculumBuilder />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FormProvider>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={saveDraft}
              className="h-10 px-4 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50">
              Save Draft
            </button>
          </div>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={goPrev}
                className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-2">
                <LuChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 3 ? (
              <button
                // onClick={async () => {
                //   const isValid = await methods.trigger(["title", "shortDescription", "coverImage", "tags"]);
                //   if (isValid) goNext();
                // }}
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={step === 1 && !canNextBasics}
                className={cn(
                  "h-10 px-4 rounded-xl bg-blue-600 text-white font-medium inline-flex items-center gap-2",
                  step === 1 && !canNextBasics && "opacity-50 cursor-not-allowed"
                )}>
                Next <LuChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={publish}
                disabled={!canPublish}
                className={cn(
                  "h-10 px-4 rounded-xl bg-emerald-600 text-white font-medium",
                  !canPublish && "opacity-50 cursor-not-allowed"
                )}>
                Go to Lesson Editor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview / Help */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <LuEye className="w-4 h-4" /> Live Preview
          </div>
          <div className="p-4">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="relative aspect-video bg-slate-100 grid place-items-center">
                {preview ? (
                  <img src={preview} alt="thumb" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 text-sm flex flex-col items-center">
                    <LuImage className="w-8 h-8 mb-1" />
                    Thumbnail
                  </div>
                )}
                <span className="absolute left-3 top-3 text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white">
                  {/* {pricing.visibility} */}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <p className="font-semibold">{basics.title || "Course title"}</p>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {basics.subtitle || basics.description || "Write a compelling subtitle or description."}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <LuStar className="w-3.5 h-3.5" /> 0.0
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <LuUsers className="w-3.5 h-3.5" /> 0
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {/* <PiMoneyWavyLight size={16} /> {formatRupiah(pricing.price)} */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
          <p className="text-sm font-medium mb-2">Tips</p>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Use actionable titles (e.g., “Build a REST API with Express & Prisma”).</li>
            <li>Each lesson should have a clear outcome in 5–10 minutes.</li>
            <li>Mark 1–2 lessons as preview to attract learners.</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

function StepPill({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 h-9 rounded-full border text-sm",
        active
          ? "border-blue-600 text-blue-700 bg-blue-50"
          : done
          ? "border-emerald-600 text-emerald-700 bg-emerald-50"
          : "border-slate-200 text-slate-600"
      )}>
      {done ? <LuCircleCheck className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current opacity-60" />}
      {label}
    </div>
  );
}
