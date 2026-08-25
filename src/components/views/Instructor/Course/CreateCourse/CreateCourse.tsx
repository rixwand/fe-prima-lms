import UserCourseCard from "@/components/commons/Cards/UserCourseCard";
import useCourse from "@/hooks/course/useCourse";
import useUploadFile from "@/hooks/use-uploadFile";
import { getUnknownErrorMessage } from "@/libs/axios/error";
import cn from "@/libs/utils/cn";
import { toSlug } from "@/libs/utils/string";
import { Spinner, addToast } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuChevronLeft, LuChevronRight, LuCircleCheck, LuEye } from "react-icons/lu";
import BasicsForm from "./Forms/BasicForm";
import CurriculumBuilder from "./Forms/CurriculumBuilder";
import PricingPanel from "./Forms/PricingPanel";
import { CourseForm } from "./form.type";

export default function CreateCourse({ onCancel, onFinish }: { onCancel: () => void; onFinish: () => void }) {
  const { data: user } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CourseForm>({
    defaultValues: {
      priceAmount: 0,
      tags: [],
      sections: [],
    },
  });
  const {
    createCourse,
    pending: { isCreateCoursePending },
  } = useCourse(0, { enabled: false, onCreateCourseSuccess: onFinish });
  const { uploadImages } = useUploadFile();
  const onSubmit = async (value: CourseForm) => {
    try {
      setLoading(true);
      const urlImg = await uploadImages({ files: value.coverImage?.[0], prefix: "course", fileName: value.title });
      const categoryIds = value.categories.map(c => c.id);
      const courseData = { ...value, coverImage: urlImg, categories: { ids: categoryIds, primaryId: categoryIds[0] } };
      if (value.discount == undefined) Reflect.deleteProperty(courseData, "discount");
      setLoading(false);
      console.log(courseData);
      return createCourse(courseData);
    } catch (error) {
      addToast({
        color: "danger",
        title: "Error uploading image",
        description: getUnknownErrorMessage(error),
      });
      console.error(error);
    }
  };

  const fileList = methods.watch("coverImage");
  const preview = fileList?.[0] ? URL.createObjectURL(fileList[0]) : null;

  const goNext = () => setStep(s => Math.min(3, s + 1));
  const goPrev = () => setStep(s => Math.max(1, s - 1));

  const validateBasicForm = async () => {
    const isValid = await methods.trigger(["title", "shortDescription", "coverImage", "tags", "categories"]);
    if (isValid) goNext();
    // goNext();
  };

  const validatePricing = async () => {
    const isValid = await methods.trigger(["priceAmount", "discount"]);
    if (isValid) goNext();
    // goNext();
  };

  const [title, price, discount, categories, tags] = methods.watch([
    "title",
    "priceAmount",
    "discount",
    "categories",
    "tags",
  ]);

  const saveCourse = methods.handleSubmit(onSubmit);

  return (
    <section className="grid grid-cols-1 @5xl:grid-cols-12 gap-8">
      <div className="@5xl:col-span-8 space-y-6">
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
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 @container">
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
            {step == 2 && (
              <button
                onClick={saveCourse}
                disabled={isLoading || isCreateCoursePending}
                className="h-10 flex items-center gap-x-2 disabled:opacity-50 px-4 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50">
                {isLoading || isCreateCoursePending ? (
                  <Fragment>
                    <Spinner size="sm" color="primary" />
                    Uploading
                  </Fragment>
                ) : (
                  "Save Draft"
                )}
              </button>
            )}
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
                type="button"
                onClick={step == 1 ? validateBasicForm : step == 2 ? validatePricing : undefined}
                className={cn(
                  "h-10 px-4 rounded-xl bg-blue-600 text-white font-medium inline-flex items-center gap-2",
                )}>
                Next <LuChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={saveCourse}
                disabled={isLoading || isCreateCoursePending}
                className={cn([
                  "h-10 flex gap-x-2 items-center px-4 rounded-xl bg-emerald-600 text-white font-medium disabled:bg-emerald-600/50",
                ])}>
                {isLoading || isCreateCoursePending ? (
                  <Fragment>
                    <Spinner size="sm" color="white" />
                    Uploading
                  </Fragment>
                ) : (
                  "Save Course"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview / Help */}
      <aside className="@5xl:col-span-4 space-y-6 grid-cols-12 grid @5xl:grid-cols-1 @container gap-3">
        <div className="rounded-2xl border border-slate-200 max-w-md bg-white shadow-sm overflow-hidden @4xl:col-span-6 col-span-12">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <LuEye className="w-4 h-4" /> Live Preview
          </div>
          <div className="p-6 grid">
            <UserCourseCard
              disabled
              course={{
                categories: (categories ?? []).map(({ name }) => ({ name, slug: toSlug(name) })),
                tags: tags.map(name => ({ name, slug: toSlug(name) })),
                slug: toSlug(title ?? ""),
                metaApproved: {
                  coverImage: preview || "/images/thumbnail-placeholder.svg",
                  priceAmount: price,
                  title: title || "Course Title",
                },
                owner: {
                  fullName: user?.user.fullName || "instructor Name",
                  profilePict: user?.user.image || "/images/user.jpg",
                  username: user?.user.name || "instructor Name",
                },
                discounts: discount && [
                  {
                    id: 0,
                    courseId: 0,
                    endAt: discount.endAt?.toString() || "",
                    startAt: discount.startAt?.toString() || "",
                    isActive: discount.isActive == undefined ? false : discount.isActive,
                    label: discount.label || "Discount",
                    type: discount.type,
                    value: discount.value,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl h-fit border border-slate-200 bg-white shadow-sm p-4 col-span-12 @4xl:col-span-6">
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
            : "border-slate-200 text-slate-600",
      )}>
      {done ? <LuCircleCheck className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current opacity-60" />}
      {label}
    </div>
  );
}
